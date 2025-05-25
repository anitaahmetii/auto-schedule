import axios from "axios";
import { HallModel} from "../Interfaces/HallModel";

export class HallService {
    private static baseUrl = "https://localhost:7085/api/Hall";
    public static async DeleteHall(id: string): Promise<void> {
      var result = await axios.delete(`${HallService.baseUrl}/${id}`);
    }
    public static async GetAllHalls(): Promise<HallModel[]> {
      const result = await axios.get(HallService.baseUrl);
      return result.data;
    }
    public static async GetHallDetails(id: string): Promise<HallModel> {
        const result = await axios.get(`${HallService.baseUrl}/${id}`);
        return result.data;
    }
   public static async EditOrAddHall(model: HallModel): Promise<void> {
    const result = await axios.post(`${HallService.baseUrl}`, model);
  }
  public static async GetSelectList(): Promise<HallModel[]> 
  {
    const result = await axios.get(`${HallService.baseUrl}/GetHallsSelectListAsync`);
    return result.data;
  }
}
  