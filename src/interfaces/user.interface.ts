export interface User {
  id_user?: string;
  name: string;
  lastName: string;
  email: string;
  password: string;
  role: 'admin' | 'user';
}
