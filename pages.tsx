
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Course, Activity, User, Message, GradeItem, CalendarEvent, ActivityStatus } from './types';
import { mockCourses, mockActivities, mockCurrentUser, mockTeacher, mockStudents, mockMessages, mockChats, mockCourseAcademicProgress, mockCalendarEvents, mockFacultyResources } from './data';
import { 
  CourseCard, Input, Button, ActivityCard, ActivityStatusIcon, FileUpload,
  BookOpenIcon, ClipboardDocumentListIcon, UsersIcon, HomeIcon, SearchIcon, PaperAirplaneIcon, PaperClipIcon,
  GradesChart, CalendarIcon as CalendarIconSvg, Modal, ResourceSearchResults,
  LoadingSpinner, Breadcrumbs, BreadcrumbItem
} from './components.tsx'; 

// --- Helper for Tab Names ---
const getTabUserFriendlyName = (tabKey: string) => {
  switch (tabKey) {
    case 'home': return 'Página Principal';
    case 'materials': return 'Material';
    case 'activities': return 'Actividades';
    case 'members': return 'Integrantes';
    default: return '';
  }
};


// --- Dashboard Page (Mis Cursos) ---
export const DashboardPage: React.FC<{ navigate: (path: string) => void }> = ({ navigate }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<{ type: 'semester' | 'program' | 'all', value: string }>({ type: 'all', value: 'all' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate data fetching
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const filteredCourses = mockCourses.filter(course => {
    const matchesSearch = course.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter.type === 'all' || 
                          (filter.type === 'semester' && course.semester === filter.value) ||
                          (filter.type === 'program' && course.program === filter.value);
    return matchesSearch && matchesFilter;
  });

  const semesters = Array.from(new Set(mockCourses.map(c => c.semester)));
  const programs = Array.from(new Set(mockCourses.map(c => c.program)));

  const breadcrumbItems: BreadcrumbItem[] = [{ label: 'Mis Cursos' }];

  if (loading) {
    return <LoadingSpinner message="Cargando cursos..." className="mt-20" />;
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
      <Breadcrumbs items={breadcrumbItems} navigate={navigate} />
      <h1 className="text-3xl font-bold text-uaq-blue mb-6">Mis Cursos</h1>
      
      <div className="mb-6 flex flex-col md:flex-row gap-4 items-center">
        <Input 
          type="text"
          placeholder="Buscar curso por nombre..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-md flex-grow"
          icon={<SearchIcon className="w-4 h-4 text-gray-400"/>}
          aria-label="Buscar curso por nombre"
        />
        <select 
          value={`${filter.type}-${filter.value}`}
          onChange={(e) => {
            const [type, value] = e.target.value.split('-');
            setFilter({ type: type as 'semester' | 'program' | 'all', value });
          }}
          className="p-2 border border-custom-gray-300 rounded-md shadow-sm focus:ring-uaq-blue focus:border-uaq-blue"
          aria-label="Filtrar cursos"
        >
          <option value="all-all">Todos los Cursos</option>
          <optgroup label="Por Semestre">
            {semesters.map(s => <option key={s} value={`semester-${s}`}>{s}</option>)}
          </optgroup>
          <optgroup label="Por Programa">
            {programs.map(p => <option key={p} value={`program-${p}`}>{p}</option>)}
          </optgroup>
        </select>
      </div>

      {filteredCourses.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredCourses.map(course => (
            <CourseCard key={course.id} course={course} onCourseSelect={(id) => navigate(`/course/${id}`)} />
          ))}
        </div>
      ) : (
        <p className="text-center text-custom-gray-600 text-lg">No se encontraron cursos que coincidan con tu búsqueda o filtro.</p>
      )}
    </div>
  );
};

