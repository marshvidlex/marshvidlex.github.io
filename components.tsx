
import React, { useState, useCallback, ReactNode, ChangeEvent } from 'react';
import { Course, Activity, ActivityStatus, User, Message, GradeItem, Notification, CalendarEvent } from './types';
import { mockFacultyResources } from './data';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// --- Icon Components ---
export const UaqLogo: React.FC = () => (
  <svg width="40" height="40" viewBox="0 0 268 268" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-uaq-blue">
    <path d="M133.541 268C207.307 268 267.082 207.966 267.082 134C267.082 60.0341 207.307 0 133.541 0C59.7753 0 0 60.0341 0 134C0 207.966 59.7753 268 133.541 268ZM133.541 23.993C193.994 23.993 243.089 73.2386 243.089 134C243.089 194.761 193.994 244.007 133.541 244.007C73.0886 244.007 23.993 194.761 23.993 134C23.993 73.2386 73.0886 23.993 133.541 23.993Z" fill="currentColor"/>
    <path d="M133.208 214.333C147.288 214.333 162.062 211.083 172.937 205.083L177.304 184.25C164.717 190.833 149.675 193.333 136.958 193.333C104.975 193.333 80.9333 177.083 80.9333 141.417C80.9333 106.583 104.975 88.5833 136.958 88.5833C149.942 88.5833 164.983 91.0833 177.304 97.6667L172.937 76.5833C162.062 70.8333 147.288 67.3333 133.208 67.3333C87.0666 67.3333 53.6083 98.9167 53.6083 141.417C53.6083 184.25 87.0666 214.333 133.208 214.333Z" fill="currentColor"/>
    <path d="M198.817 197.5L194.45 176.667C203.158 171.5 211.033 163.083 211.033 150.833C211.033 135.5 197.742 127.333 182.7 127.333H162.067V155.5H180.333C187.333 155.5 190.067 159.083 190.067 163.5C190.067 167.917 187.333 171.5 180.333 171.5H150.067V84.0001H183.033C212.9 84.0001 232.817 99.0834 232.817 125.833C232.817 146.667 220.742 161.083 203.667 169.5L210.208 197.5H198.817Z" fill="currentColor"/>
  </svg>
);

export const SearchIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
  </svg>
);

export const BellIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
  </svg>
);

export const ChartBarIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
  </svg>
);

export const CogIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-1.003 1.116-1.003h2.58c.556 0 1.026.461 1.116 1.003L15.65 6.354a1.375 1.375 0 001.077 1.077l2.415.705c.542.09.901.56.901 1.116v2.58c0 .556-.359 1.026-.901 1.116l-2.415.705a1.375 1.375 0 00-1.077 1.077l-.705 2.415c-.09.542-.56 1.003-1.116 1.003h-2.58c-.556 0-1.026-.461-1.116-1.003l-.705-2.415a1.375 1.375 0 00-1.077-1.077l-2.415-.705c-.542-.09-.901-.56-.901-1.116v-2.58c0-.556.359 1.026.901 1.116l2.415-.705A1.375 1.375 0 009.594 3.94zM12 8.25a3.75 3.75 0 100 7.5 3.75 3.75 0 000-7.5z" />
  </svg>
);

export const CalendarIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-3.75h.008v.008H12v-.008z" />
  </svg>
);

export const HomeIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h7.5" />
  </svg>
);

export const QuestionMarkCircleIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
    </svg>
);


export const BookOpenIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
  </svg>
);

export const ClipboardDocumentListIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.172a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM10.5 16.5h.008v.008h-.008V16.5zm0-3h.008v.008h-.008V13.5zm0-3h.008v.008h-.008V10.5z" />
  </svg>
);

export const UsersIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
  </svg>
);

export const PaperAirplaneIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
  </svg>
);

export const PaperClipIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M18.375 12.739l-7.693 7.693a4.5 4.5 0 01-6.364-6.364l10.94-10.94A3 3 0 1119.5 7.372L8.552 18.32m.009-.01l-.01.01m5.699-9.941l-7.81 7.81a1.5 1.5 0 002.122 2.122l7.81-7.81" />
  </svg>
);

