export type UserRole = 'Cliente' | 'Empleado' | 'Administrador' | 'Proveedor';

export interface User {
  _id: string;
  nombre: string;
  apellido: string;
  email: string;
  dni: string;
  telefono?: string;
  direccion?: string;
  cuit?: string;
  tipo: UserRole;
  firebaseUid: string;
  isActive: boolean;
}

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
  tipo?: User['tipo'];
}

export interface LoginResponse {
  idToken: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  persona: User;
}


export interface RegisterResponse {
  firebaseUser: {
    uid: string;
    email: string;
  };
  persona: User;
}