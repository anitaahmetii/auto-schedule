import axios from "axios";
import { GroupSelectionPeriodModel } from "../Interfaces/GroupSelectionPeriodModel";

export class GroupSelectionPeriodService
{
    private static readonly baseUrl = "https://localhost:7085/api/GroupSelectionPeriod";
    private static getAuthHeaders() 
    {
        const token = localStorage.getItem("token");
        return {
        Authorization: token ? `Bearer ${token}` : "",
        };
    }

    public static async createGroupSelectionPeriod(model: GroupSelectionPeriodModel): Promise<GroupSelectionPeriodModel>
    {
        try
        {
            const response = await axios.post(this.baseUrl, model, {
                headers: this.getAuthHeaders(),
            });
            return response.data;
        }
        catch (error) 
        {
            console.error("Error creating group selection period:", error);
            throw error;
        }
    }
    public static async getAllGroupSelectionPeriodsAsync(): Promise<GroupSelectionPeriodModel[]>
    {
        try 
        {
            const result = await axios.get(this.baseUrl, {
                headers: this.getAuthHeaders(),
            });
            return result.data;
        }
        catch (error) 
        {
          console.error("Error retrieving the groups selection periods:", error);
          throw error;
        }
    }
    public static async updateGroupSelectionPeriod(model: GroupSelectionPeriodModel): Promise<GroupSelectionPeriodModel>
    {
        try
        {
            const response = await axios.put(`${this.baseUrl}/${model.id}`, model, {
                headers: this.getAuthHeaders(),
            });
            return response.data;
        }
        catch (error) 
        {
            console.error("Error updating group selection period:", error);
            throw error;
        }
    }
    public static async deleteGroupSelectionPeriod(id: string): Promise<GroupSelectionPeriodModel>
    {
        try
        {
            const response = await axios.delete(`${this.baseUrl}/${id}`, {
                headers: this.getAuthHeaders(),
            });
            return response.data;
        }
        catch (error) 
        {
            console.error("Error deleting group selection period:", error);
            throw error;
        }
    }
    public static async isGroupSelectionPeriodActiveAsync(departmentId: string): Promise<GroupSelectionPeriodModel>
    {
        try
        {
            const response = await axios.get(`${this.baseUrl}/active?departmentId=${departmentId}`, {
                headers: this.getAuthHeaders(),
            });
            return response.data;
        }
        catch (error) 
        {
            console.error("No active group selection period found for the specified department.", error);
            throw error;
        }
    }

}