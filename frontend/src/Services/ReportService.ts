import axios from "axios";
import { ReportModel } from "../Interfaces/ReportModel";

export class ReportService {
    private static baseUrl = "https://localhost:7085/api/Report";  // Sigurohuni që URL-ja është e saktë

    public static async DeleteReport(id: string): Promise<void> {
        // Korrigjimi me backticks për interpolim të duhur të URL-së
        await axios.delete(`${ReportService.baseUrl}/${id}`);
    }

    public static async GetAllReports(): Promise<ReportModel[]> {
        const result = await axios.get(ReportService.baseUrl);
        return result.data;
    }

    public static async GetReportById(id: string): Promise<ReportModel> {
        // Korrigjimi me backticks për interpolim të duhur të URL-së
        const result = await axios.get(`${ReportService.baseUrl}/${id}`);
        return result.data;
    }

    public static async EditOrAddReport(model: ReportModel): Promise<void> {
        // Korrigjimi me backticks për interpolim të duhur të URL-së
        await axios.post(`${ReportService.baseUrl}`, model);
    }

    // Shto metodat për të marrë Users dhe Schedules
    public static async GetUsers(): Promise<any[]> {
        const result = await axios.get("https://localhost:7085/api/User"); // URL për Users
        return result.data;
    }

    public static async GetSchedules(): Promise<any[]> {
        const result = await axios.get("https://localhost:7085/api/Schedule"); // URL për Schedules
        return result.data;
    }
}