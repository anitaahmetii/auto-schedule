import axios from "axios";
import { ManualScheduleModel } from "../Interfaces/ManualScheduleModel";
import { ScheduleModel } from "../Interfaces/ScheduleModel";

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
    public static async getAllManualSchedulesAsync(): Promise<ManualScheduleModel[]>
    {
        try
        {
            var response = await axios.get(`${ManualScheduleService.baseUrl}`);
            return response.data;
        }
        catch (error) 
        {
          console.error("Error retrieving schedules:", error);
          throw error;
        }
    }
    public static async getByIdManualScheduleAsync(id: string): Promise<ManualScheduleModel>
    {
        try
        {
            var response = await axios.get(`${ManualScheduleService.baseUrl}/${id}`);
            return response.data;
        }
        catch (error) 
        {
          console.error("Error retrieving the schedule:", error);
          throw error;
        }
    }
    public static async updateManualScheduleAsync(model: ManualScheduleModel): Promise<ManualScheduleModel>
    {
        try
        {
            var response = await axios.put(`${ManualScheduleService.baseUrl}/${model.id}`, model);
            return response.data;
        }
        catch (error) 
        {
          console.error("Error updating the schedule:", error);
          throw error;
        }
    }
    public static async deleteManualScheduleAsync(id: string): Promise<ManualScheduleModel>
    {
        try
        {
            var response = await axios.delete(`${ManualScheduleService.baseUrl}/${id}`);
            return response.data;
        }
        catch (error) 
        {
            console.error("Error deleting the schedule:", error);
            throw error;
        }
    }
    public static async getGroupScheduleAsync(groupId: string): Promise<ManualScheduleModel[]>
    {
        try 
        {
            var response = await axios.get(`${ManualScheduleService.baseUrl}/group/${groupId}`);
            return response.data;
        }
        catch (error) 
        {
            console.error("Error retrieving the schedule:", error);
            throw error;
        }
    }
    public static async ImportSchedule(file: File) : Promise<ScheduleModel[]>
    {
        const formData = new FormData();
        formData.append("file", file);
        const result = await axios.post(`${ManualScheduleService.baseUrl}/upload`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return result.data;
    }
}