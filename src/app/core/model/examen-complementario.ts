export class ExamenComplementario {
    nombre: string = '';
    resultado: string = '';
    aplica: boolean = true;
    
    // Para el archivo binario (no se serializa)
    archivoPdf?: any; // byte[] en backend
    
    // Campos adicionales para manejo de archivos
    nombreArchivo?: string;
    tipoContenido?: string;
    tamañoArchivo?: number;
    
    // Campo temporal para el archivo seleccionado (solo frontend)
    archivoPdfFile?: File;
}