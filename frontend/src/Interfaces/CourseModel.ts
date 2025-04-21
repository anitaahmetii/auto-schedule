export interface CourseModel
{
    id: string | null;
    name: string;
    ects: string;
    semester: string;
    isLecture: boolean;
    isExcercise: boolean;
    userId: string; 
}