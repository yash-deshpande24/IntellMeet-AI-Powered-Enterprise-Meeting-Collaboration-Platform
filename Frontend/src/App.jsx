import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Context Providers
import { ThemeProvider } from './context/ThemeContext';
import { NotificationProvider } from './context/NotificationContext';
import { AuthProvider } from './context/AuthContext';
import { MeetingProvider } from './context/MeetingContext';

// Common Components
import { ToastContainer } from './components/common/ToastContainer';
import { ProtectedRoute } from './components/common/ProtectedRoute';

// Layouts
import { PublicLayout } from './layouts/PublicLayout';
import { DashboardLayout } from './layouts/DashboardLayout';
import { MeetingLayout } from './layouts/MeetingLayout';

// Public Pages
import { LandingPage } from './pages/public/LandingPage';
import { AboutPage } from './pages/public/AboutPage';
import { ContactPage } from './pages/public/ContactPage';

// Auth Pages
import { LoginPage } from './pages/auth/LoginPage';
import { SignUpPage } from './pages/auth/SignUpPage';
import { ForgotPasswordPage } from './pages/auth/ForgotPasswordPage';
import { ResetPasswordPage } from './pages/auth/ResetPasswordPage';
import { VerifyEmailPage } from './pages/auth/VerifyEmailPage';

// Dashboard & Meetings Pages
import { DashboardOverview } from './pages/dashboard/DashboardOverview';
import { MeetingsListPage } from './pages/meetings/MeetingsListPage';
import { ScheduleMeetingPage } from './pages/meetings/ScheduleMeetingPage';
import { JoinMeetingPage } from './pages/meetings/JoinMeetingPage';
import { PreMeetingLobby } from './pages/meetings/PreMeetingLobby';
import { LiveMeetingRoom } from './pages/meetings/LiveMeetingRoom';
import { MeetingEndedPage } from './pages/meetings/MeetingEndedPage';
import { MeetingHistoryPage } from './pages/meetings/MeetingHistoryPage';

// AI Intelligence Pages
import { MeetingSummaryPage } from './pages/ai/MeetingSummaryPage';
import { TranscriptPage } from './pages/ai/TranscriptPage';
import { ActionItemsPage } from './pages/ai/ActionItemsPage';
import { AiAssistantPage } from './pages/ai/AiAssistantPage';

// Team Collaboration Pages
import { WorkspaceOverview } from './pages/collaboration/WorkspaceOverview';
import { TeamMembersPage } from './pages/collaboration/TeamMembersPage';
import { SharedFilesPage } from './pages/collaboration/SharedFilesPage';
import { CalendarPage } from './pages/collaboration/CalendarPage';

// Settings Pages
import { ProfilePage } from './pages/settings/ProfilePage';
import { PreferencesPage } from './pages/settings/PreferencesPage';
import { SecuritySettingsPage } from './pages/settings/SecuritySettingsPage';
import { WorkspaceSettingsPage } from './pages/settings/WorkspaceSettingsPage';

// Error & Fallback Pages
import { NotFoundPage } from './pages/NotFoundPage';
import { UnauthorizedPage } from './pages/UnauthorizedPage';

function App() {
  return (
    <ThemeProvider>
      <NotificationProvider>
        <AuthProvider>
          <MeetingProvider>
            <BrowserRouter>
              <ToastContainer />
              <Routes>
                {/* Public Marketing & Info Routes */}
                <Route element={<PublicLayout />}>
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/about" element={<AboutPage />} />
                  <Route path="/contact" element={<ContactPage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/signup" element={<SignUpPage />} />
                  <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                  <Route path="/reset-password" element={<ResetPasswordPage />} />
                  <Route path="/verify-email" element={<VerifyEmailPage />} />
                </Route>

                {/* Live Meeting Room & Pre-Call Lobby Routes (Immersive Layout) */}
                <Route element={<MeetingLayout />}>
                  <Route path="/meetings/lobby/:id" element={<PreMeetingLobby />} />
                  <Route path="/meetings/room/:id" element={<LiveMeetingRoom />} />
                  <Route path="/meetings/ended/:id" element={<MeetingEndedPage />} />
                </Route>

                {/* Authenticated Enterprise Dashboard Routes */}
                <Route
                  element={
                    <ProtectedRoute>
                      <DashboardLayout />
                    </ProtectedRoute>
                  }
                >
                  <Route path="/dashboard" element={<DashboardOverview />} />

                  {/* Meetings */}
                  <Route path="/meetings" element={<MeetingsListPage />} />
                  <Route path="/meetings/schedule" element={<ScheduleMeetingPage />} />
                  <Route path="/meetings/join" element={<JoinMeetingPage />} />
                  <Route path="/meetings/history" element={<MeetingHistoryPage />} />

                  {/* AI Meeting Intelligence */}
                  <Route path="/ai/summaries" element={<MeetingSummaryPage />} />
                  <Route path="/ai/transcripts" element={<TranscriptPage />} />
                  <Route path="/ai/action-items" element={<ActionItemsPage />} />
                  <Route path="/ai/assistant" element={<AiAssistantPage />} />

                  {/* Team Collaboration */}
                  <Route path="/workspace" element={<WorkspaceOverview />} />
                  <Route path="/workspace/members" element={<TeamMembersPage />} />
                  <Route path="/workspace/files" element={<SharedFilesPage />} />
                  <Route path="/workspace/calendar" element={<CalendarPage />} />

                  {/* Profile and Settings */}
                  <Route path="/settings/profile" element={<ProfilePage />} />
                  <Route path="/settings/preferences" element={<PreferencesPage />} />
                  <Route path="/settings/security" element={<SecuritySettingsPage />} />
                  <Route path="/settings/workspace" element={<WorkspaceSettingsPage />} />
                </Route>

                {/* Error & Fallback Routes */}
                <Route path="/unauthorized" element={<UnauthorizedPage />} />
                <Route path="/404" element={<NotFoundPage />} />
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </BrowserRouter>
          </MeetingProvider>
        </AuthProvider>
      </NotificationProvider>
    </ThemeProvider>
  );
}

export default App;
