
import { User, Course, Activity, ActivityStatus, Message, Chat, GradeItem, AcademicProgress, CalendarEvent, Notification } from './types';

export const mockCurrentUser: User = {
  id: 'user1',
  name: 'Estudiante Ejemplo',
  email: 'estudiante@uaq.mx',
  role: 'student',
  avatarUrl: 'https://picsum.photos/seed/user1/100/100',
};

export const mockTeacher: User = {
  id: 'teacher1',
  name: 'Dr. Juan Pérez',
  email: 'juan.perez@uaq.mx',
  role: 'teacher',
  avatarUrl: 'https://picsum.photos/seed/teacher1/100/100',
};

export const mockStudents: User[] = [
  { id: 'student1', name: 'Ana López', email: 'ana.lopez@uaq.mx', role: 'student', avatarUrl: 'https://picsum.photos/seed/student1/50/50' },
  { id: 'student2', name: 'Carlos García', email: 'carlos.garcia@uaq.mx', role: 'student', avatarUrl: 'https://picsum.photos/seed/student2/50/50' },
  { id: 'student3', name: 'Laura Martínez', email: 'laura.martinez@uaq.mx', role: 'student', avatarUrl: 'https://picsum.photos/seed/student3/50/50' },
  mockCurrentUser,
];

export const mockCourses: Course[] = [
  {
    id: 'course1',
    name: 'Cálculo Diferencial',
    imageUrl: 'https://picsum.photos/seed/calculus/300/200',
    semester: '2024-2',
    program: 'Ingeniería en Software',
    teacher: mockTeacher,
    objective: 'Desarrollar la capacidad de analizar y resolver problemas mediante el uso de los conceptos fundamentales del cálculo diferencial.',
    contentSummary: ['Límites y Continuidad', 'Derivadas', 'Aplicaciones de la Derivada', 'Optimización'],
    evaluationCriteria: [
      { item: 'Examen Parcial 1', weight: '25%' },
      { item: 'Examen Parcial 2', weight: '25%' },
      { item: 'Tareas y Participación', weight: '20%' },
      { item: 'Proyecto Final', weight: '30%' },
    ],
  },
  {
    id: 'course2',
    name: 'Programación Orientada a Objetos',
    imageUrl: 'https://picsum.photos/seed/poo/300/200',
    semester: '2024-2',
    program: 'Ingeniería en Software',
    teacher: { id: 'teacher2', name: 'Dra. María Rodríguez', email: 'maria.rodriguez@uaq.mx', role: 'teacher', avatarUrl: 'https://picsum.photos/seed/teacher2/100/100' },
    objective: 'Comprender los principios de la programación orientada a objetos y aplicarlos en el desarrollo de software.',
    contentSummary: ['Clases y Objetos', 'Herencia', 'Polimorfismo', 'Encapsulamiento', 'Patrones de Diseño'],
     evaluationCriteria: [
      { item: 'Prácticas de Laboratorio', weight: '40%' },
      { item: 'Examen Teórico', weight: '30%' },
      { item: 'Proyecto en Equipo', weight: '30%' },
    ],
  },
  {
    id: 'course3',
    name: 'Bases de Datos',
    imageUrl: 'https://picsum.photos/seed/db/300/200',
    semester: '2023-1',
    program: 'Ingeniería en Computación',
    teacher: mockTeacher,
    objective: 'Diseñar, implementar y administrar sistemas de bases de datos relacionales.',
    contentSummary: ['Modelo Relacional', 'SQL', 'Normalización', 'Transacciones', 'Bases de Datos NoSQL'],
    evaluationCriteria: [
      { item: 'Examen 1', weight: '20%' },
      { item: 'Examen 2', weight: '20%' },
      { item: 'Proyecto BD', weight: '40%' },
      { item: 'Ejercicios SQL', weight: '20%' },
    ],
  },
];

export const mockActivities: Activity[] = [
  { id: 'activity1', courseId: 'course1', name: 'Tarea 1: Límites', dueDate: '2024-08-15', status: ActivityStatus.PENDING, description: 'Resolver los ejercicios de límites del capítulo 2.', submissionStatus: ActivityStatus.NOT_SUBMITTED, maxGrade: 100 },
  { id: 'activity2', courseId: 'course1', name: 'Práctica 1: Derivadas', dueDate: '2024-08-01', status: ActivityStatus.GRADED, description: 'Aplicar reglas de derivación.', submissionStatus: ActivityStatus.GRADED, grade: 85, maxGrade: 100 },
  { id: 'activity3', courseId: 'course2', name: 'Proyecto: Sistema de Biblioteca', dueDate: '2024-09-01', status: ActivityStatus.IN_PROGRESS, description: 'Desarrollar un sistema de gestión de biblioteca usando POO.', submissionStatus: ActivityStatus.IN_PROGRESS, maxGrade: 100 },
  { id: 'activity4', courseId: 'course1', name: 'Examen Parcial 1', dueDate: '2024-08-20', status: ActivityStatus.PENDING, description: 'Evaluación de los temas de Límites y Continuidad.', submissionStatus: ActivityStatus.NOT_SUBMITTED, maxGrade: 100 },
  { id: 'activity5', courseId: 'course2', name: 'Entrega Avance 1 Proyecto', dueDate: '2024-08-10', status: ActivityStatus.COMPLETED, description: 'Primer avance del proyecto de POO.', submissionStatus: ActivityStatus.COMPLETED, maxGrade: 100 },
];

