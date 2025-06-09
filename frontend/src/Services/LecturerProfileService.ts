import axios from "axios";
import { LecturerProfileModel } from "../Interfaces/LecturerProfileModel";

export class LecturerProfileService {
    private static readonly baseURL = "https://localhost:7085/api/LecturerProfile";

    private static getAuthHeaders() {
        const token = localStorage.getItem("token");
        return {
            Authorization: token ? `Bearer ${token}` : "",
        };
    }

    public static async getLecturerProfileAsync(): Promise<LecturerProfileModel> {
        try {
            const response = await axios.get(this.baseURL, {
                headers: this.getAuthHeaders(),
            });
            return response.data;
        } catch (error) {
            console.error("Error retrieving the lecturer profile:", error);
            throw error;
        }
    }

    public static async updateLecturerProfileAsync(model: LecturerProfileModel): Promise<LecturerProfileModel> {
        try {
            const response = await axios.put(`${this.baseURL}/${model.id}`, model, {
                headers: this.getAuthHeaders(),
            });
            return response.data;
        } catch (error) {
            console.error("Error updating lecturer profile:", error);
            throw error;
        }
    }
}