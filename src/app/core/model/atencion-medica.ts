import { Diagnostico } from "./diagnostico";
import { ExamenComplementario } from "./examen-complementario";
import { ExamenFisico } from "./examen-fisico";
import { SignoVital } from "./signo-vital";

export class AtencionMedica {
  id?: string;  // ID de MongoDB

  motivoAte: string = "";
  enfermedadActualAte: string = "";
  tratamientoAte: string = "";
  fechaAtencionAte: Date = new Date();

  embarazada: boolean = false;
  embarazoActual: EmbarazoActual = new EmbarazoActual();

  signosVitales: SignoVital = new SignoVital();
  examenFisico: ExamenFisico = new ExamenFisico();
  examenesComplementarios: ExamenComplementario[] = [];
  diagnosticos: Diagnostico[] = [];

  doctor: DoctorRef = new DoctorRef();
  fichaMedica: FichaMedicaRef = new FichaMedicaRef();
}

export class DoctorRef {
  id: number = 0;
  cedula: string = "";
  nombre: string = "";
}

export class FichaMedicaRef {
  cedula: string = "";
  paciente: string = "";
}

export class EmbarazoActual {
  fum: Date = new Date();
  fpp: Fpp = new Fpp();
  controles: string = "";
  inmunizaciones: string = "";
  observaciones: string = "";
}

export class Fpp {
  fecha: string = "";  // Formato "yyyy-MM-dd"
  dia: number = 0;
  mes: number = 0;
  anio: number = 0;
  sg: number = 0;
}
