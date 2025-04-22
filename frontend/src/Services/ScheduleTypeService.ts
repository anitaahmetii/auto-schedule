import axios from "axios";
import { ScheduleTypeModel } from "../Interfaces/ScheduleTypeModel";

export class ScheduleTypeService {
  private static baseUrl = "https://localhost:7085/api/ScheduleType"; // URL për API-në e ScheduleType

  // Funksioni për të fshirë një ScheduleType nga ID
  public static async DeleteScheduleType(id: string): Promise<void> {
    const result = await axios.delete(`${ScheduleTypeService.baseUrl}/${id}`);
  }

  // Funksioni për të marrë të gjitha ScheduleTypes
  public static async GetAllScheduleTypes(): Promise<ScheduleTypeModel[]> {
    const result = await axios.get(ScheduleTypeService.baseUrl);
    return result.data;
  }

  // Funksioni për të marrë detajet e ScheduleType nga ID
  public static async GetScheduleTypeDetails(id: string): Promise<ScheduleTypeModel> {
    const result = await axios.get(`${ScheduleTypeService.baseUrl}/${id}`);
    return result.data;
  }

  // Funksioni për të krijuar ose përditësuar një ScheduleType
  public static async EditOrAddScheduleType(model: ScheduleTypeModel): Promise<void> {
    const result = await axios.post(`${ScheduleTypeService.baseUrl}`, model);
  }

  public static async GetSelectList() : Promise<ScheduleTypeModel[]>{
    const result=await axios.get(`${ScheduleTypeService.baseUrl}/GetScheduleTypeSelectListAsync`);
    return result.data;
  }
}