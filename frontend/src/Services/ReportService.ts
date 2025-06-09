import axios from "axios";
import { ReportModel } from "../Interfaces/ReportModel";

export class ReportService {
    private static readonly baseUrl = "https://localhost:7085/api/Report";

    public static async DeleteReport(id: string, cancelToken?: AbortSignal): Promise<void> {
        await axios.delete(`${this.baseUrl}/${id}`, { signal: cancelToken });
    }

    public static async GetAllReports(cancelToken?: AbortSignal): Promise<ReportModel[]> {
        const result = await axios.get<ReportModel[]>(this.baseUrl, { signal: cancelToken });
        return result.data;
    }

    public static async GetReportDetails(id: string, cancelToken?: AbortSignal): Promise<ReportModel> {
        const result = await axios.get<ReportModel>(`${this.baseUrl}/by-id/${id}`, { signal: cancelToken });
        return result.data;
    }

    public static async EditOrAddReport(model: ReportModel, cancelToken?: AbortSignal): Promise<ReportModel> {
        const result = await axios.post<ReportModel>(this.baseUrl, model, { signal: cancelToken });
        return result.data;
    }
}