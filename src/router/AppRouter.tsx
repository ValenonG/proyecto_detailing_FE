import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Home, Login, Register, Dashboard, Clientes, Vehiculos, TrabajosPage, ProductosPage, Servicios, Proveedores } from '../pages';
import { ProtectedRoute } from '../components';

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rutas Públicas */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Rutas Privadas */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/clientes"
          element={
            <ProtectedRoute allowedRoles={['Empleado', 'Administrador']}>
              <Clientes />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/proveedores"
          element={
            <ProtectedRoute allowedRoles={['Empleado', 'Administrador']}>
              <Proveedores />
            </ProtectedRoute>
          }/>
        <Route
          path="/dashboard/vehiculos"
          element={
            <ProtectedRoute allowedRoles={['Empleado', 'Administrador']}>
              <Vehiculos />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/trabajos"
          element={
            <ProtectedRoute allowedRoles={['Empleado', 'Administrador']}>
              <TrabajosPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/productos"
          element={
            <ProtectedRoute allowedRoles={['Empleado', 'Administrador']}>
              <ProductosPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/servicios"
          element={
            <ProtectedRoute allowedRoles={['Empleado', 'Administrador']}>
              <Servicios />
            </ProtectedRoute>
          }
        />

        {/* Ruta por defecto */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;
