"use client";

import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import Modal from "@/components/Modal/Modal";
import { fetchNoteById } from "@/lib/api/clientApi";
import css from "./NotePreview.module.css";

interface NotePreviewProps {
  id: string;
}

export default function NotePreview({ id }: NotePreviewProps) {
  const router = useRouter();
  const {
    data: note,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["note", id],
    queryFn: () => fetchNoteById(id),
    refetchOnMount: false,
  });
  const closeModal = () => router.back();

  return (
    <Modal onClose={closeModal}>
      <div className={css.container}>
        {isLoading && <p>Loading, please wait...</p>}
        {isError && <p>Something went wrong.</p>}
        {note && (
          <div className={css.item}>
            <div className={css.header}>
              <h2>{note.title}</h2>
            </div>
            <p className={css.tag}>{note.tag}</p>
            <p className={css.content}>{note.content}</p>
            <p className={css.date}>
              Created: {new Date(note.createdAt).toLocaleDateString()}
            </p>
            <button className={css.backBtn} onClick={closeModal} type="button">
              Go back
            </button>
          </div>
        )}
      </div>
    </Modal>
  );
}
