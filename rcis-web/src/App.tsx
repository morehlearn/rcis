import { BrowserRouter, Routes, Route } from 'react-router-dom';
import DashboardPage from '@/pages/DashboardPage';
import ApplicationWizardPage from '@/pages/ApplicationWizardPage';
import RegisterPage from '@/pages/RegisterPage';
import LoginPage from '@/pages/LoginPage';
import ComingSoonPage from '@/pages/ComingSoonPage';
import RequireAuth from '@/components/RequireAuth';

// Every route except register/login/forgot-password requires being logged
// in - RequireAuth redirects to /login (preserving the intended path) if
// there's no stored token. Real pages exist where we've built them, a
// "coming soon" placeholder otherwise, so nothing 404s either way.
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forgot-password" element={<ComingSoonPage title="Forgot password" />} />

        <Route path="/" element={<RequireAuth><DashboardPage /></RequireAuth>} />
        <Route path="/apply" element={<RequireAuth><ApplicationWizardPage /></RequireAuth>} />

        {/* Not built yet - placeholders so every sidebar/card link resolves */}
        <Route path="/licences" element={<RequireAuth><ComingSoonPage title="My licences / certificates" /></RequireAuth>} />
        <Route path="/verify" element={<RequireAuth><ComingSoonPage title="Verify licence(s) / certificate(s)" /></RequireAuth>} />
        <Route path="/change-request" element={<RequireAuth><ComingSoonPage title="Submit change request" /></RequireAuth>} />
        <Route path="/faqs" element={<RequireAuth><ComingSoonPage title="FAQs" /></RequireAuth>} />
        <Route path="/accreditation" element={<RequireAuth><ComingSoonPage title="Accreditation" /></RequireAuth>} />
        <Route path="/training" element={<RequireAuth><ComingSoonPage title="Training" /></RequireAuth>} />
        <Route path="/services" element={<RequireAuth><ComingSoonPage title="Services" /></RequireAuth>} />
        <Route path="/profile" element={<RequireAuth><ComingSoonPage title="My profile" /></RequireAuth>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;