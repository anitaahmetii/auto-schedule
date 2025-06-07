import axios from "axios";
import { AttendanceCodePeriodModel } from "../Interfaces/AttendanceCodePeriodModel";

export default class AttendanceCodePeriodService 
{
    
    private static readonly baseUrl = "https://localhost:7085/api/AttendanceCodePeriod";
    private static getAuthHeaders() 
    {
        const token = localStorage.getItem("token");
        return {
            Authorization: token ? `Bearer ${token}` : "",
        };
    }
    public static async createAttendanceCodePeriodAsync(scheduleId: string): Promise<string>
    {
        try
        {
            var response = await axios.post(`${this.baseUrl}/${scheduleId}`);
            return response.data;
        }
        catch (error) 
        {
            console.error("Error attendance code period:", error);
            throw error;
        }
    }
    public static async getAttendanceCodeAsync(): Promise<AttendanceCodePeriodModel[]>
    {
        try
        {
            var response = await axios.get(`${this.baseUrl}`);
            return response.data;
        }
        catch (error) 
        {
            console.error("Error retrieving the code:", error);
            throw error;
        }
    }
    public static async deleteAttendanceCodePeriodAsync(scheduleId: string): Promise<string>
    {
        try
        {
            var response = await axios.delete(`${this.baseUrl}/${scheduleId}`);
            return response.data;
        }
        catch (error) 
        {
            console.error("Error retrieving the code:", error);
            throw error;
        }
    }
}