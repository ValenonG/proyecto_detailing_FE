export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  nombre: string;
  apellido: string;
  dni: string;
  telefono?: string;
  direccion?: string;
  cuit?: string;
  tipo?: 'Cliente' | 'Empleado' | 'Administrador' | 'Proveedor';
}

export interface LoginResponse {
  idToken: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
}

export interface RegisterResponse {
  firebaseUser: {
    uid: string;
    email: string;
  };
  persona: {
    _id: string;
    nombre: string;
    apellido: string;
    email: string;
    dni: string;
    telefono?: string;
    direccion?: string;
    cuit?: string;
    tipo: string;
    firebaseUid: string;
    isActive: boolean;
  };
}

export interface User {
  _id: string;
  nombre: string;
  apellido: string;
  email: string;
  dni: string;
  telefono?: string;
  direccion?: string;
  cuit?: string;
  tipo: 'Cliente' | 'Empleado' | 'Administrador' | 'Proveedor';
  firebaseUid: string;
  isActive: boolean;
}
