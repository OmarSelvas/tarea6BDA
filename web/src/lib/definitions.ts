export interface CoursePerformance {
  course_name: string;
  course_code: string;
  term: string;
  teacher_name: string;
  total_students: number;
  average_grade: number;
  approval_rate: number;
}

export interface AtRiskStudent {
  student_id: number;
  student_name: string;
  email: string;
  course_name: string;
  attendance_pct: number;
  current_grade: number;
}

export interface StudentRanking {
    student_id: number;
    name: string;
    program: string;
    average_grade: number;
    rank: number;
}

export interface AttendanceSummary {
    student_id: number;
    student_name: string;
    course_name: string;
    attendance_pct: number;
}

export interface GroupDashboard {
    group_id: number;
    course_code: string;
    course_name: string;
    term: string;
    total_students: number;
}
