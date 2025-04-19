export enum ScheduleTypes {
    Morning = 'Morning',
    Afternoon = 'Afternoon',
    Hybrid = 'Hybrid',
  }
  
  export interface ScheduleTypeModel {
    id: string | null;
    scheduleTypes: ScheduleTypes | null;
    userId: string | null;
  }