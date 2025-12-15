export interface Vehiculo {
    _id: string;
    cliente: string;
    marca: string;
    modelo: string;
    patente?: string; 
    isActive?: boolean;
    createdAt?: string;
    updatedAt?: string;
}

export interface CreateVehiculoRequest {
    cliente: string;
    marca: string;
    modelo: string;
    patente?: string;
}

export interface UpdateVehiculoRequest {
    cliente?: string;
    marca?: string;
    modelo?: string;
    patente?: string;
}