// --- Course Page ---
export const CoursePage: React.FC<{ navigate: (path: string) => void }> = ({ navigate }) => {
  const { courseId } = useParams<{ courseId: string }>();
  const location = useLocation();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  
  const currentTabFromPath = () => {
    const pathParts = location.pathname.split('/');
    if (pathParts.length > 3 && ['home', 'materials', 'activities', 'members'].includes(pathParts[3])) return pathParts[3];
    return 'home';
  };
  const [activeTab, setActiveTab] = useState<'home' | 'materials' | 'activities' | 'members'>(currentTabFromPath() as 'home' | 'materials' | 'activities' | 'members');


  useEffect(() => {
    setLoading(true);
    // Simulate data fetching
    const timer = setTimeout(() => {
      const foundCourse = mockCourses.find(c => c.id === courseId);
      setCourse(foundCourse || null);
      setActiveTab(currentTabFromPath() as 'home' | 'materials' | 'activities' | 'members');
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [courseId, location.pathname]);

  const handleTabChange = (tab: 'home' | 'materials' | 'activities' | 'members') => {
    setActiveTab(tab);
    navigate(`/course/${courseId}/${tab}`);
  };
  
  if (loading) {
    return <LoadingSpinner message="Cargando información del curso..." className="mt-20" />;
  }

  if (!course) {
    return <div className="text-center p-8">Curso no encontrado. <Button onClick={() => navigate('/')}>Volver a Mis Cursos</Button></div>;
  }

  const breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Mis Cursos', path: '/' },
    { label: course.name, path: `/course/${courseId}/home` },
  ];
  const tabFriendlyName = getTabUserFriendlyName(activeTab);
  if (activeTab !== 'home' && tabFriendlyName) {
    breadcrumbItems.push({ label: tabFriendlyName });
  }


  const CoursePageHeader: React.FC<{ courseName: string, activeTab: string, onTabChange: (tab: 'home' | 'materials' | 'activities' | 'members') => void }> = ({ courseName, activeTab, onTabChange }) => (
    <div className="bg-white shadow-sm sticky top-[72px] z-30"> {/* Adjust top if header height changes */}
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center py-4">
          <h2 className="text-2xl font-semibold text-uaq-blue mb-2 md:mb-0">{courseName}</h2>
        </div>
        <nav className="flex border-b overflow-x-auto">
          {[
            { id: 'home', label: 'Página Principal', icon: <HomeIcon className="w-4 h-4 mr-1 md:mr-2"/> },
            { id: 'materials', label: 'Material', icon: <BookOpenIcon className="w-4 h-4 mr-1 md:mr-2"/> },
            { id: 'activities', label: 'Actividades', icon: <ClipboardDocumentListIcon className="w-4 h-4 mr-1 md:mr-2"/> },
            { id: 'members', label: 'Integrantes', icon: <UsersIcon className="w-4 h-4 mr-1 md:mr-2"/> },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id as 'home' | 'materials' | 'activities' | 'members')}
              className={`flex items-center px-3 py-3 md:px-4 text-sm font-medium border-b-2 transition-colors duration-150 whitespace-nowrap
                ${activeTab === tab.id 
                  ? 'border-uaq-blue text-uaq-blue' 
                  : 'border-transparent text-custom-gray-600 hover:text-uaq-blue hover:border-custom-gray-300'}`}
              aria-current={activeTab === tab.id ? 'page' : undefined}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
  
  const renderTabContent = () => {
    switch (activeTab) {
      case 'home': return <CourseHomePage course={course} navigate={navigate}/>;
      case 'materials': return <CourseMaterialsPage course={course} />;
      case 'activities': return <CourseActivitiesPage courseId={course.id} navigate={navigate} />;
      case 'members': return <CourseMembersPage course={course} />;
      default: return <CourseHomePage course={course} navigate={navigate} />;
    }
  };

  return (
    <>
      <CoursePageHeader courseName={course.name} activeTab={activeTab} onTabChange={handleTabChange}/>
      <div className="container mx-auto">
        <Breadcrumbs items={breadcrumbItems} navigate={navigate} />
        <div className="p-4 md:p-6 pt-0 md:pt-0"> {/* Remove top padding as breadcrumbs have margin */}
         {renderTabContent()}
        </div>
      </div>
    </>
  );
};

// --- Course Sub-Pages ---
const CourseHomePage: React.FC<{ course: Course, navigate: (path: string) => void }> = ({ course, navigate }) => (
  <div className="space-y-6">
    <section className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-xl font-semibold text-uaq-blue mb-3">Información del Docente</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p><strong>Nombre:</strong> {course.teacher.name}</p>
          <p><strong>Correo:</strong> <a href={`mailto:${course.teacher.email}`} className="text-uaq-gold hover:underline">{course.teacher.email}</a></p>
        </div>
        <div>
          <p><strong>Horarios de Asesoría:</strong> Lunes y Miércoles 10-11 AM (Ejemplo)</p>
          <p><strong>Cubículo:</strong> A-101 (Ejemplo)</p>
        </div>
      </div>
    </section>
    
    <section className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-xl font-semibold text-uaq-blue mb-3">Objetivo del Curso</h3>
      <p className="text-custom-gray-700">{course.objective}</p>
    </section>

    <section className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-xl font-semibold text-uaq-blue mb-3">Contenido del Curso</h3>
      <ul className="list-disc list-inside text-custom-gray-700 space-y-1">
        {course.contentSummary.map((item, index) => <li key={index}>{item}</li>)}
      </ul>
    </section>

    <section className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-xl font-semibold text-uaq-blue mb-3">Criterios de Evaluación</h3>
      <ul className="list-disc list-inside text-custom-gray-700 space-y-1">
        {course.evaluationCriteria.map((crit, index) => <li key={index}><strong>{crit.item}:</strong> {crit.weight}</li>)}
      </ul>
    </section>
    
    <section className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-xl font-semibold text-uaq-blue mb-3">Anuncios Recientes</h3>
      <div className="border-l-4 border-uaq-gold p-4 bg-yellow-50 text-yellow-800">
        <p>¡Bienvenidos al curso! Recuerden revisar la sección de actividades semanalmente.</p>
        <p className="mt-2 text-sm">Publicado: {new Date().toLocaleDateString()}</p>
      </div>
    </section>

     <Button onClick={() => navigate(`/grades/${course.id}`)} variant="secondary">
      Ver Progreso Académico
    </Button>
  </div>
);

const CourseMaterialsPage: React.FC<{ course: Course }> = ({ course }) => (
  <div className="bg-white p-6 rounded-lg shadow">
    <h3 className="text-xl font-semibold text-uaq-blue mb-4">Material de la Materia: {course.name}</h3>
    <p className="text-custom-gray-700 mb-4">Aquí encontrarás presentaciones, lecturas, y otros recursos relevantes para el curso.</p>
    {/* Placeholder for material list */}
    <ul className="space-y-3">
      <li className="p-3 border rounded-md hover:bg-custom-gray-50 flex justify-between items-center">
        <span>Presentación Tema 1: Introducción <span className="text-xs text-uaq-gold ml-2">(PDF)</span></span>
        <Button variant="ghost" size="sm">Descargar</Button>
      </li>
      <li className="p-3 border rounded-md hover:bg-custom-gray-50 flex justify-between items-center">
        <span>Lectura Complementaria: Artículo sobre X <span className="text-xs text-uaq-gold ml-2">(Enlace Externo)</span></span>
         <Button variant="ghost" size="sm" onClick={() => window.open('#', '_blank')}>Abrir Enlace</Button>
      </li>
      <li className="p-3 border rounded-md hover:bg-custom-gray-50 flex justify-between items-center">
        <span>Código de Ejemplo: Estructuras de Datos <span className="text-xs text-uaq-gold ml-2">(ZIP)</span></span>
        <Button variant="ghost" size="sm">Descargar</Button>
      </li>
    </ul>
    <div className="mt-6 p-4 border-t border-custom-gray-200">
      <h4 className="font-semibold text-uaq-blue mb-2">Integración con Google Drive</h4>
      <p className="text-sm text-custom-gray-600 mb-2">Accede a los archivos del curso directamente desde Google Drive.</p>
      <Button variant="primary" size="sm" onClick={() => alert('Integración con Google Drive (simulada)')}>Conectar Google Drive</Button>
    </div>
  </div>
);

const CourseActivitiesPage: React.FC<{ courseId: string, navigate: (path: string) => void }> = ({ courseId, navigate }) => {
  const activities = mockActivities.filter(act => act.courseId === courseId);
  
  const categorizeActivities = (status: ActivityStatus) => activities.filter(act => {
    const effectiveStatus = act.submissionStatus || act.status;
    if (status === ActivityStatus.PENDING) return effectiveStatus === ActivityStatus.PENDING || effectiveStatus === ActivityStatus.NOT_SUBMITTED;
    if (status === ActivityStatus.IN_PROGRESS) return effectiveStatus === ActivityStatus.IN_PROGRESS;
    if (status === ActivityStatus.COMPLETED) return effectiveStatus === ActivityStatus.COMPLETED || effectiveStatus === ActivityStatus.GRADED;
    return false;
  });

  const recentActivities = [...activities].sort((a,b) => new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime()).slice(0, 5);
  const pendingActivities = categorizeActivities(ActivityStatus.PENDING);
  const inProgressActivities = categorizeActivities(ActivityStatus.IN_PROGRESS);
  const completedActivities = categorizeActivities(ActivityStatus.COMPLETED);

  const ActivityColumn: React.FC<{title: string, activities: Activity[], onActivitySelect: (id: string) => void}> = ({title, activities, onActivitySelect}) => (
    <div className="bg-custom-gray-100 p-4 rounded-lg min-w-[280px] md:min-w-[300px] flex-shrink-0">
      <h3 className="text-lg font-semibold text-uaq-blue mb-4">{title} ({activities.length})</h3>
      {activities.length > 0 ? (
        <div className="space-y-3">
          {activities.map(act => <ActivityCard key={act.id} activity={act} onActivitySelect={onActivitySelect} />)}
        </div>
      ) : <p className="text-sm text-custom-gray-500">No hay actividades en esta categoría.</p>}
    </div>
  );

  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold text-uaq-blue mb-1">Actividades del Curso</h3>
      <p className="text-custom-gray-600 mb-6">Organiza y accede a todas tus actividades.</p>
      
      <div className="flex overflow-x-auto space-x-4 pb-4 -mx-4 px-4"> {/* Negative margin to extend scroll area to page edges if needed */}
        <ActivityColumn title="Recientes" activities={recentActivities} onActivitySelect={(id) => navigate(`/course/${courseId}/activity/${id}`)} />
        <ActivityColumn title="Pendientes" activities={pendingActivities} onActivitySelect={(id) => navigate(`/course/${courseId}/activity/${id}`)} />
        <ActivityColumn title="En Curso" activities={inProgressActivities} onActivitySelect={(id) => navigate(`/course/${courseId}/activity/${id}`)} />
        <ActivityColumn title="Terminadas/Calificadas" activities={completedActivities} onActivitySelect={(id) => navigate(`/course/${courseId}/activity/${id}`)} />
      </div>
    </div>
  );
};

const CourseMembersPage: React.FC<{ course: Course }> = ({ course }) => {
  const teacher = course.teacher;
  const studentsInCourse = mockStudents.filter(s => s.id !== teacher.id); // Simple filter for demo

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-xl font-semibold text-uaq-blue mb-4">Integrantes del Curso: {course.name}</h3>
      
      <section className="mb-6">
        <h4 className="text-lg font-medium text-custom-gray-800 mb-2">Profesor</h4>
        <div className="flex items-center space-x-3 p-3 border rounded-md">
          <img src={teacher.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(teacher.name)}&background=003366&color=fff&size=128`} alt={teacher.name} className="w-10 h-10 rounded-full"/>
          <div>
            <p className="font-semibold">{teacher.name}</p>
            <a href={`mailto:${teacher.email}`} className="text-sm text-uaq-gold hover:underline">{teacher.email}</a>
          </div>
          <Button size="sm" variant="ghost" className="ml-auto" onClick={() => alert(`Contactar a ${teacher.name} (simulado)`)}>Contactar</Button>
        </div>
      </section>

      <section>
        <h4 className="text-lg font-medium text-custom-gray-800 mb-2">Alumnos ({studentsInCourse.length})</h4>
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {studentsInCourse.map(student => (
            <div key={student.id} className="flex items-center space-x-3 p-3 border rounded-md">
              <img src={student.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(student.name)}&background=E0E7FF&color=4A5568&size=128`} alt={student.name} className="w-8 h-8 rounded-full"/>
              <div>
                <p>{student.name}</p>
                 <a href={`mailto:${student.email}`} className="text-xs text-custom-gray-500 hover:underline">{student.email}</a>
              </div>
              <Button size="sm" variant="ghost" className="ml-auto" onClick={() => alert(`Contactar a ${student.name} (simulado)`)}>Contactar</Button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

// --- Activity Detail Page ---
export const ActivityDetailPage: React.FC<{ navigate: (path: string) => void }> = ({ navigate }) => {
  const { courseId, activityId } = useParams<{ courseId: string, activityId: string }>();
  const [activity, setActivity] = useState<Activity | null>(null);
  const [courseName, setCourseName] = useState<string>('');
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  useEffect(() => {
    setLoading(true);
    // Simulate data fetching
    const timer = setTimeout(() => {
      const foundActivity = mockActivities.find(act => act.id === activityId && act.courseId === courseId);
      setActivity(foundActivity || null);
      const foundCourse = mockCourses.find(c => c.id === courseId);
      setCourseName(foundCourse?.name || '');
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [courseId, activityId]);

  const handleFileUpload = (uploadedFile: File | null) => {
    setFile(uploadedFile);
  };
  
  const handleAttemptSubmit = () => {
    if(!file) {
      alert("Por favor, selecciona un archivo para entregar.");
      return;
    }
    setIsConfirmModalOpen(true);
  };

  const handleConfirmSubmit = () => {
    setIsConfirmModalOpen(false);
    if(file && activity){
      setLoading(true); // Simulate submission processing
      setTimeout(() => {
        const updatedActivity = {...activity, submissionStatus: ActivityStatus.COMPLETED, status: ActivityStatus.COMPLETED};
        const index = mockActivities.findIndex(a => a.id === activity.id);
        if(index !== -1) mockActivities[index] = updatedActivity;
        setActivity(updatedActivity);
        setLoading(false);
        alert(`Archivo "${file.name}" entregado para "${activity.name}".`);
        // navigate(`/course/${courseId}/activities`); // Optionally navigate away
      }, 1000);
    }
  };


  if (loading && !isConfirmModalOpen) { // Don't show main page loading if modal is open
    return <LoadingSpinner message="Cargando detalles de la actividad..." className="mt-20" />;
  }

  if (!activity) {
    return <div className="text-center p-8">Actividad no encontrada. <Button onClick={() => navigate(`/course/${courseId}/activities`)}>Volver a Actividades</Button></div>;
  }

  const breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Mis Cursos', path: '/' },
    { label: courseName, path: `/course/${courseId}/home` },
    { label: 'Actividades', path: `/course/${courseId}/activities` },
    { label: activity.name }
  ];
  
  const canSubmit = activity.submissionStatus !== ActivityStatus.GRADED && activity.submissionStatus !== ActivityStatus.COMPLETED;

  return (
    <div className="container mx-auto">
      <Breadcrumbs items={breadcrumbItems} navigate={navigate} />
      <div className="p-4 md:p-6 pt-0 md:pt-0">
        <Button onClick={() => navigate(`/course/${courseId}/activities`)} variant="ghost" size="sm" className="mb-4">
          &larr; Volver a Actividades de {courseName}
        </Button>
        <div className="bg-white p-6 rounded-lg shadow space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
              <h1 className="text-2xl font-bold text-uaq-blue mb-2 sm:mb-0">{activity.name}</h1>
              <div className="flex items-center space-x-2">
                  <span className="text-sm text-custom-gray-600">Estado:</span>
                  <ActivityStatusIcon status={activity.submissionStatus || ActivityStatus.NOT_SUBMITTED} />
                  <span className="text-sm font-medium">{activity.submissionStatus || ActivityStatus.NOT_SUBMITTED}</span>
              </div>
          </div>
          
          <p className="text-sm text-custom-gray-500">Fecha Límite: {new Date(activity.dueDate).toLocaleString()}</p>
          
          <div>
            <h3 className="text-lg font-semibold text-uaq-blue mb-2">Descripción Detallada</h3>
            <p className="text-custom-gray-700 whitespace-pre-line">{activity.description}</p>
          </div>

          {activity.resources && activity.resources.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-uaq-blue mb-2">Recursos Descargables</h3>
              <ul className="space-y-2">
                {activity.resources.map(res => (
                  <li key={res.name}>
                    <a href={res.url} download className="text-uaq-gold hover:underline flex items-center">
                      <ClipboardDocumentListIcon className="w-5 h-5 mr-2"/> {res.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold text-uaq-blue mb-3">Panel de Entrega</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center mb-4">
              <div>
                <p><strong>Estado de la Entrega:</strong> <span className={`font-semibold ${activity.submissionStatus === ActivityStatus.GRADED ? 'text-green-600' : 'text-custom-gray-700'}`}>{activity.submissionStatus || ActivityStatus.NOT_SUBMITTED}</span></p>
                {activity.submissionStatus === ActivityStatus.GRADED && activity.grade !== undefined && (
                  <p><strong>Calificación:</strong> <span className="font-bold text-uaq-blue">{activity.grade}/{activity.maxGrade || 100}</span></p>
                )}
              </div>
            </div>
            
            {canSubmit && (
               <>
                  <h4 className="text-md font-semibold text-custom-gray-800 mb-2">Subir Archivo</h4>
                  <FileUpload onFileUpload={handleFileUpload} currentFile={file} />
                  <Button onClick={handleAttemptSubmit} className="mt-4" disabled={!file || loading}>
                    {loading ? 'Procesando...' : 'Entregar Actividad'}
                  </Button>
               </>
            )}

            {activity.submissionStatus === ActivityStatus.COMPLETED && !activity.grade && (
              <p className="mt-4 p-3 bg-green-50 text-green-700 rounded-md">Ya has entregado esta actividad. Esperando calificación.</p>
            )}

             {activity.submissionStatus === ActivityStatus.GRADED && activity.grade !== undefined && (
               <div className="mt-4 p-3 bg-blue-50 text-uaq-blue rounded-md">
                  <p><strong>Retroalimentación:</strong> {mockCourseAcademicProgress[courseId || '']?.grades.find(g => g.activityName.includes(activity.name))?.feedback || 'Sin retroalimentación adicional.'}</p>
               </div>
             )}
          </div>
        </div>
      </div>
      <Modal 
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        title="Confirmar Entrega"
      >
        <p className="text-custom-gray-700 mb-6">¿Estás seguro de que deseas entregar el archivo "{file?.name}"? Esta acción no se puede deshacer.</p>
        <div className="flex justify-end space-x-3">
          <Button variant="ghost" onClick={() => setIsConfirmModalOpen(false)}>Cancelar</Button>
          <Button variant="primary" onClick={handleConfirmSubmit}>Confirmar Entrega</Button>
        </div>
      </Modal>
    </div>
  );
};


// --- Messaging Page ---
export const MessagingPage: React.FC<{ navigate: (path: string) => void }> = ({ navigate }) => {
  const [chats, setChats] = useState<typeof mockChats>(mockChats);
  const [selectedChat, setSelectedChat] = useState<typeof mockChats[0] | null>(chats[0] || null);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedChat) return;
    const message: Message = {
      id: `msg${Date.now()}`,
      senderId: mockCurrentUser.id,
      receiverId: selectedChat.participants.find(p => p.id !== mockCurrentUser.id)?.id || '',
      content: newMessage,
      timestamp: new Date(),
    };
    
    const updatedChats = chats.map(chat => 
      chat.id === selectedChat.id 
        ? { ...chat, messages: [...chat.messages, message], lastMessage: message } 
        : chat
    );
    setChats(updatedChats.sort((a,b) => (b.lastMessage?.timestamp.getTime() || 0) - (a.lastMessage?.timestamp.getTime() || 0) ));
    setSelectedChat(prev => prev ? {...prev, messages: [...prev.messages, message], lastMessage: message} : null);
    setNewMessage('');
  };
  
  const filteredChats = chats.filter(chat => {
    const otherParticipant = chat.participants.find(p => p.id !== mockCurrentUser.id);
    return otherParticipant?.name.toLowerCase().includes(searchTerm.toLowerCase());
  }).sort((a,b) => (b.lastMessage?.timestamp.getTime() || 0) - (a.lastMessage?.timestamp.getTime() || 0) );

  const breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Mis Cursos', path: '/' },
    { label: 'Mensajería' }
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-72px-40px)]"> {/* Header height - Breadcrumb approx height */}
        <div className="container mx-auto">
            <Breadcrumbs items={breadcrumbItems} navigate={navigate} />
        </div>
        <div className="container mx-auto flex flex-grow h-[calc(100%-2rem)] shadow-lg rounded-lg overflow-hidden"> {/* Adjust height considering breadcrumbs */}
            {/* Panel Izquierdo */}
            <div className="w-full md:w-1/3 border-r border-custom-gray-300 bg-white flex flex-col">
                <div className="p-4 border-b">
                <Input 
                    type="search" 
                    placeholder="Buscar contactos..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    icon={<SearchIcon className="w-4 h-4 text-gray-400"/>}
                    aria-label="Buscar contactos o iniciar chat"
                />
                </div>
                <div className="overflow-y-auto flex-grow">
                {filteredChats.map(chat => {
                    const otherUser = chat.participants.find(p => p.id !== mockCurrentUser.id);
                    if (!otherUser) return null;
                    return (
                    <div 
                        key={chat.id} 
                        onClick={() => setSelectedChat(chat)}
                        className={`p-4 flex items-center space-x-3 cursor-pointer hover:bg-custom-gray-100 ${selectedChat?.id === chat.id ? 'bg-custom-gray-100 border-r-4 border-uaq-blue' : ''}`}
                        role="button"
                        tabIndex={0}
                        onKeyPress={(e) => e.key === 'Enter' && setSelectedChat(chat)}
                        aria-label={`Abrir chat con ${otherUser.name}`}
                    >
                        <img src={otherUser.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(otherUser.name)}&background=0D8ABC&color=fff&size=128`} alt={otherUser.name} className="w-10 h-10 rounded-full"/>
                        <div>
                        <p className="font-semibold">{otherUser.name}</p>
                        <p className="text-sm text-custom-gray-500 truncate w-40 md:w-48">{chat.lastMessage?.content}</p>
                        </div>
                        <span className="text-xs text-custom-gray-400 ml-auto self-start">{chat.lastMessage?.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                    </div>
                    );
                })}
                {filteredChats.length === 0 && <p className="p-4 text-sm text-custom-gray-500">No hay chats. Intenta buscar un contacto.</p>}
                </div>
            </div>

            {/* Panel Derecho (Ventana de Chat) */}
            <div className="hidden md:flex w-2/3  flex-col bg-custom-gray-50">
                {selectedChat && selectedChat.participants.find(p => p.id !== mockCurrentUser.id) ? (
                <>
                    <div className="p-4 border-b bg-white flex items-center space-x-3">
                    <img src={selectedChat.participants.find(p => p.id !== mockCurrentUser.id)!.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedChat.participants.find(p => p.id !== mockCurrentUser.id)!.name)}&background=0D8ABC&color=fff&size=128`} alt="avatar" className="w-10 h-10 rounded-full"/>
                    <h3 className="text-lg font-semibold text-uaq-blue">{selectedChat.participants.find(p => p.id !== mockCurrentUser.id)!.name}</h3>
                    </div>
                    <div className="flex-grow overflow-y-auto p-4 space-y-2">
                    {selectedChat.messages.map(msg => (
                        <div key={msg.id} className={`flex ${msg.senderId === mockCurrentUser.id ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${msg.senderId === mockCurrentUser.id ? 'bg-uaq-blue text-white' : 'bg-white shadow'}`}>
                            <p>{msg.content}</p>
                            <p className={`text-xs mt-1 ${msg.senderId === mockCurrentUser.id ? 'text-blue-200' : 'text-custom-gray-400'} text-right`}>{msg.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                        </div>
                        </div>
                    ))}
                    </div>
                    <div className="p-4 border-t bg-white flex items-center space-x-2">
                    <Button variant="ghost" size="sm" title="Adjuntar archivo"><PaperClipIcon /></Button>
                    <Input 
                        type="text" 
                        placeholder="Escribe un mensaje..." 
                        className="flex-grow"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        aria-label="Nuevo mensaje"
                    />
                    <Button onClick={handleSendMessage} title="Enviar mensaje"><PaperAirplaneIcon /></Button>
                    </div>
                </>
                ) : (
                <div className="flex-grow flex items-center justify-center text-custom-gray-500">
                    <p>Selecciona un chat para ver los mensajes o busca un contacto para iniciar uno nuevo.</p>
                </div>
                )}
            </div>
        </div>
    </div>
  );
};


// --- Grades Page ---
export const GradesPage: React.FC<{ navigate: (path: string) => void }> = ({ navigate }) => {
  const { courseId } = useParams<{ courseId?: string }>();
  const [selectedCourseId, setSelectedCourseId] = useState<string | undefined>(courseId || mockCourses[0]?.id);
  const [academicProgress, setAcademicProgress] = useState<GradeItem[]>([]);
  const [finalGrade, setFinalGrade] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    setLoading(true);
    // Simulate fetching
    setTimeout(() => {
        if (selectedCourseId) {
            const progress = mockCourseAcademicProgress[selectedCourseId];
            if (progress) {
                setAcademicProgress(progress.grades);
                setFinalGrade(progress.finalGrade);
            } else {
                setAcademicProgress([]);
                setFinalGrade(null);
            }
        } else {
            setAcademicProgress([]);
            setFinalGrade(null);
        }
        setLoading(false);
    }, 500);
  }, [selectedCourseId]);

  const currentCourseName = mockCourses.find(c => c.id === selectedCourseId)?.name;

  const breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Mis Cursos', path: '/' },
    { label: 'Calificaciones' }
  ];
  if(currentCourseName && selectedCourseId) {
    breadcrumbItems.push({ label: currentCourseName });
  }


  return (
    <div className="container mx-auto">
      <Breadcrumbs items={breadcrumbItems} navigate={navigate} />
      <div className="p-4 md:p-6 pt-0 md:pt-0">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-uaq-blue mb-4 md:mb-0">Mis Calificaciones</h1>
            <select 
            value={selectedCourseId || ""} 
            onChange={(e) => {
                setSelectedCourseId(e.target.value);
                navigate(e.target.value ? `/grades/${e.target.value}`: '/grades');
            }}
            className="p-2 border border-custom-gray-300 rounded-md shadow-sm focus:ring-uaq-blue focus:border-uaq-blue"
            aria-label="Seleccionar curso para ver calificaciones"
            >
            <option value="">-- Selecciona un Curso --</option>
            {mockCourses.map(course => (
                <option key={course.id} value={course.id}>{course.name}</option>
            ))}
            </select>
        </div>

        {loading ? (
            <LoadingSpinner message="Cargando calificaciones..." />
        ) : selectedCourseId && academicProgress.length > 0 ? (
            <>
            <h2 className="text-xl font-semibold text-custom-gray-800 mb-4">Detalle de: {currentCourseName}</h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold text-uaq-blue mb-3">Listado de Calificaciones</h3>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-custom-gray-200">
                    <thead className="bg-custom-gray-50">
                        <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-custom-gray-500 uppercase tracking-wider">Actividad/Evaluación</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-custom-gray-500 uppercase tracking-wider">Calificación</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-custom-gray-500 uppercase tracking-wider">Retroalimentación</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-custom-gray-200">
                        {academicProgress.map((item, index) => (
                        <tr key={index}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-custom-gray-900">{item.activityName}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-custom-gray-500">
                            {item.grade !== null ? `${item.grade} / ${item.maxGrade}` : 'Pendiente'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-custom-gray-500">{item.feedback || '-'}</td>
                        </tr>
                        ))}
                    </tbody>
                    </table>
                </div>
                {finalGrade !== null && (
                    <div className="mt-6 text-right">
                    <p className="text-lg font-semibold">Calificación Final del Curso: <span className="text-uaq-blue text-xl">{finalGrade.toFixed(1)}</span></p>
                    </div>
                )}
                </div>
                <div className="lg:col-span-1">
                <GradesChart grades={academicProgress} />
                </div>
            </div>
            </>
        ) : selectedCourseId ? (
            <p className="text-center text-custom-gray-600 p-8">No hay calificaciones disponibles para este curso aún.</p>
        ) : (
            <p className="text-center text-custom-gray-600 p-8">Por favor, selecciona un curso para ver tus calificaciones.</p>
        )}
      </div>
    </div>
  );
};

// --- Calendar Page ---
export const CalendarPage: React.FC<{ navigate: (path: string) => void }> = ({ navigate }) => {
  const [events, setEvents] = useState<CalendarEvent[]>(mockCalendarEvents);
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const academicCalendarImageUrl = "https://i.imgur.com/uR2XymL.jpeg"; // Provided image URL

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay(); 
  
  const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

  const getEventsForDay = (day: number) => {
    return events.filter(event => {
      const eventDate = new Date(event.start);
      return eventDate.getFullYear() === currentYear && eventDate.getMonth() === currentMonth && eventDate.getDate() === day;
    });
  };
  
  const breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Mis Cursos', path: '/' },
    { label: 'Calendario' }
  ];

  return (
    <div className="container mx-auto">
        <Breadcrumbs items={breadcrumbItems} navigate={navigate} />
        <div className="p-4 md:p-6 pt-0 md:pt-0">
            <h1 className="text-3xl font-bold text-uaq-blue mb-6">Calendario Académico</h1>

            <div className="bg-white p-6 rounded-lg shadow mb-6">
                <h2 className="text-xl font-semibold text-uaq-blue mb-3">Calendario Escolar Oficial UAQ</h2>
                 <img 
                    src={academicCalendarImageUrl} 
                    alt="Calendario Escolar UAQ 2025" 
                    className="w-full h-auto rounded-md shadow-sm object-contain max-h-[70vh]" 
                />
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex justify-between items-center mb-4">
                <Button onClick={() => {
                    if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear(y => y - 1); }
                    else { setCurrentMonth(m => m - 1); }
                }}>&lt; Anterior</Button>
                <h2 className="text-xl font-semibold">{monthNames[currentMonth]} {currentYear}</h2>
                <Button onClick={() => {
                    if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear(y => y + 1); }
                    else { setCurrentMonth(m => m + 1); }
                }}>Siguiente &gt;</Button>
                </div>
                <div className="grid grid-cols-7 gap-px border bg-custom-gray-200">
                {["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"].map(day => (
                    <div key={day} className="text-center font-semibold py-2 bg-custom-gray-100">{day}</div>
                ))}
                {Array.from({ length: firstDayOfMonth }).map((_, i) => <div key={`empty-${i}`} className="border bg-white min-h-[100px]"></div>)}
                {Array.from({ length: daysInMonth }).map((_, dayIndex) => {
                    const day = dayIndex + 1;
                    const dayEvents = getEventsForDay(day);
                    return (
                    <div key={day} className="border p-1 min-h-[100px] bg-white hover:bg-custom-gray-50 transition-colors">
                        <div className={`font-medium ${day === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear() ? 'text-uaq-blue ring-1 ring-uaq-blue rounded-full w-6 h-6 flex items-center justify-center' : ''}`}>{day}</div>
                        <div className="text-xs space-y-0.5 mt-1">
                        {dayEvents.map(event => (
                            <div key={event.id} className="bg-uaq-gold text-uaq-blue p-0.5 rounded-sm truncate" title={`${event.title} - ${event.start.toLocaleTimeString()}`}>{event.title}</div>
                        ))}
                        </div>
                    </div>
                    );
                })}
                </div>
                <div className="mt-6 p-4 border-t border-custom-gray-200">
                    <h4 className="font-semibold text-uaq-blue mb-2">Integración con Google Calendar</h4>
                    <p className="text-sm text-custom-gray-600 mb-2">Sincroniza tus eventos académicos con Google Calendar.</p>
                    <Button variant="primary" size="sm" onClick={() => alert('Integración con Google Calendar (simulada)')}>Conectar Google Calendar</Button>
                </div>
            </div>
        </div>
    </div>
  );
};


// --- Settings Page ---
export const SettingsPage: React.FC<{ navigate: (path: string) => void }> = ({ navigate }) => {
  const [user, setUser] = useState(mockCurrentUser);
  const [isEditing, setIsEditing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    console.log("Saving user data:", user);
    setIsEditing(false);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000); // Hide after 3 seconds
  };
  
  const breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Mis Cursos', path: '/' },
    { label: 'Configuración de Cuenta' }
  ];

  return (
    <div className="container mx-auto">
        <Breadcrumbs items={breadcrumbItems} navigate={navigate} />
        <div className="p-4 md:p-8 pt-0 md:pt-0">
            <h1 className="text-3xl font-bold text-uaq-blue mb-6">Configuración de Cuenta</h1>
            {showSuccess && (
                <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md shadow" role="alert">
                ¡Información guardada con éxito!
                </div>
            )}
            <div className="bg-white p-6 rounded-lg shadow max-w-2xl mx-auto">
                <div className="flex items-center space-x-4 mb-6">
                <img src={user.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=003366&color=fff&size=128`} alt={user.name} className="w-24 h-24 rounded-full object-cover"/>
                <div>
                    <h2 className="text-2xl font-semibold text-custom-gray-800">{user.name}</h2>
                    <p className="text-custom-gray-600">{user.email}</p>
                    <p className="text-sm text-uaq-gold capitalize">{user.role}</p>
                </div>
                </div>

                <form onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
                <div className="space-y-4">
                    <Input label="Nombre Completo" name="name" value={user.name} onChange={handleInputChange} disabled={!isEditing} />
                    <Input label="Correo Electrónico" name="email" type="email" value={user.email} onChange={handleInputChange} disabled={!isEditing} />
                    <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Cambiar Contraseña</label>
                    <Input type="password" name="currentPassword" placeholder="Contraseña Actual" disabled={!isEditing} />
                    <Input type="password" name="newPassword" placeholder="Nueva Contraseña" className="mt-2" disabled={!isEditing} />
                    <Input type="password" name="confirmPassword" placeholder="Confirmar Nueva Contraseña" className="mt-2" disabled={!isEditing} />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-uaq-blue mt-6 mb-2">Preferencias</h3>
                        <label className="flex items-center space-x-2">
                            <input type="checkbox" className="form-checkbox text-uaq-blue focus:ring-uaq-gold" disabled={!isEditing}/>
                            <span>Recibir notificaciones por correo</span>
                        </label>
                        <label className="flex items-center space-x-2 mt-2">
                            <input type="checkbox" className="form-checkbox text-uaq-blue focus:ring-uaq-gold" defaultChecked disabled={!isEditing}/>
                            <span>Usar tema oscuro (si disponible)</span>
                        </label>
                    </div>
                </div>
                <div className="mt-8 flex justify-end space-x-3">
                    {isEditing ? (
                    <>
                        <Button type="button" variant="ghost" onClick={() => { setIsEditing(false); setUser(mockCurrentUser); }}>Cancelar</Button>
                        <Button type="submit" variant="primary">Guardar Cambios</Button>
                    </>
                    ) : (
                    <Button type="button" onClick={() => setIsEditing(true)}>Editar Perfil</Button>
                    )}
                </div>
                </form>
            </div>
        </div>
    </div>
  );
};


// --- Auth Pages (Login, Register, Forgot Password) ---
export const LoginPage: React.FC<{ navigate: (path: string) => void }> = ({ navigate }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email || !password) {
      setError('Por favor, ingresa correo y contraseña.');
      return;
    }
    if (email === 'estudiante@uaq.mx' && password === 'password') {
      alert('Inicio de sesión exitoso!');
      navigate('/'); 
    } else {
      setError('Correo o contraseña incorrectos.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-custom-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-lg">
        <div>
          <img className="mx-auto h-20 w-auto" src="https://www.uaq.mx/ CienciasNaturales/images/escudoColor.png" alt="UAQ" /> {/* Replace with actual UAQ logo if available */}
          <h2 className="mt-6 text-center text-3xl font-extrabold text-uaq-blue">
            Iniciar Sesión
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && <p className="text-red-500 text-sm text-center" role="alert">{error}</p>}
          <Input 
            id="email" 
            name="email" 
            type="email" 
            autoComplete="email" 
            required 
            placeholder="Correo Electrónico" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            aria-describedby={error ? "error-message" : undefined}
          />
          <Input 
            id="password" 
            name="password" 
            type="password" 
            autoComplete="current-password" 
            required 
            placeholder="Contraseña" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            aria-describedby={error ? "error-message" : undefined}
          />
          {error && <span id="error-message" className="sr-only">{error}</span>}
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input id="remember-me" name="remember-me" type="checkbox" className="h-4 w-4 text-uaq-blue focus:ring-uaq-gold border-custom-gray-300 rounded" />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-custom-gray-900"> Recordarme </label>
            </div>
            <div className="text-sm">
              <a href="#/forgot-password" onClick={(e) => { e.preventDefault(); navigate('/forgot-password');}} className="font-medium text-uaq-gold hover:text-uaq-blue"> ¿Olvidaste tu contraseña? </a>
            </div>
          </div>
          <div>
            <Button type="submit" className="w-full">
              Ingresar
            </Button>
          </div>
        </form>
        <p className="mt-4 text-center text-sm text-custom-gray-600">
          ¿No tienes cuenta?{' '}
          <a href="#/register" onClick={(e) => { e.preventDefault(); navigate('/register');}} className="font-medium text-uaq-gold hover:text-uaq-blue">
            Regístrate aquí
          </a>
        </p>
      </div>
    </div>
  );
};

export const RegisterPage: React.FC<{ navigate: (path: string) => void }> = ({ navigate }) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Registro simulado exitoso!');
    navigate('/login');
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-custom-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-lg">
        <div>
           <img className="mx-auto h-20 w-auto" src="https://www.uaq.mx/ CienciasNaturales/images/escudoColor.png" alt="UAQ" />
          <h2 className="mt-6 text-center text-3xl font-extrabold text-uaq-blue">
            Crear Nueva Cuenta
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <Input id="fullName" name="fullName" type="text" required placeholder="Nombre Completo" />
          <Input id="email" name="email" type="email" required placeholder="Correo Electrónico Institucional" />
          <Input id="studentId" name="studentId" type="text" required placeholder="Expediente / Número de Empleado" />
          <Input id="password" name="password" type="password" required placeholder="Contraseña" />
          <Input id="confirmPassword" name="confirmPassword" type="password" required placeholder="Confirmar Contraseña" />
          <p className="text-xs text-custom-gray-500">La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula y un número.</p>
          <div>
            <Button type="submit" className="w-full">
              Registrarse
            </Button>
          </div>
        </form>
         <p className="mt-4 text-center text-sm text-custom-gray-600">
          ¿Ya tienes cuenta?{' '}
          <a href="#/login" onClick={(e) => { e.preventDefault(); navigate('/login');}} className="font-medium text-uaq-gold hover:text-uaq-blue">
            Inicia sesión
          </a>
        </p>
      </div>
    </div>
  );
};

export const ForgotPasswordPage: React.FC<{ navigate: (path: string) => void }> = ({ navigate }) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Se ha enviado un correo con instrucciones para recuperar tu contraseña (simulado).');
    navigate('/login');
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-custom-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-lg">
        <div>
          <img className="mx-auto h-20 w-auto" src="https://www.uaq.mx/ CienciasNaturales/images/escudoColor.png" alt="UAQ" />
          <h2 className="mt-6 text-center text-3xl font-extrabold text-uaq-blue">
            Recuperar Contraseña
          </h2>
           <p className="mt-2 text-center text-sm text-custom-gray-600">
            Ingresa tu correo electrónico institucional y te enviaremos un enlace para restablecer tu contraseña.
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <Input id="email" name="email" type="email" required placeholder="Correo Electrónico Institucional" />
          <div>
            <Button type="submit" className="w-full">
              Enviar Enlace de Recuperación
            </Button>
          </div>
        </form>
         <p className="mt-4 text-center text-sm text-custom-gray-600">
          <a href="#/login" onClick={(e) => { e.preventDefault(); navigate('/login');}} className="font-medium text-uaq-gold hover:text-uaq-blue">
            Volver a Iniciar Sesión
          </a>
        </p>
      </div>
    </div>
  );
};


// --- Help Page ---
export const HelpPage: React.FC<{ navigate: (path: string) => void }> = ({ navigate }) => {
    const breadcrumbItems: BreadcrumbItem[] = [
      { label: 'Mis Cursos', path: '/' },
      { label: 'Ayuda y Soporte' }
    ];
  
    return (
      <div className="container mx-auto">
        <Breadcrumbs items={breadcrumbItems} navigate={navigate} />
        <div className="p-4 md:p-8 pt-0 md:pt-0">
            <h1 className="text-3xl font-bold text-uaq-blue mb-6">Ayuda y Soporte</h1>
            <div className="bg-white p-6 rounded-lg shadow space-y-6">
            <section>
                <h2 className="text-xl font-semibold text-uaq-blue mb-3">Preguntas Frecuentes (FAQ)</h2>
                <div className="space-y-4">
                <div>
                    <h3 className="font-semibold text-custom-gray-800">¿Cómo puedo ver mis cursos?</h3>
                    <p className="text-custom-gray-700">Puedes ver todos tus cursos inscritos en la página principal "Mis Cursos" después de iniciar sesión.</p>
                </div>
                <div>
                    <h3 className="font-semibold text-custom-gray-800">¿Dónde encuentro el material de un curso?</h3>
                    <p className="text-custom-gray-700">Dentro de cada curso, navega a la pestaña "Material". Allí encontrarás los recursos compartidos por tu profesor.</p>
                </div>
                <div>
                    <h3 className="font-semibold text-custom-gray-800">¿Cómo entrego una actividad?</h3>
                    <p className="text-custom-gray-700">Ve a la sección "Actividades" de tu curso, selecciona la actividad y utiliza el panel de entrega para subir tu archivo. Asegúrate de confirmar la entrega.</p>
                </div>
                </div>
            </section>
            <section className="border-t pt-6">
                <h2 className="text-xl font-semibold text-uaq-blue mb-3">Contactar Soporte Técnico</h2>
                <p className="text-custom-gray-700">Si necesitas asistencia adicional o tienes problemas técnicos, por favor contacta al equipo de soporte de la Facultad de Informática:</p>
                <p className="mt-2"><strong>Correo:</strong> <a href="mailto:soporte.informatica@uaq.mx" className="text-uaq-gold hover:underline">soporte.informatica@uaq.mx</a></p>
                <p className="mt-1"><strong>Teléfono:</strong> (442) 123 4567 Ext. 101 (Horario de atención: L-V 9am - 5pm)</p>
            </section>
            </div>
        </div>
      </div>
    );
  };
