import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import FloatingBalloons from "@/components/FloatingBalloons";
import WishReveal from "@/components/WishReveal";
import { getWishBySlug } from "@/lib/wishes.functions";

export const Route = createFileRoute("/wish/$slug")({
  loader: async ({ params }) => {
    const { wish } = await getWishBySlug({ data: { slug: params.slug } });
    if (!wish) throw notFound();
    return { wish };
  },
  head: ({ loaderData }) => {
    const name = loaderData?.wish?.recipient_name ?? "you";
    return {
      meta: [
        { title: `Happy Birthday, ${name}!` },
        { name: "description", content: `A special birthday wish for ${name}.` },
        { property: "og:title", content: `Happy Birthday, ${name}!` },
        { property: "og:description", content: `A special birthday wish for ${name}.` },
        { name: "robots", content: "noindex" },
      ],
    };
  },
  errorComponent: ({ error }) => (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 text-center">
      <div>
        <h1 className="font-display text-4xl text-deep-rose">Oops</h1>
        <p className="mt-2 text-muted-foreground">
          Couldn't load this wish. {error?.message}
        </p>
        <Link to="/" className="mt-6 inline-block rounded-full bg-deep-rose px-6 py-3 text-cream">
          Go home
        </Link>
      </div>
    </div>
  ),
  notFoundComponent: () => (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 text-center">
      <div>
        <div className="text-5xl">🎈</div>
        <h1 className="mt-3 font-display text-4xl text-deep-rose">Wish not found</h1>
        <p className="mt-2 text-muted-foreground">
          This birthday link doesn't exist or was removed.
        </p>
        <Link to="/" className="mt-6 inline-block rounded-full bg-deep-rose px-6 py-3 text-cream">
          Go home
        </Link>
      </div>
    </div>
  ),
  component: WishPage,
});

function WishPage() {
  const { wish } = Route.useLoaderData();
  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <div className="blob" style={{ width: 520, height: 520, top: -160, left: -140, background: "#f8c8d8" }} />
      <div className="blob" style={{ width: 460, height: 460, top: "30%", right: -120, background: "#fde68a", opacity: 0.5 }} />
      <div className="blob" style={{ width: 480, height: 480, bottom: -180, left: "30%", background: "#a7f3d0", opacity: 0.4 }} />

      <FloatingBalloons />

      <WishReveal
        recipientName={wish.recipient_name}
        senderName={wish.sender_name}
        message={wish.message}
        birthdayDate={wish.birthday_date}
      />
    </div>
  );
}
