import axios from "axios";
import { LocationModel } from "../Interfaces/LocationModel";

export class LocationService {
    private static baseUrl = "https://localhost:7085/api/Location";
    public static async DeleteLocation(id: string): Promise<void> {
      var result = await axios.delete(`${LocationService.baseUrl}/${id}`);
    }
    public static async GetAllLocations(): Promise<LocationModel[]> {
      const result = await axios.get(LocationService.baseUrl);
      return result.data;
    }
    public static async GetLocationDetails(id: string): Promise<LocationModel> {
        const result = await axios.get(`${LocationService.baseUrl}/${id}`);
        return result.data;
    }
   public static async EditOrAddLocation(model: LocationModel): Promise<void> {
    const result = await axios.post(`${LocationService.baseUrl}`, model);
  }
}
  