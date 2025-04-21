export interface ReportModel {
    id: string;
    absence: number;
    comment: string;
    dateTime: string; // ose Date, nëse e konverton
    userId: string;
    scheduleId: string;
  }