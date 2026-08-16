"use client";

import { type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { register } from "@/lib/api/clientApi";
import { useAuthStore } from "@/lib/store/authStore";
import css from "./SignUpPage.module.css";

export default function SignUpPage() {
  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser);
  const mutation = useMutation({
    mutationFn: register,
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
      <h1 className={css.formTitle}>Sign up</h1>
      <form className={css.form} onSubmit={handleSubmit}>
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
            minLength={6}
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
            {mutation.isPending ? "Registering..." : "Register"}
          </button>
        </div>
        {mutation.isError && (
          <p className={css.error}>{mutation.error.message}</p>
        )}
      </form>
    </main>
  );
}
