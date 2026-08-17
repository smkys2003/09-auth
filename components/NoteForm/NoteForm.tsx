"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createNote } from "@/lib/api/clientApi";
import { useNoteStore } from "@/lib/store/noteStore";
import type { CreateNoteData, Note } from "@/types/note";
import css from "./NoteForm.module.css";

const noteTags: Note["tag"][] = [
  "Todo",
  "Work",
  "Personal",
  "Meeting",
  "Shopping",
];

export default function NoteForm() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { draft, setDraft, clearDraft } = useNoteStore();

  useEffect(() => {
    void useNoteStore.persist.rehydrate();
  }, []);

  const mutation = useMutation({
    mutationFn: createNote,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["notes"],
        refetchType: "all",
      });
      clearDraft();
      router.back();
    },
  });

  const formAction = async (formData: FormData) => {
    const tag = formData.get("tag") as Note["tag"];
    const note: CreateNoteData = {
      title: String(formData.get("title") ?? "").trim(),
      content: String(formData.get("content") ?? "").trim(),
      tag,
    };

    await mutation.mutateAsync(note);
  };

  return (
    <form action={formAction} className={css.form}>
      <div className={css.formGroup}>
        <label htmlFor="title">Title</label>
        <input
          className={css.input}
          id="title"
          maxLength={50}
          minLength={3}
          name="title"
          onChange={(event) =>
            setDraft({ ...draft, title: event.target.value })
          }
          required
          type="text"
          value={draft.title}
        />
      </div>

      <div className={css.formGroup}>
        <label htmlFor="content">Content</label>
        <textarea
          className={css.textarea}
          id="content"
          maxLength={500}
          name="content"
          onChange={(event) =>
            setDraft({ ...draft, content: event.target.value })
          }
          rows={8}
          value={draft.content}
        />
      </div>

      <div className={css.formGroup}>
        <label htmlFor="tag">Tag</label>
        <select
          className={css.select}
          id="tag"
          name="tag"
          onChange={(event) =>
            setDraft({ ...draft, tag: event.target.value as Note["tag"] })
          }
          value={draft.tag}
        >
          {noteTags.map((tag) => (
            <option key={tag} value={tag}>
              {tag}
            </option>
          ))}
        </select>
      </div>

      {mutation.isError && (
        <p className={css.error}>Could not create note. Please try again.</p>
      )}

      <div className={css.actions}>
        <button
          className={css.cancelButton}
          onClick={() => router.back()}
          type="button"
        >
          Cancel
        </button>
        <button
          className={css.submitButton}
          disabled={mutation.isPending}
          type="submit"
        >
          {mutation.isPending ? "Creating..." : "Create note"}
        </button>
      </div>
    </form>
  );
}
