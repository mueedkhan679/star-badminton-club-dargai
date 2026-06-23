import { Navigate, Route, Routes } from 'react-router-dom'
import { ProtectedRoute } from './components/ProtectedRoute'
import { DashboardLayout } from './components/layout/DashboardLayout'
import { LoginPage } from './pages/LoginPage'
import { DashboardPage } from './pages/DashboardPage'
import { AddPlayerPage } from './pages/AddPlayerPage'
import { AddPaymentPage } from './pages/AddPaymentPage'
import { RecordsPage } from './pages/RecordsPage'
import { DeletePlayerPage } from './pages/DeletePlayerPage'
import { DownloadReportPage } from './pages/DownloadReportPage'

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/add-player" element={<AddPlayerPage />} />
        <Route path="/add-payment" element={<AddPaymentPage />} />
        <Route path="/records" element={<RecordsPage />} />
        <Route path="/delete-player" element={<DeletePlayerPage />} />
        <Route path="/download-report" element={<DownloadReportPage />} />
      </Route>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}
