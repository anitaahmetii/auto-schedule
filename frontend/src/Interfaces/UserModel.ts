import { LectureType } from "./LectureType";
import { Role } from "./Role";

export interface UserModel {
  id: string | null | undefined;
  userName: string | null;
  email: string | null;
  lastName: string | null;
  password: string | null;
  role: Role;

  // Optional fields for specific roles
  responsibilities: string | null; // Coordinator / Receptionist
  status: string | null;           // Staff or Lecture
  academicGrade: string | null;    // Lecture
  lectureType: LectureType;
  scheduleTypeId: string | null;
  academicProgram: string | null;  // Student
  groupId: string | null;
}