export const CheckCircleIcon: React.FC<{ className?: string; title?: string }> = ({ className = "w-5 h-5 text-green-500", title }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    {title && <title>{title}</title>}
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

export const XCircleIcon: React.FC<{ className?: string; title?: string }> = ({ className = "w-5 h-5 text-red-500", title }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    {title && <title>{title}</title>}
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

export const ClockIcon: React.FC<{ className?: string; title?: string }> = ({ className = "w-5 h-5 text-yellow-500", title }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    {title && <title>{title}</title>}
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

export const AcademicCapIcon: React.FC<{ className?: string; title?: string }> = ({ className = "w-5 h-5 text-blue-500", title }) => (
   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    {title && <title>{title}</title>}
    <path d="M12 14.25L5.25 9.75M12 14.25L18.75 9.75M12 14.25V21M12 3L20.25 7.5M12 3L3.75 7.5M12 3V7.5M21 12C21 16.0355 17.0355 19.5 12 19.5C6.96451 19.5 3 16.0355 3 12C3 7.96451 6.96451 4.5 12 4.5C17.0355 4.5 21 7.96451 21 12Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const DocumentArrowDownIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m.75 12l3 3m0 0l3-3m-3 3v-6m-1.5-9H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
  </svg>
);

export const ArrowUpTrayIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
  </svg>
);

export const EyeIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

export const EyeSlashIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
  </svg>
);


// --- Shared UI Components ---

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', size = 'md', className, ...props }) => {
  const baseStyles = "font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 transition ease-in-out duration-150 disabled:opacity-50 disabled:cursor-not-allowed";
  const sizeStyles = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
  };
  const variantStyles = {
    primary: "bg-uaq-blue text-white hover:bg-uaq-blue/90 focus:ring-uaq-blue",
    secondary: "bg-uaq-gold text-uaq-blue hover:bg-uaq-gold/90 focus:ring-uaq-gold",
    danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
    ghost: "bg-transparent text-gray-700 hover:bg-gray-100 focus:ring-uaq-blue",
  };

  return (
    <button
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: ReactNode;
}

export const Input: React.FC<InputProps> = ({ label, id, error, icon, className, type = "text", ...props }) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";

  return (
    <div className="w-full">
      {label && <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}
      <div className="relative">
        {icon && <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">{icon}</div>}
        <input
          id={id}
          type={isPassword ? (showPassword ? "text" : "password") : type}
          className={`block w-full px-3 py-2 border ${error ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:ring-uaq-blue focus:border-uaq-blue sm:text-sm ${icon ? 'pl-10' : ''} ${className} ${isPassword ? 'pr-10' : ''}`}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
            aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
          >
            {showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
          </button>
        )}
      </div>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
};

export const SearchBar: React.FC<{ onSearch: (term: string) => void; placeholder?: string }> = ({ onSearch, placeholder = "Buscar recursos..." }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  return (
    <form onSubmit={handleSearch} className="relative w-full max-w-md">
      <Input
        type="search"
        placeholder={placeholder}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        icon={<SearchIcon className="w-5 h-5 text-gray-400" />}
        className="pl-10"
      />
    </form>
  );
};

interface NotificationBadgeProps {
  count: number;
}
export const NotificationBadge: React.FC<NotificationBadgeProps> = ({ count }) => {
  if (count === 0) return null;
  return (
    <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full transform translate-x-1/2 -translate-y-1/2">
      {count}
    </span>
  );
};


// --- Course Components ---
interface CourseCardProps {
  course: Course;
  onCourseSelect: (courseId: string) => void;
}

export const CourseCard: React.FC<CourseCardProps> = ({ course, onCourseSelect }) => {
  return (
    <div 
      className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer flex flex-col"
      onClick={() => onCourseSelect(course.id)}
      role="button"
      tabIndex={0}
      onKeyPress={(e) => e.key === 'Enter' && onCourseSelect(course.id)}
      aria-label={`Ir al curso ${course.name}`}
    >
      <img src={course.imageUrl} alt={course.name} className="w-full h-40 object-cover"/>
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-lg font-semibold text-uaq-blue mb-1">{course.name}</h3>
        <p className="text-sm text-custom-gray-600 mb-1">{course.program}</p>
        <p className="text-xs text-custom-gray-500 mb-2">Semestre: {course.semester}</p>
        <div className="mt-auto pt-2">
            <Button variant="primary" size="sm" className="w-full" onClick={(e) => { e.stopPropagation(); onCourseSelect(course.id);}}>
                Ir al curso
            </Button>
        </div>
      </div>
    </div>
  );
};

