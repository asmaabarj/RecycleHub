export interface User {
  id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  phone: string;
  birthDate: Date;
  profileImage?: string;
  userType: 'particular' | 'collector';
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  error: string | null;
  loading: boolean;
}
