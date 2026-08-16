"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { logout } from "@/lib/api/clientApi";
import { useAuthStore } from "@/lib/store/authStore";
import css from "./AuthNavigation.module.css";

export default function AuthNavigation() {
  const router = useRouter();
  const { user, isAuthenticated, clearIsAuthenticated } = useAuthStore();

  const handleLogout = async () => {
    try {
      await logout();
    } finally {
      clearIsAuthenticated();
      router.push("/sign-in");
      router.refresh();
    }
  };

  if (!isAuthenticated) {
    return (
      <>
        <li className={css.navigationItem}>
          <Link className={css.navigationLink} href="/sign-in" prefetch={false}>
            Login
          </Link>
        </li>
        <li className={css.navigationItem}>
          <Link className={css.navigationLink} href="/sign-up" prefetch={false}>
            Register
          </Link>
        </li>
      </>
    );
  }

  return (
    <>
      <li className={css.navigationItem}>
        <Link className={css.navigationLink} href="/profile" prefetch={false}>
          Profile
        </Link>
      </li>
      <li className={css.navigationItem}>
        <p className={css.userEmail}>{user?.email}</p>
        <button
          className={css.logoutButton}
          onClick={handleLogout}
          type="button"
        >
          Logout
        </button>
      </li>
    </>
  );
}
