export interface ScheduleSearchModel
{
    day: string | null;
    startTime: string | null;
    endTime: string | null;
    hallsId: string[] | null;
    locationId: string[] | null;
    departmentId:  string[] | null;
    groupId:  string[] | null;
    courseLecturesId:  string[] | null;
    searchText: string | null;
    sortBy: string | null;
    sortDescending: boolean;
    pageNumber: 1;
    pageSize: 10;
}