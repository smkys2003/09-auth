import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getMe } from "@/lib/api/serverApi";
import css from "./ProfilePage.module.css";

const ogImage = "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg";
const siteUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  title: "Profile | NoteHub",
  description: "View your NoteHub profile information.",
  openGraph: {
    title: "Profile | NoteHub",
    description: "View your NoteHub profile information.",
    url: `${siteUrl}/profile`,
    images: [{ url: ogImage }],
  },
};

export default async function ProfilePage() {
  const user = await getMe();

  return (
    <main className={css.mainContent}>
      <div className={css.profileCard}>
        <div className={css.header}>
          <h1 className={css.formTitle}>Profile Page</h1>
          <Link className={css.editProfileButton} href="/profile/edit">
            Edit Profile
          </Link>
        </div>
        <div className={css.avatarWrapper}>
          <Image
            alt="User Avatar"
            className={css.avatar}
            height={120}
            src={user.avatar}
            width={120}
          />
        </div>
        <div className={css.profileInfo}>
          <p>Username: {user.username}</p>
          <p>Email: {user.email}</p>
        </div>
      </div>
    </main>
  );
}
