export interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  email_verified_at: string;
  phone: string;
  address: string;
  gender: 'MALE' | 'FEMALE';
  nationality: string;
  password: string;
  ref_id: string;
  active: string;
  created_at: string;
  updated_at: string;
}
