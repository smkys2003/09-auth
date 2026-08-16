"use client";

import { type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { login } from "@/lib/api/clientApi";
import { useAuthStore } from "@/lib/store/authStore";
import css from "./SignInPage.module.css";

export default function SignInPage() {
  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser);
  const mutation = useMutation({
    mutationFn: login,
    onSuccess: (user) => {
      setUser(user);
      router.push("/profile");
      router.refresh();
    },
  });

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    mutation.mutate({
      email: String(formData.get("email") ?? ""),
      password: String(formData.get("password") ?? ""),
    });
  };

  return (
    <main className={css.mainContent}>
      <form className={css.form} onSubmit={handleSubmit}>
        <h1 className={css.formTitle}>Sign in</h1>
        <div className={css.formGroup}>
          <label htmlFor="email">Email</label>
          <input
            className={css.input}
            id="email"
            name="email"
            required
            type="email"
          />
        </div>
        <div className={css.formGroup}>
          <label htmlFor="password">Password</label>
          <input
            className={css.input}
            id="password"
            name="password"
            required
            type="password"
          />
        </div>
        <div className={css.actions}>
          <button
            className={css.submitButton}
            disabled={mutation.isPending}
            type="submit"
          >
            {mutation.isPending ? "Logging in..." : "Log in"}
          </button>
        </div>
        {mutation.isError && (
          <p className={css.error}>{mutation.error.message}</p>
        )}
      </form>
    </main>
  );
}
