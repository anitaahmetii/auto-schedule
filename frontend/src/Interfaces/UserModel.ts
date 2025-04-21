export interface UserModel {
    id?: string | null;   // Pranon si undefined ashtu edhe null
    userName: string;
    email: string;
    phoneNumber: string;
    password?: string;
  }