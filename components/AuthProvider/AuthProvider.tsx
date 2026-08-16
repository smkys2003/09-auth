"use client";

import { useEffect, useState, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { checkSession, getMe, logout } from "@/lib/api/clientApi";
import { useAuthStore } from "@/lib/store/authStore";

interface AuthProviderProps {
  children: ReactNode;
}

const privateRoutes = ["/notes", "/profile"];

const isPrivatePath = (pathname: string) =>
  privateRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );

export default function AuthProvider({ children }: AuthProviderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, setUser, clearIsAuthenticated } = useAuthStore();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    let isActive = true;

    const verifySession = async () => {
      setIsChecking(true);

      try {
        const session = await checkSession();

        if (session.success) {
          const user = await getMe();
          if (isActive) setUser(user);
          return;
        }

        if (isActive) clearIsAuthenticated();

        if (isPrivatePath(pathname)) {
          try {
            await logout();
          } catch {
            // The session is already invalid, so redirecting is sufficient.
          }
          router.replace("/sign-in");
        }
      } catch {
        if (isActive) clearIsAuthenticated();
        if (isPrivatePath(pathname)) router.replace("/sign-in");
      } finally {
        if (isActive) setIsChecking(false);
      }
    };

    void verifySession();

    return () => {
      isActive = false;
    };
  }, [pathname, router, setUser, clearIsAuthenticated]);

  if (isChecking) return <p>Loading, please wait...</p>;
  if (isPrivatePath(pathname) && !isAuthenticated) {
    return null;
  }

  return children;
}
