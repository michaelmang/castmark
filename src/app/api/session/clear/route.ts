import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SESSION_COOKIE } from "@/lib/auth";

/** Clears an orphaned session cookie (valid signature, account no longer
 * exists) and sends the user to /login. Route Handlers can modify cookies;
 * Server Components can't, so getCurrentAccount redirects here instead. */
export async function GET() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
  redirect("/login");
}
