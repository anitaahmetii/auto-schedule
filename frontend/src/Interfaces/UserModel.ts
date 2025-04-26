import { Role } from "./Role";

export interface UserModel {
    id?: string | null;   // Pranon si undefined ashtu edhe null
    userName: string;
    email: string;
    lastName: string;
    password?: string;
    role: Role;
  }