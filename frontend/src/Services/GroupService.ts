import axios from "axios";
import { GroupModel } from "../Interfaces/GroupModel";

export class GroupService
{
    private static readonly baseURL = "https://localhost:7085/api/Group";

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
}