// --- Activity Components ---
export const ActivityStatusIcon: React.FC<{ status: ActivityStatus }> = ({ status }) => {
  switch (status) {
    case ActivityStatus.PENDING:
      return <ClockIcon className="w-5 h-5 text-yellow-500" title="Pendiente"/>;
    case ActivityStatus.IN_PROGRESS:
      return <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-blue-500">
        <title>En Curso</title>
        <path fillRule="evenodd" d="M15.312 11.424a5.5 5.5 0 01-9.216-5.228L8.25 3.065V2.75a.75.75 0 00-1.5 0V3.5A5.5 5.5 0 015.373 9.42l-1.93 3.344a.75.75 0 001.3.752l1.93-3.344a3.999 3.999 0 007.876.732l1.93 3.343a.75.75 0 101.3-.752l-1.93-3.343zM6.575 12.08a.75.75 0 00-1.3 0l-.676 1.172a.75.75 0 00.65.948h1.352a.75.75 0 00.65-.948l-.676-1.172zm8.85 0a.75.75 0 00-1.3 0l-.676 1.172a.75.75 0 00.65.948h1.352a.75.75 0 00.65-.948l-.676-1.172z" clipRule="evenodd" />
      </svg>;
    case ActivityStatus.COMPLETED:
      return <CheckCircleIcon className="w-5 h-5 text-green-600" title="Terminada"/>;
    case ActivityStatus.GRADED:
      return <AcademicCapIcon className="w-5 h-5 text-uaq-blue" title="Calificada"/>;
    case ActivityStatus.NOT_SUBMITTED:
      return <XCircleIcon className="w-5 h-5 text-red-600" title="No Entregado"/>;
    default:
      return null;
  }
};

interface ActivityCardProps {
  activity: Activity;
  onActivitySelect: (activityId: string) => void;
}

export const ActivityCard: React.FC<ActivityCardProps> = ({ activity, onActivitySelect }) => {
  return (
    <div 
      className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow duration-200 cursor-pointer"
      onClick={() => onActivitySelect(activity.id)}
      role="button"
      tabIndex={0}
      onKeyPress={(e) => e.key === 'Enter' && onActivitySelect(activity.id)}
      aria-label={`Ver detalles de la actividad ${activity.name}`}
    >
      <div className="flex justify-between items-start">
        <h4 className="text-md font-semibold text-uaq-blue mb-1 w-5/6">{activity.name}</h4>
        <ActivityStatusIcon status={activity.submissionStatus || activity.status} />
      </div>
      <p className="text-xs text-custom-gray-500 mb-2">Fecha Límite: {new Date(activity.dueDate).toLocaleDateString()}</p>
      <p className="text-sm text-custom-gray-700 truncate">{activity.description}</p>
    </div>
  );
};

// --- File Upload Component ---
interface FileUploadProps {
  onFileUpload: (file: File | null) => void;
  currentFile: File | null;
}
export const FileUpload: React.FC<FileUploadProps> = ({ onFileUpload, currentFile }) => {
  const [dragActive, setDragActive] = useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      onFileUpload(e.target.files[0]);
    } else {
      onFileUpload(null);
    }
  };

  const onButtonClick = () => {
    inputRef.current?.click();
  };

  return (
    <div className="w-full">
      <form id="form-file-upload" onDragEnter={handleDrag} onSubmit={(e) => e.preventDefault()} className="relative">
        <input ref={inputRef} type="file" id="input-file-upload" className="hidden" onChange={handleChange} />
        <label 
          id="label-file-upload" 
          htmlFor="input-file-upload" 
          className={`h-48 w-full border-2 rounded-lg flex flex-col items-center justify-center cursor-pointer
                      ${dragActive ? "border-uaq-blue bg-blue-50" : "border-dashed border-custom-gray-400 hover:border-uaq-blue"}`}
          aria-describedby="file-upload-constraints"
        >
          <ArrowUpTrayIcon className={`w-10 h-10 mb-2 ${dragActive ? 'text-uaq-blue' : 'text-custom-gray-500'}`} />
          <p className={`text-center ${dragActive ? 'text-uaq-blue' : 'text-custom-gray-600'}`}>
            Arrastra y suelta archivos aquí, o <span className="font-semibold text-uaq-blue" onClick={onButtonClick} role="button">haz clic para seleccionar</span>
          </p>
          <p id="file-upload-constraints" className="text-xs text-custom-gray-500 mt-1">Soporta: PDF, DOCX, PPTX, JPG, PNG (Max. 10MB)</p>
        </label>
        {dragActive && <div className="absolute inset-0 w-full h-full rounded-lg" onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}></div>}
      </form>
      {currentFile && (
        <div className="mt-4 p-3 bg-custom-gray-100 rounded-lg flex justify-between items-center">
          <span className="text-sm text-custom-gray-700">{currentFile.name}</span>
          <button onClick={() => onFileUpload(null)} className="text-red-500 hover:text-red-700" aria-label="Remover archivo seleccionado">
            <XCircleIcon className="w-5 h-5"/>
          </button>
        </div>
      )}
      {!currentFile && (
         <p className="mt-2 text-sm text-yellow-600" role="alert">Ningún archivo seleccionado.</p>
      )}
    </div>
  );
};


