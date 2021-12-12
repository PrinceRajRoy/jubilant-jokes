import bcrypt from "bcrypt";
import { createCookieSessionStorage, redirect } from "remix";
import { db } from "./db.server";

type LoginType = {
  username: string;
  password: string;
};

export async function register({ username, password }: LoginType) {
  const passwordHash = await bcrypt.hash(password, 10);
  const user = await db.user.create({ data: { username, passwordHash } });
  return user;
}

export async function login({ username, password }: LoginType) {
  const user = await db.user.findFirst({ where: { username } });
  if (!user) {
    return null;
  }
  const passMatch = await bcrypt.compare(password, user.passwordHash);
  if (passMatch) {
    return user;
  }
  return null;
}

const sessionSecret = process.env.SESSION_SECRET;

if (!sessionSecret) {
  throw new Error("SESSION_SECRET env var not set");
}

const storage = createCookieSessionStorage({
  cookie: {
    name: "RJ_session",
    secure: process.env.NODE_ENV === "production",
    secrets: [sessionSecret],
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
    httpOnly: true,
  },
});

export async function createUserSession(userId: string, redirectTo: string) {
  const session = await storage.getSession();
  session.set("userId", userId);
  return redirect(redirectTo, {
    headers: {
      "Set-Cookie": await storage.commitSession(session),
    },
  });
}

function getUserSession(request: Request) {
  return storage.getSession(request.headers.get("Cookie"));
}

export async function getUserId(request: Request) {
  const session = await getUserSession(request);
  const userId = session.get("userId");
  if (typeof userId !== "string") {
    return null;
  }
  return userId;
}

export async function requireUserId(
  request: Request,
  redirectTo: string = new URL(request.url).pathname
) {
  const userId = await getUserId(request);
  if (!userId) {
    const params = new URLSearchParams([["redirectTo", redirectTo]]);
    throw redirect(`login?${params}`);
  }
  return userId;
}

export async function getUser(request: Request) {
  const userId = await getUserId(request);
  if (userId) {
    return db.user.findUnique({ where: { id: userId } });
  }
  return null;
}

export async function logout(request: Request) {
  const session = await getUserSession(request);
  return redirect("/jokes", {
    headers: {
      "Set-Cookie": await storage.destroySession(session),
    },
  });
}
