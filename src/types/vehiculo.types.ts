export interface Vehiculo {
    _id: string;
    cliente: string; // ID del cliente propietario
    marca: string;
    modelo: string;
    patente?: string; // Opcional
    isActive?: boolean;
    createdAt?: string;
    updatedAt?: string;
}

export interface CreateVehiculoRequest {
    cliente: string;
    marca: string;
    modelo: string;
    patente?: string; // Opcional
}

export interface UpdateVehiculoRequest {
    cliente?: string;
    marca?: string;
    modelo?: string;
    patente?: string;
}
