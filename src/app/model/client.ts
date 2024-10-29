// src/app/models/client.model.ts

export interface client {
    id?: number; // El id puede ser opcional al crear un nuevo cliente
    name: string;
    phoneNumber: string;
    email: string;
}
