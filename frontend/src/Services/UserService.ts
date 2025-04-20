import axios from "axios";
import { UserModel } from "../Interfaces/UserModel";

export class UserService {
  private static baseUrl = "https://localhost:7085/api/User";

  public static async DeleteUser(id: string): Promise<void> {
    await axios.delete(`${UserService.baseUrl}/${id}`);
  }

  public static async GetAllUsers(): Promise<UserModel[]> {
    const result = await axios.get(UserService.baseUrl);
    return result.data;
  }

  public static async GetUserDetails(id: string): Promise<UserModel> {
    const result = await axios.get(`${UserService.baseUrl}/${id}`);
    return result.data;
  }

  public static async EditOrAddUser(model: UserModel): Promise<void> {
    await axios.post(UserService.baseUrl, model);
  }
}