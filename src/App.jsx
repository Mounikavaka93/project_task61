import { Component } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AppShell } from './components/layout/AppShell';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SocialProvider, ToastProvider } from './context/SocialContext';
import { ExplorePage } from './pages/ExplorePage';
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { MessagesPage } from './pages/MessagesPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { NotificationsPage } from './pages/NotificationsPage';
import { PostPage } from './pages/PostPage';
import { ProfilePage } from './pages/ProfilePage';
import { SignupPage } from './pages/SignupPage';

function RequireAuth({ children }) {
  const { currentUser } = useAuth();
  if (!currentUser) return <Navigate to="/login" replace />;
  return children;
}

function GuestOnly({ children }) {
  const { currentUser } = useAuth();
  if (currentUser) return <Navigate to="/" replace />;
  return children;
}

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  render() {
    if (this.state.error) {
      return (
        <div className="grid min-h-screen place-items-center bg-canvas px-6 text-center">
          <div>
            <h1 className="font-display text-4xl text-ink">Something went wrong</h1>
            <p className="mt-2 text-sm text-ink-soft">Reload Mounika and try that step again.</p>
            <button type="button" className="mt-5 font-bold text-brand-700" onClick={() => window.location.reload()}>
              Reload
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <ToastProvider>
          <AuthProvider>
            <SocialProvider>
              <Routes>
                <Route path="/login" element={<GuestOnly><LoginPage /></GuestOnly>} />
                <Route path="/signup" element={<GuestOnly><SignupPage /></GuestOnly>} />
                <Route
                  element={
                    <RequireAuth>
                      <AppShell />
                    </RequireAuth>
                  }
                >
                  <Route index element={<HomePage />} />
                  <Route path="explore" element={<ExplorePage />} />
                  <Route path="notifications" element={<NotificationsPage />} />
                  <Route path="messages" element={<MessagesPage />} />
                  <Route path="messages/:conversationId" element={<MessagesPage />} />
                  <Route path="profile" element={<ProfilePage />} />
                  <Route path="profile/:username" element={<ProfilePage />} />
                  <Route path="post/:postId" element={<PostPage />} />
                  <Route path="*" element={<NotFoundPage />} />
                </Route>
              </Routes>
            </SocialProvider>
          </AuthProvider>
        </ToastProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}
