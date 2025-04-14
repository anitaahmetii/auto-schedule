import axios from "axios";
import { StateModel } from "../Interfaces/StateModel";

export class StateService {
    private static baseUrl = "https://localhost:7085/api/State";
    public static async DeleteState(id: string): Promise<void> {
      var result = await axios.delete(`${StateService.baseUrl}/${id}`);
    }
    public static async GetAllStates(): Promise<StateModel[]> {
      const result = await axios.get(StateService.baseUrl);
      return result.data;
    }
    public static async GetStateDetails(id: string): Promise<StateModel> {
        const result = await axios.get(`${StateService.baseUrl}/${id}`);
        return result.data;
    }
   public static async EditOrAddState(model: StateModel): Promise<void> {
    const result = await axios.post(`${StateService.baseUrl}`, model);
  }
}
  