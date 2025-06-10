
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { DashboardPage, CoursePage, ActivityDetailPage, MessagingPage, GradesPage, CalendarPage, SettingsPage, LoginPage, RegisterPage, ForgotPasswordPage, HelpPage } from './pages';
import { mockNotifications, mockFacultyResources } from './data';
import { GeneralHeader, Modal, ResourceSearchResults } from './components';

const AppContent: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showSearchResultsModal, setShowSearchResultsModal] = useState(false);
  const [searchResults, setSearchResults] = useState<{id: string, name: string, type: string, link: string}[]>([]);


  const handleFacultySearch = (term: string) => {
    if (!term.trim()) {
      setSearchResults([]);
      return;
    }
    const results = mockFacultyResources.filter(res => 
      res.name.toLowerCase().includes(term.toLowerCase()) || 
      res.type.toLowerCase().includes(term.toLowerCase())
    );
    setSearchResults(results);
  };
  
  const noHeaderPaths = ['/login', '/register', '/forgot-password'];
  const showHeader = !noHeaderPaths.includes(location.pathname);

  // Simulate authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(true); 

  useEffect(() => {
    if (!isAuthenticated && !noHeaderPaths.includes(location.pathname)) {
      navigate('/login');
    }
  }, [isAuthenticated, location.pathname, navigate]);


  return (
    <div className="flex flex-col min-h-screen bg-custom-gray-100">
      {showHeader && isAuthenticated && (
         <GeneralHeader 
            notifications={mockNotifications} 
            onSearch={handleFacultySearch} 
            setShowSearchResultsModal={setShowSearchResultsModal}
            navigate={navigate}
          />
      )}
      <main className={`flex-grow ${showHeader && isAuthenticated ? 'pt-0' : ''}`}>
        <Routes>
          {/* Auth Routes */}
          <Route path="/login" element={<LoginPage navigate={navigate} />} />
          <Route path="/register" element={<RegisterPage navigate={navigate} />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage navigate={navigate} />} />

          {/* Protected Routes */}
          <Route path="/" element={isAuthenticated ? <DashboardPage navigate={navigate} /> : <Navigate to="/login" />} />
          <Route path="/course/:courseId/*" element={isAuthenticated ? <CoursePage navigate={navigate} /> : <Navigate to="/login" />} />
          <Route path="/course/:courseId/activity/:activityId" element={isAuthenticated ? <ActivityDetailPage navigate={navigate} /> : <Navigate to="/login" />} />
          <Route path="/messaging" element={isAuthenticated ? <MessagingPage navigate={navigate} /> : <Navigate to="/login" />} />
          <Route path="/grades" element={isAuthenticated ? <GradesPage navigate={navigate} /> : <Navigate to="/login" />} />
          <Route path="/grades/:courseId" element={isAuthenticated ? <GradesPage navigate={navigate} /> : <Navigate to="/login" />} />
          <Route path="/calendar" element={isAuthenticated ? <CalendarPage navigate={navigate} /> : <Navigate to="/login" />} />
          <Route path="/settings/*" element={isAuthenticated ? <SettingsPage navigate={navigate} /> : <Navigate to="/login" />} />
          <Route path="/help" element={isAuthenticated ? <HelpPage navigate={navigate} /> : <Navigate to="/login" />} />
          
          <Route path="*" element={isAuthenticated ? <Navigate to="/" /> : <Navigate to="/login" />} />
        </Routes>
      </main>
      <Modal 
        isOpen={showSearchResultsModal} 
        onClose={() => setShowSearchResultsModal(false)}
        title="Resultados de Búsqueda de Recursos"
        size="lg"
      >
        <ResourceSearchResults results={searchResults} />
      </Modal>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <HashRouter>
      <AppContent />
    </HashRouter>
  );
};

export default App;
