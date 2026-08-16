import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { fetchNotes } from "@/lib/api/serverApi";
import type { Note } from "@/types/note";
import NotesClient from "./Notes.client";

const noteTags: Note["tag"][] = [
  "Todo",
  "Work",
  "Personal",
  "Meeting",
  "Shopping",
];
const siteUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";

interface NotesByTagPageProps {
  params: Promise<{ slug: string[] }>;
}

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: NotesByTagPageProps): Promise<Metadata> {
  const { slug } = await params;
  const selectedTag = slug[0] ?? "all";
  const filterName = selectedTag === "all" ? "All notes" : selectedTag;
  const title = `${filterName} | NoteHub`;
  const description = `Browse NoteHub notes filtered by ${filterName}.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${siteUrl}/notes/filter/${encodeURIComponent(selectedTag)}`,
      images: [
        { url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg" },
      ],
    },
  };
}

export default async function NotesByTagPage({ params }: NotesByTagPageProps) {
  const { slug } = await params;
  const selectedTag = slug[0];

  if (
    slug.length !== 1 ||
    (selectedTag !== "all" && !noteTags.includes(selectedTag as Note["tag"]))
  ) {
    notFound();
  }

  const tag = selectedTag === "all" ? undefined : (selectedTag as Note["tag"]);
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["notes", 1, "", tag],
    queryFn: () => fetchNotes({ page: 1, perPage: 12, tag }),
  });
  const prefetchError = queryClient.getQueryState(["notes", 1, "", tag])?.error;
  if (prefetchError) throw prefetchError;

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient tag={tag} />
    </HydrationBoundary>
  );
}
