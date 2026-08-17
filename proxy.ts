import { NextResponse, type NextRequest } from "next/server";
import { cookies } from "next/headers";
import { parseSetCookie } from "cookie";
import { checkSession } from "./lib/api/serverApi";

const privateRoutes = ["/notes", "/profile"];
const authRoutes = ["/sign-in", "/sign-up"];

const matchesRoute = (pathname: string, route: string) =>
  pathname === route || pathname.startsWith(`${route}/`);

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  const refreshToken = cookieStore.get("refreshToken")?.value;
  const isPrivateRoute = privateRoutes.some((route) =>
    matchesRoute(pathname, route),
  );
  const isAuthRoute = authRoutes.some((route) => matchesRoute(pathname, route));

  if (!accessToken) {
    if (refreshToken) {
      try {
        const sessionResponse = await checkSession();
        const setCookie = sessionResponse.headers["set-cookie"];

        if (setCookie) {
          const cookieArray = Array.isArray(setCookie)
            ? setCookie
            : [setCookie];

          for (const cookieString of cookieArray) {
            const parsedCookie = parseSetCookie(cookieString);

            if (parsedCookie.value) {
              cookieStore.set(
                parsedCookie.name,
                parsedCookie.value,
                parsedCookie,
              );
            }
          }

          const headers = { Cookie: cookieStore.toString() };

          if (isAuthRoute) {
            return NextResponse.redirect(new URL("/profile", request.url), {
              headers,
            });
          }

          if (isPrivateRoute) {
            return NextResponse.next({ headers });
          }
        }
      } catch {
      }
    }

    if (isAuthRoute) {
      return NextResponse.next();
    }

    if (isPrivateRoute) {
      return NextResponse.redirect(new URL("/sign-in", request.url));
    }
  }

  if (isAuthRoute) {
    return NextResponse.redirect(new URL("/profile", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/profile/:path*", "/notes/:path*", "/sign-in", "/sign-up"],
};
