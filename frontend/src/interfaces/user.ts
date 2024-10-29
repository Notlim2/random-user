export interface CreateUserDto {
  name: string;
  email: string;
  phone: string;
  avatar: string;
  birthDate: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  avatar: string;
  phone: string;
  birthDate: string;
}
