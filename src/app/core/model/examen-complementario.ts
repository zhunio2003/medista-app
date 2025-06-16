export class ExamenComplementario {
  nombre: string = "";
  resultado: string = "";
  aplica: boolean = false;

  archivoPdf: string | null = null; // este es el que envías al backend
  archivoPdfFile: File | null = null; // solo frontend
}
