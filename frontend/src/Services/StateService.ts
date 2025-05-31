import AxiosInstance from "./AxiosInstance";
import { StateModel } from "../Interfaces/StateModel";

export class StateService {
    private static baseUrl = "https://localhost:7085/api/State";
    public static async DeleteState(id: string): Promise<void> {
      var result = await AxiosInstance.delete(`${StateService.baseUrl}/${id}`);
    }
    public static async GetAllStates(): Promise<StateModel[]> {
      const result = await AxiosInstance.get(StateService.baseUrl);
      return result.data;
    }
    public static async GetStateDetails(id: string): Promise<StateModel> {
        const result = await AxiosInstance.get(`${StateService.baseUrl}/${id}`);
        return result.data;
    }
   public static async EditOrAddState(model: StateModel): Promise<void> {
    const result = await AxiosInstance.post(`${StateService.baseUrl}`, model);
  }
  public static async GetSelectList() : Promise<StateModel[]> {
    const result = await AxiosInstance.get(`${StateService.baseUrl}/GetStateSelectListAsync`);
    return result.data;
  }
}
  