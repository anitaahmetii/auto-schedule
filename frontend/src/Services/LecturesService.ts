import axios from "axios";
import { LecturesModel } from "../Interfaces/LecturesModel";

export class LecturesService {
    private static baseUrl = "https://localhost:7085/api/Lectures";
    public static async DeleteLectures(id: string): Promise<void> {
      var result = await axios.delete(`${LecturesService.baseUrl}/${id}`);
    }
    public static async GetAllLectures(): Promise<LecturesModel[]> {
      const result = await axios.get(LecturesService.baseUrl);
      return result.data;
    }
    public static async GetLecturesDetails(id: string): Promise<LecturesModel> {
        const result = await axios.get(`${LecturesService.baseUrl}/${id}`);
        return result.data;
    }
   public static async EditOrAddLectures(model: LecturesModel): Promise<void> {
    const result = await axios.post(`${LecturesService.baseUrl}`, model);
  }
   public static async CountLectures() : Promise<number> {
  const result = await axios.get(`${LecturesService.baseUrl}/count`);
  return result.data;
}
}