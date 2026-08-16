import { NextResponse, type NextRequest } from "next/server";
import { parseSetCookie } from "cookie";
import { checkSession } from "./lib/api/serverApi";

const privateRoutes = ["/notes", "/profile"];
const authRoutes = ["/sign-in", "/sign-up"];

const matchesRoute = (pathname: string, route: string) =>
  pathname === route || pathname.startsWith(`${route}/`);

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasAccessToken = Boolean(request.cookies.get("accessToken")?.value);
  const hasRefreshToken = Boolean(request.cookies.get("refreshToken")?.value);
  const isPrivateRoute = privateRoutes.some((route) =>
    matchesRoute(pathname, route),
  );
  const isAuthRoute = authRoutes.some((route) => matchesRoute(pathname, route));
  let isAuthenticated = hasAccessToken;
  let refreshedCookies: string[] = [];

  if (!hasAccessToken && hasRefreshToken) {
    try {
      const sessionResponse = await checkSession(request.cookies.toString());
      isAuthenticated = sessionResponse.data.success;

      const setCookie = sessionResponse.headers["set-cookie"];
      refreshedCookies = Array.isArray(setCookie)
        ? setCookie
        : setCookie
          ? [setCookie]
          : [];
    } catch {
      isAuthenticated = false;
    }
  }

  refreshedCookies.forEach((cookie) => {
    const parsedCookie = parseSetCookie(cookie);

    if (parsedCookie.value) {
      request.cookies.set(parsedCookie.name, parsedCookie.value);
    }
  });

  let response: NextResponse;

  if (isPrivateRoute && !isAuthenticated) {
    response = NextResponse.redirect(new URL("/sign-in", request.url));
  } else if (isAuthRoute && isAuthenticated) {
    response = NextResponse.redirect(new URL("/profile", request.url));
  } else {
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("cookie", request.cookies.toString());
    response = NextResponse.next({ request: { headers: requestHeaders } });
  }

  refreshedCookies.forEach((cookie) => {
    response.headers.append("set-cookie", cookie);
  });

  return response;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
