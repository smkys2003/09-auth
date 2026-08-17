import { cookies } from "next/headers";
import { api } from "./api";
import type { FetchNotesParams, FetchNotesResponse, Note } from "@/types/note";
import type { User } from "@/types/user";

interface SessionResponse {
  success: boolean;
}

async function getCookieHeader() {
  const cookieStore = await cookies();
  return cookieStore.toString();
}

export async function fetchNotes(params: FetchNotesParams) {
  const { data } = await api.get<FetchNotesResponse>("/notes", {
    params,
    headers: { Cookie: await getCookieHeader() },
  });
  return data;
}

export async function fetchNoteById(id: string) {
  const { data } = await api.get<Note>(`/notes/${id}`, {
    headers: { Cookie: await getCookieHeader() },
  });
  return data;
}

export async function getMe() {
  const { data } = await api.get<User>("/users/me", {
    headers: { Cookie: await getCookieHeader() },
  });
  return data;
}

export async function checkSession() {
  return api.get<SessionResponse>("/auth/session", {
    headers: { Cookie: await getCookieHeader() },
  });
}
