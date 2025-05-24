import { LectureType } from "./LectureType";
import { Role } from "./Role";

export interface UserModel {
  id: string | null | undefined;
  userName: string | null;
  email: string | null;
  lastName: string | null;
  personalID: string | null;
  personalEmail: string | null;
  birthdate: string | null;
  phoneNumber: string | null;
  cityId: string | null;
  address: string | null;
  gender: string | null;
  password: string | null;
  role: Role;

  // Optional fields for specific roles
  responsibilities: string | null; // Coordinator / Receptionist
  status: string | null;           // Staff or Lecture
  academicGrade: string | null;    // Lecture
  lectureType: LectureType;
  scheduleTypeId: string | null;
  departmentId: string | null;  // Student
  academicProgram: string | null;  
  academicYear: string | null;
  registred: string | null;
  groupId: string | null;
}
