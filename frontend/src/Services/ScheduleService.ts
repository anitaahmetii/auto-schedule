import axios from "axios";
import { ScheduleModel } from "../Interfaces/ScheduleModel";

export class ScheduleService{

    private static baseUrl = "https://localhost:7085/api/Schedule";

    public static async GetAllSchedules(): Promise<ScheduleModel[]> {
     const result = await axios.get(ScheduleService.baseUrl);
     return result.data;
    }

    public static async DeleteSchedule(id: string): Promise<void> {
      var result = await axios.delete(`${ScheduleService.baseUrl}/${id}`);
    }
    public static async UpdateSchedule(model: ScheduleModel): Promise<void>{
      var result = await axios.put(`${ScheduleService.baseUrl}`, model);
    }
    public static async GetScheduleDetails(id: string): Promise<ScheduleModel> {
      const result = await axios.get(`${ScheduleService.baseUrl}/${id}`);
      return result.data;
  }

    public static async ImportSchedule(file: File) : Promise<ScheduleModel[]>{
        const formData = new FormData();
        formData.append("file", file);

        const result = await axios.post(`${ScheduleService.baseUrl}/upload`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
        return result.data;
    }

}  