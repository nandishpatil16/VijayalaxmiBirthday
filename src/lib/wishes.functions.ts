import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const SLUG_ALPHABET = "abcdefghijkmnpqrstuvwxyz23456789";

function makeSlug(len = 8) {
  let out = "";
  const bytes = new Uint8Array(len);
  crypto.getRandomValues(bytes);
  for (let i = 0; i < len; i++) {
    out += SLUG_ALPHABET[bytes[i] % SLUG_ALPHABET.length];
  }
  return out;
}

// ---------- Auth ----------

export const loginAdmin = createServerFn({ method: "POST" })
  .inputValidator(z.object({ password: z.string().min(1).max(200) }))
  .handler(async ({ data }) => {
    const expected = process.env.ADMIN_PASSWORD;
    console.log("[ADMIN LOGIN] expected password from env:", expected, "received password:", data.password);
    if (!expected) {
      throw new Error("ADMIN_PASSWORD not configured");
    }
    if (data.password !== expected) {
      await new Promise((r) => setTimeout(r, 400));
      return { ok: false as const };
    }
    const { getAdminSession } = await import("./admin-session.server");
    const session = await getAdminSession();
    await session.update({ isAdmin: true, loggedInAt: Date.now() });
    return { ok: true as const };
  });

export const logoutAdmin = createServerFn({ method: "POST" }).handler(
  async () => {
    const { getAdminSession } = await import("./admin-session.server");
    const session = await getAdminSession();
    await session.clear();
    return { ok: true };
  },
);

export const checkAdmin = createServerFn({ method: "GET" }).handler(
  async () => {
    const { getAdminSession } = await import("./admin-session.server");
    const session = await getAdminSession();
    return { isAdmin: !!session.data.isAdmin };
  },
);

// Global in-memory fallback store for local development when Supabase is not connected
interface MockWish {
  id: string;
  slug: string;
  recipient_name: string;
  sender_name: string;
  birthday_date: string;
  message: string;
  views: number;
  created_at: string;
}

const globalMockWishes = (globalThis as any)._mockWishes || new Map<string, MockWish>();
if (!(globalThis as any)._mockWishes) {
  (globalThis as any)._mockWishes = globalMockWishes;
  
  // Seed with an example wish
  globalMockWishes.set("ananya", {
    id: "mock-id-ananya",
    slug: "ananya",
    recipient_name: "Ananya",
    sender_name: "Mallikarjun",
    birthday_date: new Date().toISOString().split('T')[0],
    message: "Wishing you a magical birthday filled with sweet surprises and beautiful moments! 🎂🌸✨",
    views: 12,
    created_at: new Date().toISOString(),
  });
}

// ---------- Wishes ----------

const wishInput = z.object({
  recipient_name: z.string().trim().min(1).max(120),
  sender_name: z.string().trim().min(1).max(120),
  birthday_date: z.string().min(4).max(40),
  message: z.string().trim().min(1).max(4000),
});

// Public: anyone can create a wish
export const createWish = createServerFn({ method: "POST" })
  .inputValidator(wishInput)
  .handler(async ({ data }) => {
    let slug = makeSlug();

    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
      const id = typeof crypto.randomUUID === "function" ? crypto.randomUUID() : Math.random().toString(36).substring(2);
      const newWish: MockWish = {
        id,
        slug,
        recipient_name: data.recipient_name,
        sender_name: data.sender_name,
        birthday_date: data.birthday_date,
        message: data.message,
        views: 0,
        created_at: new Date().toISOString(),
      };
      globalMockWishes.set(slug, newWish);
      return { slug };
    }

    const { supabaseAdmin } = await import(
      "@/integrations/supabase/client.server"
    );

    for (let attempt = 0; attempt < 4; attempt++) {
      const { data: inserted, error } = await supabaseAdmin
        .from("wishes")
        .insert({
          slug,
          recipient_name: data.recipient_name,
          sender_name: data.sender_name,
          birthday_date: data.birthday_date,
          message: data.message,
          video_url: null,
        })
        .select("slug")
        .single();
      if (!error && inserted) {
        return { slug: inserted.slug };
      }
      if (error && error.code === "23505") {
        slug = makeSlug(9);
        continue;
      }
      throw new Error(error?.message ?? "Failed to create wish");
    }
    throw new Error("Could not generate a unique slug");
  });

// Admin only
export const listWishes = createServerFn({ method: "GET" }).handler(
  async () => {
    const { requireAdmin } = await import("./admin-session.server");
    await requireAdmin();

    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return {
        wishes: Array.from(globalMockWishes.values()).sort(
          (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        )
      };
    }

    const { supabaseAdmin } = await import(
      "@/integrations/supabase/client.server"
    );
    const { data, error } = await supabaseAdmin
      .from("wishes")
      .select(
        "id, slug, recipient_name, sender_name, birthday_date, message, views, created_at",
      )
      .order("created_at", { ascending: false })
      .limit(500);
    if (error) throw new Error(error.message);
    return { wishes: data ?? [] };
  },
);

export const deleteWish = createServerFn({ method: "POST" })
  .inputValidator(z.object({ id: z.string() }))
  .handler(async ({ data }) => {
    const { requireAdmin } = await import("./admin-session.server");
    await requireAdmin();

    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
      let foundSlug: string | null = null;
      for (const [slug, wish] of globalMockWishes.entries()) {
        if (wish.id === data.id) {
          foundSlug = slug;
          break;
        }
      }
      if (foundSlug) {
        globalMockWishes.delete(foundSlug);
      }
      return { ok: true };
    }

    const { supabaseAdmin } = await import(
      "@/integrations/supabase/client.server"
    );
    const { error } = await supabaseAdmin
      .from("wishes")
      .delete()
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const getWishBySlug = createServerFn({ method: "GET" })
  .inputValidator(z.object({ slug: z.string().min(3).max(40) }))
  .handler(async ({ data }) => {
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
      const wish = globalMockWishes.get(data.slug);
      if (!wish) return { wish: null };
      wish.views += 1;
      const { views: _views, ...publicWish } = wish;
      return { wish: publicWish };
    }

    const { supabaseAdmin } = await import(
      "@/integrations/supabase/client.server"
    );
    const { data: wish, error } = await supabaseAdmin
      .from("wishes")
      .select("recipient_name, sender_name, birthday_date, message, views")
      .eq("slug", data.slug)
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!wish) return { wish: null };
    void supabaseAdmin
      .from("wishes")
      .update({ views: (wish.views ?? 0) + 1 })
      .eq("slug", data.slug);
    const { views: _views, ...publicWish } = wish;
    return { wish: publicWish };
  });
