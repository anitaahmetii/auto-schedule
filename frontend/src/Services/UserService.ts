import axios from "axios";
import { UserModel } from "../Interfaces/UserModel";
import { toast } from "react-toastify";
import { LoginModel } from "../Interfaces/LoginModel";
import { AuthenticationModel } from "../Interfaces/AuthenticationModel";

export class UserService {
  private static baseUrl = "https://localhost:7085/api/User";
  public static LoggedInUser: UserModel | null = null;
  public static token: string | null = null;
  public static role: string | null = null;

  public static async Login(user: LoginModel): Promise<AuthenticationModel> {
    const response = await axios.post<AuthenticationModel>(
      `${UserService.baseUrl}/login`,
      user
    );
    localStorage.setItem("jwt", response.data.token);
    UserService.token = response.data?.token;
    localStorage.setItem("refreshToken", response.data.refreshToken);
    localStorage.setItem("userModel", JSON.stringify(response.data.userData));
    UserService.LoggedInUser = response.data?.userData;
    localStorage.setItem("role", response.data.userRole);
    UserService.role = response.data?.userRole;
    toast.success("Logged in successfuly");
    return response.data;
  }
  public static LogOut(): void {
    console.log('logged out');
    localStorage.remove("jwt");
    localStorage.remove("expiresAt");
    localStorage.remove("userModel");
    localStorage.remove("role");

    UserService.token = null;
    UserService.role = null;
    UserService.LoggedInUser = null;
  }
  public static GetUserRole(): string | null {
    return localStorage.getItem("role")!;
  }
  public static async DeleteUser(id: string): Promise<void> {
    await axios.delete(`${UserService.baseUrl}/${id}`);
  }

  public static async GetAllUsers(): Promise<UserModel[]> {
    const result = await axios.get(UserService.baseUrl);
    return result.data;
  }
  public static async GetAllAdmins(): Promise<UserModel[]> {
    const result = await axios.get(`${UserService.baseUrl}/admins`);
    return result.data;
  }

  public static async GetUserDetails(id: string): Promise<UserModel> {
    const result = await axios.get(`${UserService.baseUrl}/${id}`);
    return result.data;
  }

  public static async EditOrAddUser(model: UserModel): Promise<void> {
    await axios.post(UserService.baseUrl, model);
  }
  public static async GetSelectList(): Promise<UserModel[]> {
    const result = await axios.get(`${this.baseUrl}`);
    return result.data;
  }
}