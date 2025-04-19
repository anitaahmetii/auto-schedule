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
}