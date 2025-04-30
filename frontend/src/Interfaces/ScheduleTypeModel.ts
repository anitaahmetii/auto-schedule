 /*export enum ScheduleTypes {
  Morning = "Morning",
  Afternoon = "Afternoon",
  Hybrid = "Hybrid",
}
  */
export enum ScheduleTypes {
  Morning = 1,
  Afternoon = 2,
  Hybrid = 3,
}

export interface ScheduleTypeModel {
  id: string | null;
  scheduleTypes: ScheduleTypes | null;  // Përdor enum-in ScheduleTypes për scheduleTypes
  userId: string;
}