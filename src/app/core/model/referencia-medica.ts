import { Diagnostico } from "./diagnostico";

export class ReferenciaMedica {
  id: string = ""; // Mongo usa string como ID por defecto

  servicio: string = "";
  institucion: string = "";

  // Derivación
  entidadSistema: string = "";
  establecimiento: string = "";
  servicioDerivado: string = "";
  especialidad: string = "";
  fecha: string = "";

  // Motivos
  motivoLimitada: boolean = false;
  motivoFaltaProfesional: boolean = false;
  motivoOtros: boolean = false;

  // Detalles clínicos
  resumen: string = "";
  hallazgos: string = "";

  // Diagnósticos
  diagnosticos: Diagnostico[] = [];

  // Referencias
  doctor: DoctorRef = new DoctorRef();
  fichaMedica: FichaMedicaRef = new FichaMedicaRef();
}

export class DoctorRef {
  id: number = 0;
  nombre: string = "";
  cedula: string = "";
}

export class FichaMedicaRef {
  id: number = 0;
  paciente: string = "";
  cedula: string = "";
}
