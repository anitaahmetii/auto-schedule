import axios from "axios";
import { CoordinatorModel } from "../Interfaces/CoordinatorModel";

export class CoordinatorService {
    private static baseUrl = "https://localhost:7085/api/Coordinator";
    public static async DeleteCoordinator(id: string): Promise<void> {
      var result = await axios.delete(`${CoordinatorService.baseUrl}/${id}`);
    }
    public static async GetAllCoordinators(): Promise<CoordinatorModel[]> {
      const result = await axios.get(CoordinatorService.baseUrl);
      return result.data;
    }
    public static async GetCoordinatorDetails(id: string): Promise<CoordinatorModel> {
        const result = await axios.get(`${CoordinatorService.baseUrl}/${id}`);
        return result.data;
    }
   public static async EditOrAddCoordinator(model: CoordinatorModel): Promise<void> {
    const result = await axios.post(`${CoordinatorService.baseUrl}`, model);
  }
}