export interface GasStation {
  id: string;
  name: string;
  city: string | null;
  state: string | null;
}

export interface GasStationInsert {
  name: string;
  city?: string | null;
  state?: string | null;
  added_by: string;
}