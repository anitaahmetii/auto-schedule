import axios from "axios";
import { CourseLecturesModel } from "../Interfaces/CourseLecturesModel";
import { SelectListItem } from "../Interfaces/SelectListItem";

export class CourseLecturesService{
    private static baseUrl = "https://localhost:7085/api/CourseLectures";
    public static async DeleteCourseLectures(id: string): Promise<void> {
      var result = await axios.delete(`${CourseLecturesService.baseUrl}/${id}`);
    }
    public static async GetAllCourseLectures(): Promise<CourseLecturesModel[]> {
      const result = await axios.get(CourseLecturesService.baseUrl);
      return result.data;
    }
    public static async GetCourseLecturesDetails(id: string): Promise<CourseLecturesModel> {
        const result = await axios.get(`${CourseLecturesService.baseUrl}/${id}`);
        return result.data;
    }
   public static async EditOrAddCourseLectures(model: CourseLecturesModel): Promise<void> {
    const result = await axios.post(`${CourseLecturesService.baseUrl}`, model);
  }
  public static async GetSelectList() : Promise<CourseLecturesModel[]> {
    const result = await axios.get(`${CourseLecturesService.baseUrl}/GetCourseLectures`);
    return result.data;
  }
}