import { cookies } from "next/headers";

export const ACCESS_COOKIE = "aa_access";
export const REFRESH_COOKIE = "aa_refresh";

export const cookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
};

export async function getAccessToken() {
  const store = await cookies();
  return store.get(ACCESS_COOKIE)?.value ?? null;
}
