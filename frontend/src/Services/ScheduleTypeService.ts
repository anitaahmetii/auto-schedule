import axios from "axios";
import { ScheduleTypeModel } from "../Interfaces/ScheduleTypeModel"; // Sigurohuni që ky model ekziston

export class ScheduleTypeService {
  private static baseUrl = "https://localhost:7085/api/ScheduleType"; // URL për API-në e ScheduleType

  // Funksioni për të fshirë një ScheduleType nga ID
  public static async DeleteScheduleType(id: string): Promise<void> {
    try {
      await axios.delete(`${ScheduleTypeService.baseUrl}/${id}`);
    } catch (error) {
      console.error("Gabim gjatë fshirjes së ScheduleType:", error);
      throw error;
    }
  }

  // Funksioni për të marrë të gjitha ScheduleTypes
  public static async GetAllScheduleTypes(): Promise<ScheduleTypeModel[]> {
    try {
      const result = await axios.get(ScheduleTypeService.baseUrl);
      return result.data;
    } catch (error) {
      console.error("Gabim gjatë marrjes së ScheduleTypes:", error);
      throw error;
    }
  }

  // Funksioni për të marrë detajet e ScheduleType nga ID
  public static async GetScheduleTypeDetails(id: string): Promise<ScheduleTypeModel> {
    try {
      const result = await axios.get(`${ScheduleTypeService.baseUrl}/${id}`);
      return result.data;
    } catch (error) {
      console.error("Gabim gjatë marrjes së detajeve të ScheduleType:", error);
      throw error;
    }
  }

  // Funksioni për të krijuar ose përditësuar një ScheduleType
  public static async EditOrAddScheduleType(model: ScheduleTypeModel): Promise<void> {
    try {
      const result = await axios.post(`${ScheduleTypeService.baseUrl}`, model);
      console.log("Përgjigja nga API:", result);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Gabimi gjatë EditOrAddScheduleType:", error.message);
      } else {
        console.error("Gabimi gjatë EditOrAddScheduleType:", error);
      }
      throw error;
    }
  }

  // Funksioni për të marrë listën e mundshme të ScheduleTypes
  public static async GetSelectList(): Promise<ScheduleTypeModel[]> {
    try {
      const result = await axios.get(`${ScheduleTypeService.baseUrl}/GetScheduleTypeSelectListAsync`);
      return result.data;
    } catch (error) {
      console.error("Gabim gjatë marrjes së listës së ScheduleTypes:", error);
      throw error;
    }
  }
}