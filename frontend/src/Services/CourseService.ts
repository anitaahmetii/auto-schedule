import axios from "axios";
import { CourseModel } from "../Interfaces/CourseModel";

export class CourseService
{
    // static GetSelectList() {
    //     throw new Error('Method not implemented.');
    // }
    private static readonly baseURL = "https://localhost:7085/api/Course";

    public static async createCourseAsync(model: CourseModel): Promise<CourseModel>
    {
        try 
        {
            const response = await axios.post(`${CourseService.baseURL}`, model);
            return response.data;
        } 
        catch (error) 
        {
            console.error("Error creating course:", error);
            throw error;
        }
    }
    public static async updateCourseAsync(model: CourseModel): Promise<CourseModel> 
    {
        try 
        {
          const response = await axios.put(`${CourseService.baseURL}/${model.id}`, model);
          return response.data;
        } 
        catch (error) 
        {
          console.error("Error updating course:", error);
          throw error;
        }
    }
    public static async getByIdCourseAsync(id: string): Promise<CourseModel>
    {
        try
        {
            const response = await axios.get(`${CourseService.baseURL}/${id}`);
            return response.data;
        }
        catch (error) 
        {
          console.error("Error retrieving the course:", error);
          throw error;
        }
    }
    public static async getAllCoursesAsync(): Promise<CourseModel[]>
    {
        try 
        {
            const response = await axios.get(`${CourseService.baseURL}`);
            console.log(response);
            return response.data;
        }
        catch (error) 
        {
          console.error("Error retrieving the courses:", error);
          throw error;
        }
    }
    public static async deleteCourseAsync(id: string): Promise<CourseModel>
    {
        try
        {
            const response = await axios.delete(`${CourseService.baseURL}/${id}`);
            return response.data;
        }
        catch (error) 
        {
            console.error("Error deleting the course:", error);
            throw error;
        }
    }

     public static async GetSelectList() : Promise<CourseModel[]> {
        const result = await axios.get(`${CourseService.baseURL}/GetCourseSelectListAsync`);
        return result.data;
      }
}