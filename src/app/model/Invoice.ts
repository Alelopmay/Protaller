import { car } from "./car";

export interface Invoice {
    invoice: { licensePlate: string; };
    id?: number; // Opcional
    subtotal: number;
    issueDate: Date;
    vat: number;
    total: number;
    paymentMethod: string;
    warranty: string;
    car?:car | null; // Cambia aquí para permitir null
}