import axios from "axios";
import { AttendanceModel } from "../Interfaces/AttendanceModel";

export default class AttedanceService 
{
    private static readonly baseUrl = "https://localhost:7085/api/Attendance";
    private static getAuthHeaders() 
    {
        const token = localStorage.getItem("token");
        return {
            Authorization: token ? `Bearer ${token}` : "",
        };
    }
    public static async confirmPresenceAsync(studentId: string, scheduleId: string, code: string): Promise<boolean>
    {
        try
        {
            var response = await axios.get(`${this.baseUrl}/confirm?studentId=${studentId}&scheduleId=${scheduleId}&code=${code}`, {
                headers: this.getAuthHeaders()
            });
            return response.data;
        }
        catch (error) 
        {
            console.error("Code is incorrect, has expired, or hasn't started yet:", error);
            throw error;
        }
    }
    public static async getAttendancesAsync(studentId: string): Promise<AttendanceModel[]>
    {
        try 
        {
            var response = await axios.get(`${this.baseUrl}/${studentId}`, {
                headers: this.getAuthHeaders(),
            });
            return response.data;
        }
        catch (error) 
        {
            console.error("Error retrieving attendances:", error);
            throw error;
        }
    }
    public static async getStudentAttendanceAsync(lectureId: string): Promise<AttendanceModel[]>
    {
        try 
        {
            var response = await axios.get(`${this.baseUrl}/studentattendances/${lectureId}`, {
                headers: this.getAuthHeaders(),
            });
            return response.data;
        }
        catch (error) 
        {
            console.error("Error retrieving student attendances:", error);
            throw error;
        }
    }
}