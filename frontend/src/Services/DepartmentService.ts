import axios from "axios";
import { DepartmentModel } from "../Interfaces/DepartmentModel";
import { StateService } from "./StateService";

export class DepartmentService {
    private static baseUrl = "https://localhost:7085/api/Department";
    public static async DeleteDepartment(id: string): Promise<void> {
      var result = await axios.delete(`${DepartmentService.baseUrl}/${id}`);
    }
    public static async GetAllDepartments(): Promise<DepartmentModel[]> {
      const result = await axios.get(DepartmentService.baseUrl);
      return result.data;
    }
    public static async GetDepartmentDetails(id: string): Promise<DepartmentModel> {
        const result = await axios.get(`${DepartmentService.baseUrl}/${id}`);
        return result.data;
    }
   public static async EditOrAddDepartment(model: DepartmentModel): Promise<void> {
    const result = await axios.post(`${DepartmentService.baseUrl}`, model);
  }

  public static async SearchDepartments(searchTerm?: string,sortBy?: string, searchField?: string): Promise<DepartmentModel[]> {
  const result = await axios.get(`${DepartmentService.baseUrl}/search`, {
    params: { searchTerm, sortBy, searchField }
  });
  return result.data;
  }
  public static async GetSelectList(): Promise<DepartmentModel[]> 
  {
    const result = await axios.get(`${DepartmentService.baseUrl}/GetDepartmentsSelectListAsync`);
    return result.data;
  }
}