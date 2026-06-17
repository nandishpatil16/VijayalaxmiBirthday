import { useSession } from "@tanstack/react-start/server";

export type AdminSession = {
  isAdmin?: boolean;
  loggedInAt?: number;
};

export function getSessionConfig() {
  const password = process.env.SESSION_SECRET;
  if (!password || password.length < 32) {
    throw new Error(
      "SESSION_SECRET must be set and at least 32 characters long.",
    );
  }
  return {
    password,
    name: "bday_admin_session",
    cookie: {
      httpOnly: true,
      sameSite: "lax" as const,
      secure: true,
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    },
  };
}

export async function getAdminSession() {
  return useSession<AdminSession>(getSessionConfig());
}

export async function requireAdmin() {
  const session = await getAdminSession();
  if (!session.data.isAdmin) {
    throw new Error("UNAUTHORIZED");
  }
  return session;
}
