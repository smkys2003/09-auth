import { api } from "./api";
import type {
  CreateNoteData,
  FetchNotesParams,
  FetchNotesResponse,
  Note,
} from "@/types/note";
import type { User } from "@/types/user";

interface AuthRequest {
  email: string;
  password: string;
}

interface SessionResponse {
  success: boolean;
}

interface UpdateUserRequest {
  username: string;
}

export async function fetchNotes(params: FetchNotesParams) {
  const { data } = await api.get<FetchNotesResponse>("/notes", { params });
  return data;
}

export async function fetchNoteById(id: string) {
  const { data } = await api.get<Note>(`/notes/${id}`);
  return data;
}

export async function createNote(noteData: CreateNoteData) {
  const { data } = await api.post<Note>("/notes", noteData);
  return data;
}

export async function deleteNote(id: string) {
  const { data } = await api.delete<Note>(`/notes/${id}`);
  return data;
}

export async function register(credentials: AuthRequest) {
  const { data } = await api.post<User>("/auth/register", credentials);
  return data;
}

export async function login(credentials: AuthRequest) {
  const { data } = await api.post<User>("/auth/login", credentials);
  return data;
}

export async function logout() {
  await api.post("/auth/logout");
}

export async function checkSession() {
  const { data } = await api.get<SessionResponse>("/auth/session");
  return data.success;
}

export async function getMe() {
  const { data } = await api.get<User>("/users/me");
  return data;
}

export async function updateMe(userData: UpdateUserRequest) {
  const { data } = await api.patch<User>("/users/me", userData);
  return data;
}
