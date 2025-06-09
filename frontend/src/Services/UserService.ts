import axios from "axios";
import { UserModel } from "../Interfaces/UserModel";
import { toast } from "react-toastify";
import { LoginModel } from "../Interfaces/LoginModel";
import { AuthenticationModel } from "../Interfaces/AuthenticationModel";
import { NotificationModel } from "../Interfaces/NotificationModel";
import { store } from "../store";
import { addNotification } from "./notificationsSlice";

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
    localStorage.setItem("notifications", JSON.stringify(response.data.notifications));
    toast.success("Logged in successfuly");
    const userId = response.data.userData.id;
    const unread = await axios.get<NotificationModel[]>(
      `https://localhost:7085/api/Notifications/unread/${userId}`
    );

    const existing = store.getState().notifications;

    unread.data.forEach((n) => {
      const alreadyExists = existing.some(e => e.message === n.message && e.timestamp === n.timestamp);
      if (!alreadyExists) {
        toast.info("🔔 Missed: " + n.message);
        store.dispatch(addNotification({ ...n, isRead: false }));
      }
    });

  // Optionally mark them as read in the backend
  await axios.put(`https://localhost:7085/api/Notifications/markAllRead/${userId}`);
    return response.data;
  }
  public static LogOut(): void {
    const notifications = store.getState().notifications;
    localStorage.setItem("notifications", JSON.stringify(notifications));

    console.log("Logging out...");

    localStorage.removeItem("jwt");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("token");
    localStorage.removeItem("userModel");
    localStorage.removeItem("role");
    localStorage.removeItem("userRole");
    localStorage.removeItem("studentId");
    localStorage.removeItem("id");
    localStorage.removeItem("departmentId");

    UserService.token = null;
    UserService.role = null;
    UserService.LoggedInUser = null;
  }
   public static isAuthenticated() {
    if (UserService.token) {
      return true;
    }
    const token = localStorage.getItem("jwt");
    return token != null;
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
   public static isAdmin(): boolean{
     return UserService.GetUserRole() == 'Admin';
  }
}