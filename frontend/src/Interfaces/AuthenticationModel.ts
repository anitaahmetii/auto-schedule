import { UserModel } from "./UserModel";
 
 export interface AuthenticationModel{
     token:string,
     refreshToken: string,
     expiresAt: Date,
     userData:UserModel,
     userRole: string,
     notifications: Notification[];
 }