import React, { Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Loading from './components/Loading'

const MainLayout  = React.lazy(() => import('./layouts/MainLayout'))
const AuthLayout  = React.lazy(() => import('./layouts/AuthLayout'))

const Dashboard    = React.lazy(() => import('./pages/Dashboard'))
const Pasien       = React.lazy(() => import('./pages/Pasien'))
const PasienDetail = React.lazy(() => import('./pages/PasienDetail'))
const Jadwal       = React.lazy(() => import('./pages/Jadwal'))
const Pembayaran   = React.lazy(() => import('./pages/Pembayaran'))
const Riwayat      = React.lazy(() => import('./pages/Riwayat'))
const Loyalitas    = React.lazy(() => import('./pages/Loyalitas'))
const Laporan      = React.lazy(() => import('./pages/Laporan'))
const NotFound     = React.lazy(() => import('./pages/NotFound'))

const Login        = React.lazy(() => import('./pages/auth/Login'))
const Register     = React.lazy(() => import('./pages/auth/Register'))
const Forgot       = React.lazy(() => import('./pages/auth/Forgot'))

export default function App() {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />

        <Route element={<MainLayout />}>
          <Route path="/dashboard"    element={<Dashboard />} />
          <Route path="/pasien"       element={<Pasien />} />
          <Route path="/pasien/:id"   element={<PasienDetail />} />
          <Route path="/jadwal"       element={<Jadwal />} />
          <Route path="/pembayaran"   element={<Pembayaran />} />
          <Route path="/riwayat"      element={<Riwayat />} />
          <Route path="/loyalitas"    element={<Loyalitas />} />
          <Route path="/laporan"      element={<Laporan />} />
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
