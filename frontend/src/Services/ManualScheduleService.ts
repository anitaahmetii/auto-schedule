import axios from "axios";
import { ManualScheduleModel } from "../Interfaces/ManualScheduleModel";

export class ManualScheduleService
{
    private static readonly baseUrl = "https://localhost:7085/api/ManualSchedule";

    public static async createManualScheduleAsync(model: ManualScheduleModel): Promise<ManualScheduleModel>
    {
        try
        {
            var response = await axios.post(`${ManualScheduleService.baseUrl}`, model);
            return response.data;
        }
        catch (error) 
        {
            console.error("Error creating schedule:", error);
            throw error;
        }
    }
}