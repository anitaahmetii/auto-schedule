export interface StudentProfileModel
{
    id: string | null;
    personalID: string | null;
    email: string;
    userName: string;
    lastName: string;
    gender: string | null;
    birthdate: string | null;
    departmentId: string | null;
    cityId: string | null;
    address: string | null;
    personalEmail: string | null;
    phoneNumber: string | null;
    academicProgram: string;
    academicYear: string | null;
    registred: string | null;
    groupId: string;
}