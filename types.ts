
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'teacher';
  avatarUrl?: string;
}

export interface Course {
  id: string;
  name: string;
  imageUrl: string;
  semester: string;
  program: string;
  teacher: User;
  objective: string;
  contentSummary: string[];
  evaluationCriteria: { item: string; weight: string }[];
}

export enum ActivityStatus {
  PENDING = 'Pendiente',
  IN_PROGRESS = 'En Curso',
  COMPLETED = 'Terminada',
  GRADED = 'Calificada',
  NOT_SUBMITTED = 'No Entregado',
}

export interface Activity {
  id: string;
  courseId: string;
  name: string;
  dueDate: string;
  status: ActivityStatus;
  description: string;
  resources?: { name: string; url: string }[];
  submissionStatus?: ActivityStatus;
  grade?: number;
  maxGrade?: number;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: Date;
  attachment?: { name: string; url: string };
}

export interface Chat {
  id: string;
  participants: User[];
  messages: Message[];
  lastMessage?: Message;
}

export interface GradeItem {
  activityName: string;
  grade: number | null;
  maxGrade: number;
  feedback?: string;
}

export interface AcademicProgress {
  courseId: string;
  grades: GradeItem[];
  finalGrade: number | null;
}

export interface Notification {
  id: string;
  message: string;
  read: boolean;
  link?: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  description?: string;
}
