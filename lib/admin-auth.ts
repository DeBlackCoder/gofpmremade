import "server-only";
import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";

const SECRET = new TextEncoder().encode(
  process.env.ADMIN_SECRET ?? "change-me-in-production-32chars!!"
);

export async function createAdminSession() {
  const expiresAt = new Date(Date.now() + 8 * 60 * 60 * 1000); // 8 hours
  const token = await new SignJWT({ role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime(expiresAt)
    .sign(SECRET);

  const store = await cookies();
  store.set("admin_session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    expires: expiresAt,
    path: "/",
  });
}

export async function verifyAdminSession(): Promise<boolean> {
  try {
    const store = await cookies();
    const token = store.get("admin_session")?.value;
    if (!token) return false;
    await jwtVerify(token, SECRET);
    return true;
  } catch {
    return false;
  }
}

export async function deleteAdminSession() {
  const store = await cookies();
  store.delete("admin_session");
}
