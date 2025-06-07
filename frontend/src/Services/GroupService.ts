import axios from "axios";
import { GroupModel } from "../Interfaces/GroupModel";

export class GroupService
{
    private static readonly baseURL = "https://localhost:7085/api/Group";
    private static getAuthHeaders() 
    {
        const token = localStorage.getItem("token");
        return {
            Authorization: token ? `Bearer ${token}` : "",
        };
    }

    public static async createGroupAsync(model: GroupModel): Promise<GroupModel>
    {
        try 
        {
            const response = await axios.post(`${GroupService.baseURL}`, model);
            return response.data;
        } 
        catch (error) 
        {
            console.error("Error creating group:", error);
            throw error;
        }
    }
    public static async updateGroupAsync(model: GroupModel): Promise<GroupModel> 
    {
        try 
        {
          const response = await axios.put(`${GroupService.baseURL}/${model.id}`, model);
          return response.data;
        } 
        catch (error) 
        {
          console.error("Error updating group:", error);
          throw error;
        }
    }
    public static async getByIdGroupAsync(id: string): Promise<GroupModel>
    {
        try
        {
            const response = await axios.get(`${GroupService.baseURL}/${id}`);
            return response.data;
        }
        catch (error) 
        {
          console.error("Error retrieving the group id:", error);
          throw error;
        }
    }
    public static async getAllGroupsAsync(): Promise<GroupModel[]>
    {
        try 
        {
            const response = await axios.get(`${GroupService.baseURL}`);
            console.log(response);
            return response.data;
        }
        catch (error) 
        {
          console.error("Error retrieving the groups:", error);
          throw error;
        }
    }
    public static async deleteGroupAsync(id: string): Promise<GroupModel>
    {
        try
        {
            const response = await axios.delete(`${GroupService.baseURL}/${id}`);
            return response.data;
        }
        catch (error) 
        {
            console.error("Error deleting the group:", error);
            throw error;
        }
    }
    public static async GetSelectList() : Promise<GroupModel[]> 
    {
        const result = await axios.get(`${GroupService.baseURL}/GetGroupSelectListAsync`);
        return result.data;
    }
    public static async GetSelectListByDepartment(departmentId: string) : Promise<GroupModel[]> 
    {
        const result = await axios.get(`${GroupService.baseURL}/GetGroupDepartment?departmentId=${departmentId}`);
        return result.data;
    }
    public static async getGroupByStudentAsync(studentId: string): Promise<GroupModel> 
    {
        try 
        {
            const response = await axios.get(`${this.baseURL}/studentGroup?studentId=${studentId}`, {
                headers: this.getAuthHeaders(),
            });
            return response.data;
        }
        catch(error)
        {
            console.error("Student has not chosen a group yet: ", error);
            throw error;
        }
    }
}