export const mockMessages: Message[] = [
  { id: 'msg1', senderId: 'teacher1', receiverId: 'user1', content: 'Recuerda la asesoría de mañana.', timestamp: new Date(Date.now() - 3600000 * 2) },
  { id: 'msg2', senderId: 'user1', receiverId: 'teacher1', content: 'Enterado, Dr. Pérez. Ahí estaré.', timestamp: new Date(Date.now() - 3600000) },
  { id: 'msg3', senderId: 'student1', receiverId: 'user1', content: '¿Hiciste la tarea de cálculo?', timestamp: new Date(Date.now() - 7200000) },
];

export const mockChats: Chat[] = [
  { id: 'chat1', participants: [mockCurrentUser, mockTeacher], messages: mockMessages.filter(m => (m.senderId === mockCurrentUser.id && m.receiverId === mockTeacher.id) || (m.senderId === mockTeacher.id && m.receiverId === mockCurrentUser.id) ).sort((a,b) => a.timestamp.getTime() - b.timestamp.getTime()), lastMessage: mockMessages[1] },
  { id: 'chat2', participants: [mockCurrentUser, mockStudents[0]], messages: mockMessages.filter(m => (m.senderId === mockCurrentUser.id && m.receiverId === mockStudents[0].id) || (m.senderId === mockStudents[0].id && m.receiverId === mockCurrentUser.id) ).sort((a,b) => a.timestamp.getTime() - b.timestamp.getTime()), lastMessage: mockMessages[2] },
];

export const mockCourseAcademicProgress: { [courseId: string]: AcademicProgress } = {
  'course1': {
    courseId: 'course1',
    grades: [
      { activityName: 'Tarea 1: Límites', grade: null, maxGrade: 100 },
      { activityName: 'Práctica 1: Derivadas', grade: 85, maxGrade: 100, feedback: 'Buen trabajo, mejorar formato.' },
      { activityName: 'Examen Parcial 1', grade: null, maxGrade: 100 },
    ],
    finalGrade: null,
  },
  'course2': {
    courseId: 'course2',
    grades: [
      { activityName: 'Práctica de Laboratorio 1', grade: 90, maxGrade: 100 },
      { activityName: 'Práctica de Laboratorio 2', grade: 95, maxGrade: 100 },
    ],
    finalGrade: 92.5,
  }
};

export const mockCalendarEvents: CalendarEvent[] = [
  { id: 'event1', title: 'Entrega Tarea 1: Límites (Cálculo)', start: new Date('2024-08-15T23:59:00'), end: new Date('2024-08-15T23:59:00') },
  { id: 'event2', title: 'Examen Parcial 1 (Cálculo)', start: new Date('2024-08-20T09:00:00'), end: new Date('2024-08-20T11:00:00') },
  { id: 'event3', title: 'Asesoría Dr. Pérez', start: new Date('2024-08-10T10:00:00'), end: new Date('2024-08-10T11:00:00'), description: 'Cubículo A-305' },
];

export const mockNotifications: Notification[] = [
  { id: 'notif1', message: 'Nueva calificación en Práctica 1: Derivadas.', read: false, link: '#/grades/course1' },
  { id: 'notif2', message: 'Recordatorio: Examen Parcial 1 de Cálculo es mañana.', read: false, link: '#/calendar' },
  { id: 'notif3', message: 'El Prof. Pérez ha añadido un nuevo anuncio en Cálculo Diferencial.', read: true, link: '#/course/course1' },
];

export const mockFacultyResources: {id: string, name: string, type: string, link: string}[] = [
  {id: 'res1', name: 'Reglamento Escolar', type: 'PDF', link: '#'},
  {id: 'res2', name: 'Calendario Académico 2024-2', type: 'Documento', link: '#'},
  {id: 'res3', name: 'Formatos de Solicitud', type: 'Web', link: '#'},
  {id: 'res4', name: 'Directorio de la Facultad', type: 'Contacto', link: '#'},
];
