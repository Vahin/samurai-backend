export type CourseType = {
  id: number;
  title: string;
  studentsCount: number;
};

export type DataBaseTypes = {
  courses: CourseType[];
};

export const db: DataBaseTypes = {
  courses: [
    { id: 1, title: "front-end", studentsCount: 10 },
    { id: 2, title: "back-end", studentsCount: 20 },
    { id: 3, title: "automation qa", studentsCount: 14 },
    { id: 4, title: "devops", studentsCount: 19 },
  ],
};
