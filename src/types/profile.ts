export interface ProfileData {
  id: string;
  firstName: string | null;
  lastName: string | null;
  avatarUrl: string | null;
  phoneNumber: string | null; // Novo campo
}

// Tipo para atualização no Supabase (snake_case)
export interface ProfileUpdate {
  first_name?: string | null;
  last_name?: string | null;
  avatar_url?: string | null;
  phone_number?: string | null; // Novo campo
}