// --- Modal Component ---
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, size = 'md' }) => {
  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4 transition-opacity duration-300 ease-in-out" role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div className={`bg-white rounded-lg shadow-xl p-6 w-full ${sizeClasses[size]} transform transition-all duration-300 ease-in-out scale-95 opacity-0 animate-fadeInScaleUp`}>
        <div className="flex justify-between items-center mb-4">
          <h3 id="modal-title" className="text-xl font-semibold text-uaq-blue">{title}</h3>
          <button onClick={onClose} className="text-custom-gray-500 hover:text-custom-gray-700" aria-label="Cerrar modal">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div>{children}</div>
      </div>
      <style>{`
        @keyframes fadeInScaleUp {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fadeInScaleUp { animation: fadeInScaleUp 0.3s forwards; }
      `}</style>
    </div>
  );
};


// --- Grades Chart ---
interface GradesChartProps {
  grades: GradeItem[];
}
export const GradesChart: React.FC<GradesChartProps> = ({ grades }) => {
  const data = grades.map(g => ({
    name: g.activityName.length > 15 ? g.activityName.substring(0,15) + '...' : g.activityName,
    calificacion: g.grade,
    maxima: g.maxGrade
  }));

  return (
    <div className="bg-white p-4 rounded-lg shadow h-80">
      <h4 className="text-lg font-semibold text-uaq-blue mb-4">Progreso de Calificaciones</h4>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 5, right: 20, left: -20, bottom: 40 }} accessibilityLayer>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" angle={-30} textAnchor="end" height={50} interval={0} />
          <YAxis allowDecimals={false} domain={[0, 100]} />
          <Tooltip />
          <Legend />
          <Bar dataKey="calificacion" fill="#003366" name="Calificación Obtenida" />
          {/* <Bar dataKey="maxima" fill="#FFCC00" name="Calificación Máxima" /> */}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

// --- Resource Search Results ---
interface ResourceSearchResultsProps {
  results: {id: string, name: string, type: string, link: string}[];
}
export const ResourceSearchResults: React.FC<ResourceSearchResultsProps> = ({ results }) => {
  if (results.length === 0) {
    return <p className="text-custom-gray-600 mt-4">No se encontraron recursos.</p>;
  }
  return (
    <div className="mt-4 space-y-2">
      {results.map(res => (
        <a key={res.id} href={res.link} target="_blank" rel="noopener noreferrer" className="block p-3 bg-white hover:bg-custom-gray-50 rounded-md shadow">
          <h4 className="font-semibold text-uaq-blue">{res.name}</h4>
          <p className="text-sm text-custom-gray-500">Tipo: {res.type}</p>
        </a>
      ))}
    </div>
  );
};

