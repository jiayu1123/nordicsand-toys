import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import PageLayout from './components/layout/PageLayout';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import About from './pages/About';
import OEM from './pages/OEM';
import Contact from './pages/Contact';
import Admin from './pages/Admin';
import Stories from './pages/Stories';
import AdminStories from './pages/AdminStories';
import AdminContactSettings from './pages/AdminContactSettings';
import AdminAboutSettings from './pages/AdminAboutSettings';
import AdminLogin from './pages/AdminLogin';
import AdminSecuritySettings from './pages/AdminSecuritySettings';
import AdminGuard from './components/admin/AdminGuard';
import ScrollToTop from './components/shared/ScrollToTop';

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();

  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (authError) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    } else if (authError.type === 'auth_required') {
      navigateToLogin();
      return null;
    }
  }

  return (
    <>
    <ScrollToTop />
    <Routes>
      <Route element={<PageLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/Products" element={<Products />} />
        <Route path="/ProductDetail" element={<ProductDetail />} />
        <Route path="/About" element={<About />} />
        <Route path="/OEM" element={<OEM />} />
        <Route path="/Contact" element={<Contact />} />
        <Route path="/Stories" element={<Stories />} />
        <Route path="/Stories/:slug" element={<Stories />} />
        <Route path="/blog" element={<Stories />} />
        <Route path="/blog/:slug" element={<Stories />} />
      </Route>
      <Route path="/AdminLogin" element={<AdminLogin />} />
      <Route path="/Admin" element={<AdminGuard><Admin /></AdminGuard>} />
      <Route path="/AdminStories" element={<AdminGuard><AdminStories /></AdminGuard>} />
      <Route path="/AdminContactSettings" element={<AdminGuard><AdminContactSettings /></AdminGuard>} />
      <Route path="/AdminAboutSettings" element={<AdminGuard><AdminAboutSettings /></AdminGuard>} />
      <Route path="/AdminSecuritySettings" element={<AdminGuard><AdminSecuritySettings /></AdminGuard>} />
      <Route path="*" element={<PageNotFound />} />
    </Routes>
    </>
  );
};

function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <AuthenticatedApp />
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App