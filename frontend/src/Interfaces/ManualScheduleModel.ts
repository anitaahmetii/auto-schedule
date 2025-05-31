export interface ManualScheduleModel
{
    id: string | null,
    day: string,
    startTime: string,
    endTime: string,
    courseLecturesId: string,
    hallsId: string,
    locationId: string,
    departmentId: string,
    groupId: string;
    hasReport: string;
    isCanceled: string;
}