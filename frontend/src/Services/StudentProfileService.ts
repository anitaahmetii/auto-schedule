import axios from "axios";
import { StudentProfileModel } from "../Interfaces/StudentProfileModel";

export class StudentProfileService
{
    private static readonly baseURL = "https://localhost:7085/api/StudentProfile";
    private static getAuthHeaders() {
        const token = localStorage.getItem("token");
        return {
            Authorization: token ? `Bearer ${token}` : "",
        };
    }

    public static async getStudentProfileAsync(): Promise<StudentProfileModel>
    {
        try 
        {
            const response = await axios.get(this.baseURL, { 
                headers: this.getAuthHeaders(), });
            // console.log(response);
            return response.data;
        }
        catch (error) 
        {
          console.error("Error retrieving the student profile:", error);
          throw error;
        }
    }
    public static async updateStudentProfileAsync(model: StudentProfileModel): Promise<StudentProfileModel> 
    {
        try 
        {
            const response = await axios.put(`${this.baseURL}/${model.id}`, model, {
                headers: this.getAuthHeaders(), });
            return response.data;
        } 
        catch (error) 
        {
          console.error("Error updating profile:", error);
          throw error;
        }
    }
}