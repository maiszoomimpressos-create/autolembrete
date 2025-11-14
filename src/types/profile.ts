export interface ProfileData {
  id: string;
  firstName: string | null;
  lastName: string | null;
  avatarUrl: string | null;
}

// Tipo para atualização no Supabase (snake_case)
export interface ProfileUpdate {
  first_name?: string | null;
  last_name?: string | null;
  avatar_url?: string | null;
}