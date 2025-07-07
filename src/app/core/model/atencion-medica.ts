import { Diagnostico } from "./diagnostico";
import { ExamenComplementario } from "./examen-complementario";
import { ExamenFisico } from "./examen-fisico";
import { SignoVital } from "./signo-vital";
import { EmbarazoActual } from "./embarazo-actual"; // ✅ IMPORT

export class AtencionMedica {
  id?: string;  // ID de MongoDB

  motivoAte: string = "";
  enfermedadActualAte: string = "";
  tratamientoAte: string = "";
  fechaAtencionAte: Date = new Date();

  // ✅ USANDO la clase separada
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
  id: number = 0;
  cedula: string = "";
  paciente: string = "";
}