import { Employee } from "./employee";

export interface Message {
    id: number; // Asegúrate de que esta línea esté presente
    content: string;
    sentAt: Date; // Cambiar a Date si estás usando Date en lugar de Timestamp
    isRead: boolean;
    sender: Employee; // Asegúrate de que `Employee` esté correctamente definido
    recipient: Employee; // Asegúrate de que `Employee` esté correctamente definido
}
