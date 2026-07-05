import React, { Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Loading from './components/Loading'
import ProtectedRoute from './components/ProtectedRoute'

const MainLayout   = React.lazy(() => import('./layouts/MainLayout'))
const PasienLayout = React.lazy(() => import('./layouts/PasienLayout'))
const AuthLayout   = React.lazy(() => import('./layouts/AuthLayout'))

const Dashboard    = React.lazy(() => import('./pages/Dashboard'))
const Pasien       = React.lazy(() => import('./pages/Pasien'))
const PasienDetail = React.lazy(() => import('./pages/PasienDetail'))
const Jadwal       = React.lazy(() => import('./pages/Jadwal'))
const Pembayaran   = React.lazy(() => import('./pages/Pembayaran'))
const Riwayat      = React.lazy(() => import('./pages/Riwayat'))
const Loyalitas    = React.lazy(() => import('./pages/Loyalitas'))
const Laporan      = React.lazy(() => import('./pages/Laporan'))
const Components   = React.lazy(() => import('./pages/Components'))
const Users        = React.lazy(() => import('./pages/Users'))
const MasterData   = React.lazy(() => import('./pages/MasterData'))
const NotFound     = React.lazy(() => import('./pages/NotFound'))

const PasienDashboard  = React.lazy(() => import('./pages/pasien/Dashboard'))
const PasienBooking    = React.lazy(() => import('./pages/pasien/Booking'))
const PasienRiwayat    = React.lazy(() => import('./pages/pasien/Riwayat'))
const PasienPembayaran = React.lazy(() => import('./pages/pasien/Pembayaran'))
const PasienProfil     = React.lazy(() => import('./pages/pasien/Profil'))

const Login        = React.lazy(() => import('./pages/auth/Login'))
const Register     = React.lazy(() => import('./pages/auth/Register'))
const Forgot       = React.lazy(() => import('./pages/auth/Forgot'))
const LandingPage  = React.lazy(() => import('./pages/LandingPage'))

export default function App() {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        <Route path="/" element={<LandingPage />} />

        <Route path="/admin" element={<ProtectedRoute role="admin"><MainLayout /></ProtectedRoute>}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard"    element={<Dashboard />} />
          <Route path="pasien"       element={<Pasien />} />
          <Route path="pasien/:id"   element={<PasienDetail />} />
          <Route path="jadwal"       element={<Jadwal />} />
          <Route path="pembayaran"   element={<Pembayaran />} />
          <Route path="riwayat"      element={<Riwayat />} />
          <Route path="loyalitas"    element={<Loyalitas />} />
          <Route path="laporan"      element={<Laporan />} />
          <Route path="components"   element={<Components />} />
          <Route path="users"        element={<Users />} />
          <Route path="master-data"  element={<MasterData />} />
        </Route>

        <Route path="/pasien" element={<ProtectedRoute role="user"><PasienLayout /></ProtectedRoute>}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard"   element={<PasienDashboard />} />
          <Route path="booking"     element={<PasienBooking />} />
          <Route path="riwayat"     element={<PasienRiwayat />} />
          <Route path="pembayaran"  element={<PasienPembayaran />} />
          <Route path="profil"      element={<PasienProfil />} />
        </Route>

        <Route element={<AuthLayout />}>
          <Route path="/login"    element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot"   element={<Forgot />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  )
}
