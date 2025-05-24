import axios from "axios";
import { CityModel } from "../Interfaces/CityModel";
import { SelectListItem } from "../Interfaces/SelectListItem";

export class CityService {
    private static baseUrl = "https://localhost:7085/api/City";
    public static async DeleteCity(id: string): Promise<void> {
      var result = await axios.delete(`${CityService.baseUrl}/${id}`);
    }
    public static async GetAllCities(): Promise<CityModel[]> {
      const result = await axios.get(CityService.baseUrl);
      return result.data;
    }
    public static async GetCityDetails(id: string): Promise<CityModel> {
        const result = await axios.get(`${CityService.baseUrl}/${id}`);
        return result.data;
    }
   public static async EditOrAddCity(model: CityModel): Promise<void> {
    const result = await axios.post(`${CityService.baseUrl}`, model);
  }
  public static async GetSelectList() : Promise<CityModel[]> {
    const result = await axios.get(`${CityService.baseUrl}/GetCities`);
    return result.data;
  }
}