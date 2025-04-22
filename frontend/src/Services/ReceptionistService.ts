import axios from "axios";
import { ReceptionistModel} from "../Interfaces/ReceptionistModel";

export class ReceptionistService {
    private static baseUrl = "https://localhost:7085/api/Receptionist";
    public static async DeleteReceptionist(id: string): Promise<void> {
      var result = await axios.delete(`${ReceptionistService.baseUrl}/${id}`);
    }
    public static async GetAllReceptionists(): Promise<ReceptionistModel[]> {
      const result = await axios.get(ReceptionistService.baseUrl);
      return result.data;
    }
    public static async GetReceptionistDetails(id: string): Promise<ReceptionistModel> {
        const result = await axios.get(`${ReceptionistService.baseUrl}/${id}`);
        return result.data;
    }
   public static async EditOrAddReceptionist(model: ReceptionistModel): Promise<void> {
    const result = await axios.post(`${ReceptionistService.baseUrl}`, model);
  }
}
  