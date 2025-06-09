import axios from "axios";
import { ScheduleSearchModel } from "../Interfaces/ScheduleSearchModel";
import { ManualScheduleModel } from "../Interfaces/ManualScheduleModel";

export default class ScheduleSearchService
{
    private static readonly baseUrl = "https://localhost:7085/api/ScheduleSearch";
    private static getAuthHeaders() 
    {
        const token = localStorage.getItem("token");
        return {
            Authorization: token ? `Bearer ${token}` : "",
        };
    }
    public static async getSchedulesByFilter(model: ScheduleSearchModel): Promise<ManualScheduleModel[]>
    {
        try
        {
            var response = await axios.post(`${this.baseUrl}`, model, {
                 headers: this.getAuthHeaders(),
            });
            return response.data;
        }
        catch (error) 
        {
            console.error("Error retrieving the schedules:", error);
            throw error;
        }
    }
}