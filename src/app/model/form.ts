// src/app/model/form.model.ts

import { car } from "./car";
import { Employee } from "./employee";

export interface form {
    id?: number;                 // Optional since it might not be available when creating a new Form
    description: string;         // Description of the form
    date: string;                // Date in string format (use ISO format for consistency)
    initialDiagnosis: string;    // Initial diagnosis text
    inspectionResults: string;    // Results from the inspection
    workPerformed: string;       // Work that was performed
    employeeId?: Employee;         // Optional, assuming you might need to reference it
    carLicensePlate?: car;    // Optional, since it may not be set initially
}
