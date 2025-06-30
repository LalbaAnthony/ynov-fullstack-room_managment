import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("token")?.value;
  const userCookie = request.cookies.get("user")?.value;

  if (pathname === "/login") {
    return NextResponse.next();
  }

  console.log("🔒 Middleware exécuté sur :", request.nextUrl.pathname);

  if (!token || !userCookie) {
    console.log("🚫 Pas de token ou de user cookie, redirection vers /login");
    return NextResponse.redirect(new URL("/login", request.url));
  }

  let user: { isAdmin?: boolean } | null = null;
  try {
    user = JSON.parse(decodeURIComponent(userCookie));
  } catch (error) {
    console.error(
      "Erreur de parsing du cookie user dans le middleware:",
      error,
    );

    return NextResponse.redirect(new URL("/login", request.url));
  }

  const isAdmin = user?.isAdmin;

  if (pathname.startsWith("/admin") && !isAdmin) {
    console.log("🚫 Accès admin refusé, redirection vers /");
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|images|.*\\.svg).*)"],
};
