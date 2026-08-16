"use client";

import { type FormEvent } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getMe, updateMe } from "@/lib/api/clientApi";
import { useAuthStore } from "@/lib/store/authStore";
import css from "./EditProfilePage.module.css";

export default function EditProfilePage() {
  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser);
  const userQuery = useQuery({ queryKey: ["currentUser"], queryFn: getMe });
  const updateMutation = useMutation({
    mutationFn: updateMe,
    onSuccess: (user) => {
      setUser(user);
      router.push("/profile");
      router.refresh();
    },
  });

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    updateMutation.mutate({
      username: String(formData.get("username") ?? "").trim(),
    });
  };

  if (userQuery.isPending) return <p>Loading, please wait...</p>;
  if (userQuery.isError) return <p>Unable to load the profile.</p>;

  const user = userQuery.data;

  return (
    <main className={css.mainContent}>
      <div className={css.profileCard}>
        <h1 className={css.formTitle}>Edit Profile</h1>
        <Image
          alt="User Avatar"
          className={css.avatar}
          height={120}
          src={user.avatar}
          width={120}
        />
        <form className={css.profileInfo} onSubmit={handleSubmit}>
          <div className={css.usernameWrapper}>
            <label htmlFor="username">Username:</label>
            <input
              className={css.input}
              defaultValue={user.username}
              id="username"
              name="username"
              required
              type="text"
            />
          </div>
          <p>Email: {user.email}</p>
          <div className={css.actions}>
            <button
              className={css.saveButton}
              disabled={updateMutation.isPending}
              type="submit"
            >
              Save
            </button>
            <button
              className={css.cancelButton}
              onClick={() => router.push("/profile")}
              type="button"
            >
              Cancel
            </button>
          </div>
          {updateMutation.isError && <p>Unable to update the profile.</p>}
        </form>
      </div>
    </main>
  );
}
