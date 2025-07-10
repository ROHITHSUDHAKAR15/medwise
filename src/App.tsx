import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Chat from './pages/Chat';
import Symptoms from './pages/Symptoms';
import Emergency from './pages/Emergency';
import Health from './pages/Health';
import MentalHealth from './pages/MentalHealth';
import Medications from './pages/Medications';
import PrescriptionScanner from './pages/PrescriptionScanner';
import Profile from './pages/Profile';
import Login from './pages/Login';
import IntroPage from './pages/IntroPage';
import ErrorBoundary from './components/ErrorBoundary';
import LoadingSpinner from './components/LoadingSpinner';
import OfflineIndicator from './components/OfflineIndicator';
import SkipLink from './components/SkipLink';
import { ToastContainer } from './components/Toast';
import { useStore } from './store';
import { useToast } from './hooks/useToast';

// Lazy load components for better performance
const LazyDashboard = React.lazy(() => import('./pages/Dashboard'));
const LazyChat = React.lazy(() => import('./pages/Chat'));
const LazySymptoms = React.lazy(() => import('./pages/Symptoms'));
const LazyEmergency = React.lazy(() => import('./pages/Emergency'));
const LazyHealth = React.lazy(() => import('./pages/Health'));
const LazyMentalHealth = React.lazy(() => import('./pages/MentalHealth'));
const LazyMedications = React.lazy(() => import('./pages/Medications'));
const LazyPrescriptionScanner = React.lazy(() => import('./pages/PrescriptionScanner'));
const LazyProfile = React.lazy(() => import('./pages/Profile'));

function App() {
  const user = useStore((state) => state.user);
  const isDarkMode = useStore((state) => state.isDarkMode);
  const { toasts, removeToast } = useToast();
  const [isLoading, setIsLoading] = React.useState(true);
  const [showLogin, setShowLogin] = React.useState(false);
  const [showSignup, setShowSignup] = React.useState(false);

  React.useEffect(() => {
    // Simulate app initialization
    const initializeApp = async () => {
      try {
        // Always start with dark mode
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');

        // Apply theme changes when toggled
        if (!isDarkMode) {
          document.documentElement.classList.remove('dark');
          localStorage.setItem('theme', 'light');
        }

        // Simulate loading time
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error) {
        console.error('App initialization error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeApp();
  }, [isDarkMode]);

  // Show loading screen during initialization
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
        <LoadingSpinner size="lg" text="Initializing MedWise..." />
      </div>
    );
  }

  // Show intro page if no user and not showing login/signup
  if (!user && !showLogin && !showSignup) {
    return (
      <HelmetProvider>
        <ErrorBoundary>
          <SkipLink />
          <IntroPage 
            onLogin={() => setShowLogin(true)}
            onSignup={() => setShowSignup(true)}
          />
          <OfflineIndicator />
          <ToastContainer toasts={toasts} onClose={removeToast} />
        </ErrorBoundary>
      </HelmetProvider>
    );
  }

  // Show login/signup page
  if (!user && (showLogin || showSignup)) {
    return (
      <HelmetProvider>
        <ErrorBoundary>
          <SkipLink />
          <Login 
            defaultMode={showSignup ? 'signup' : 'login'}
            onBack={() => {
              setShowLogin(false);
              setShowSignup(false);
            }}
          />
          <OfflineIndicator />
          <ToastContainer toasts={toasts} onClose={removeToast} />
        </ErrorBoundary>
      </HelmetProvider>
    );
  }

  return (
    <HelmetProvider>
      <ErrorBoundary>
        <BrowserRouter>
          <SkipLink />
          <div className="min-h-screen bg-slate-50 dark:bg-slate-900 dark-mode-transition bg-pattern">
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route 
                  index 
                  element={
                    <React.Suspense fallback={<LoadingSpinner />}>
                      <LazyDashboard />
                    </React.Suspense>
                  } 
                />
                <Route 
                  path="chat" 
                  element={
                    <React.Suspense fallback={<LoadingSpinner />}>
                      <LazyChat />
                    </React.Suspense>
                  } 
                />
                <Route 
                  path="symptoms" 
                  element={
                    <React.Suspense fallback={<LoadingSpinner />}>
                      <LazySymptoms />
                    </React.Suspense>
                  } 
                />
                <Route 
                  path="emergency" 
                  element={
                    <React.Suspense fallback={<LoadingSpinner />}>
                      <LazyEmergency />
                    </React.Suspense>
                  } 
                />
                <Route 
                  path="health" 
                  element={
                    <React.Suspense fallback={<LoadingSpinner />}>
                      <LazyHealth />
                    </React.Suspense>
                  } 
                />
                <Route 
                  path="mental-health" 
                  element={
                    <React.Suspense fallback={<LoadingSpinner />}>
                      <LazyMentalHealth />
                    </React.Suspense>
                  } 
                />
                <Route 
                  path="medications" 
                  element={
                    <React.Suspense fallback={<LoadingSpinner />}>
                      <LazyMedications />
                    </React.Suspense>
                  } 
                />
                <Route 
                  path="prescription-scanner" 
                  element={
                    <React.Suspense fallback={<LoadingSpinner />}>
                      <LazyPrescriptionScanner />
                    </React.Suspense>
                  } 
                />
                <Route 
                  path="profile" 
                  element={
                    <React.Suspense fallback={<LoadingSpinner />}>
                      <LazyProfile />
                    </React.Suspense>
                  } 
                />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Route>
            </Routes>
          </div>
          <OfflineIndicator />
          <ToastContainer toasts={toasts} onClose={removeToast} />
        </BrowserRouter>
      </ErrorBoundary>
    </HelmetProvider>
  );
}

export default App;