export const GeneralHeader: React.FC<{
  notifications: Notification[];
  onSearch: (term: string) => void;
  setShowSearchResultsModal: (show: boolean) => void;
  navigate: (path: string) => void;
}> = ({ notifications, onSearch, setShowSearchResultsModal, navigate }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const unreadNotifications = notifications.filter(n => !n.read).length;

  return (
    <header className="bg-white shadow-md p-4 sticky top-0 z-40">
      <div className="container mx-auto flex justify-between items-center">
        <a href="#/" onClick={(e) => { e.preventDefault(); navigate('/');}} className="flex items-center space-x-2 cursor-pointer">
          <UaqLogo />
          <span className="text-xl font-semibold text-uaq-blue hidden md:block">Facultad de Informática</span>
        </a>

        <div className="flex-1 max-w-lg mx-4">
          <SearchBar 
            onSearch={(term) => {
              onSearch(term);
              setShowSearchResultsModal(true);
            }} 
            placeholder="Buscar recursos en la facultad..." 
          />
        </div>

        <nav className="flex items-center space-x-3 md:space-x-4">
          <div className="relative">
            <button onClick={() => setShowNotifications(!showNotifications)} className="text-custom-gray-600 hover:text-uaq-blue relative" title="Notificaciones">
              <BellIcon />
              {unreadNotifications > 0 && <NotificationBadge count={unreadNotifications} />}
            </button>
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg overflow-hidden z-20">
                <div className="py-2 px-3 text-sm font-semibold text-uaq-blue border-b">Notificaciones</div>
                {notifications.length > 0 ? notifications.map(n => (
                  <a key={n.id} href={n.link || '#'} onClick={(e) => {e.preventDefault(); if(n.link) navigate(n.link); setShowNotifications(false);}} className={`block px-4 py-3 text-sm hover:bg-custom-gray-100 ${!n.read ? 'font-medium' : ''}`}>
                    {n.message}
                  </a>
                )) : <p className="px-4 py-3 text-sm text-custom-gray-500">No hay notificaciones nuevas.</p>}
              </div>
            )}
          </div>
          <a href="#/grades" onClick={(e) => { e.preventDefault(); navigate('/grades');}} className="text-custom-gray-600 hover:text-uaq-blue" title="Calificaciones">
            <ChartBarIcon />
          </a>
          <a href="#/calendar" onClick={(e) => { e.preventDefault(); navigate('/calendar');}} className="text-custom-gray-600 hover:text-uaq-blue" title="Calendario">
            <CalendarIcon />
          </a>
          <div className="relative">
            <button onClick={() => setShowSettings(!showSettings)} className="text-custom-gray-600 hover:text-uaq-blue" title="Configuración">
              <CogIcon />
            </button>
            {showSettings && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg py-1 z-20">
                <a href="#/settings" onClick={(e) => {e.preventDefault(); navigate('/settings'); setShowSettings(false);}} className="block px-4 py-2 text-sm text-custom-gray-700 hover:bg-custom-gray-100">Mi Perfil</a>
                {/* <a href="#/settings/preferences" onClick={(e) => {e.preventDefault(); navigate('/settings/preferences'); setShowSettings(false);}} className="block px-4 py-2 text-sm text-custom-gray-700 hover:bg-custom-gray-100">Preferencias</a> */}
                <a href="#/help" onClick={(e) => {e.preventDefault(); navigate('/help'); setShowSettings(false);}} className="flex items-center px-4 py-2 text-sm text-custom-gray-700 hover:bg-custom-gray-100">
                  <QuestionMarkCircleIcon className="w-5 h-5 mr-2" /> Ayuda y Soporte
                </a>
                <div className="border-t my-1 border-custom-gray-200"></div>
                <a href="#/login" onClick={(e) => {e.preventDefault(); navigate('/login'); setShowSettings(false);}} className="block px-4 py-2 text-sm text-red-600 hover:bg-red-50">Cerrar Sesión</a>
              </div>
            )}
          </div>
          <a href="https://www.uaq.mx" target="_blank" rel="noopener noreferrer" className="text-custom-gray-600 hover:text-uaq-blue" title="Página Principal UAQ">
            <HomeIcon />
          </a>
        </nav>
      </div>
    </header>
  );
};

// --- Loading Spinner Component ---
export const LoadingSpinner: React.FC<{ size?: 'sm' | 'md' | 'lg', message?: string, className?: string }> = ({ size = 'md', message, className }) => {
  const sizeClasses = { sm: 'w-6 h-6', md: 'w-8 h-8', lg: 'w-12 h-12' };
  return (
    <div className={`flex flex-col items-center justify-center py-8 ${className}`}>
      <svg className={`animate-spin text-uaq-blue ${sizeClasses[size]}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      {message && <p className="mt-2 text-custom-gray-600" role="status">{message}</p>}
    </div>
  );
};

// --- Breadcrumbs Component ---
export interface BreadcrumbItem {
  label: string;
  path?: string; 
}
interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  navigate: (path: string) => void; 
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items, navigate }) => {
  if (items.length === 0) return null;

  return (
    <nav aria-label="breadcrumb" className="text-sm font-medium text-custom-gray-500 mb-4 px-4 md:px-0"> {/* Add padding for standalone use */}
      <ol className="list-none p-0 inline-flex flex-wrap">
        {items.map((item, index) => (
          <li key={index} className="flex items-center">
            {item.path && index < items.length -1 ? ( // Only make items clickable if they have a path and are not the last item
              <a onClick={(e) => { e.preventDefault(); navigate(item.path!);}} className="hover:text-uaq-blue cursor-pointer">
                {item.label}
              </a>
            ) : (
              <span className={index === items.length - 1 ? "text-custom-gray-700 font-semibold" : ""}>{item.label}</span>
            )}
            {index < items.length - 1 && (
              <svg className="fill-current w-3 h-3 mx-2 text-custom-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" aria-hidden="true">
                <path d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"/>
              </svg>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};
