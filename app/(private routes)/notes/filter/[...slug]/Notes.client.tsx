"use client";

import { useState } from "react";
import Link from "next/link";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useDebouncedCallback } from "use-debounce";
import NoteList from "@/components/NoteList/NoteList";
import Pagination from "@/components/Pagination/Pagination";
import SearchBox from "@/components/SearchBox/SearchBox";
import { fetchNotes } from "@/lib/api/clientApi";
import type { Note } from "@/types/note";
import css from "./NotesPage.module.css";

interface NotesClientProps {
  tag?: Note["tag"];
}

export default function NotesClient({ tag }: NotesClientProps) {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [inputValue, setInputValue] = useState("");
  const debouncedSearch = useDebouncedCallback((value: string) => {
    setSearch(value);
    setPage(1);
  }, 500);
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["notes", page, search, tag],
    queryFn: () => fetchNotes({ page, perPage: 12, search, tag }),
    placeholderData: keepPreviousData,
    refetchOnMount: false,
  });

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox
          onChange={(value) => {
            setInputValue(value);
            debouncedSearch(value);
          }}
          value={inputValue}
        />
        {data && data.totalPages > 1 && (
          <Pagination
            currentPage={page}
            onPageChange={setPage}
            totalPages={data.totalPages}
          />
        )}
        <Link className={css.button} href="/notes/action/create">
          Create note +
        </Link>
      </header>
      {isLoading && <p>Loading notes...</p>}
      {isError && <p>Error: {error.message}</p>}
      {data && data.notes.length > 0 && <NoteList notes={data.notes} />}
      {data && !data.notes.length && !isLoading && <p>No notes found.</p>}
    </div>
  );
}
