import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AtencionMedica } from '../core/model/atencion-medica';
import { FichaMedicaService } from '../core/service/ficha-medica.service';
import { PacienteService } from '../reportes/paciente.service';
import { ExamenComplementario } from '../core/model/examen-complementario';
import Swal from 'sweetalert2';
import { SignoVital } from '../core/model/signo-vital';
import { SignoVitalService } from '../core/service/signo-vital.service';
import { Enfermedades } from '../core/model/Enfermedades';
import { Diagnostico } from '../core/model/diagnostico';
import { DiagnosticoService } from '../core/service/diagnostico.service';
import { EmergenciaObstetrica } from '../core/model/emergencia-obstetrica';
import { EmergenciaObstetricaService } from '../core/service/emergencia-obstetrica.service';
import { ExamenComplementarioService } from '../core/service/examen-complementario.service';
import { EnfermedadesService } from '../core/service/enfermedades.service';
import { AtencionMedicaService } from '../core/service/atencion-medica.service';
import { DoctorService } from '../core/service/doctor.service';
import { Doctor } from '../core/model/doctor';
import { Paciente } from '../ficha-medica/modelo/paciente';
import { FichaMedica } from '../ficha-medica/modelo/ficha-medica';

@Component({
  selector: 'app-form-atencion-medica',
  templateUrl: './form-atencion-medica.component.html',
  styleUrl: './form-atencion-medica.component.css'
})
export class FormAtencionMedicaComponent implements OnInit {

  signosVitales: SignoVital[] = [];
  enfermedades: Enfermedades[] = [];
  diagnosticos: Diagnostico[] = [];
  examenesComplementarios: ExamenComplementario[] = [];
  doctor: Doctor = new Doctor();

  editMode: boolean = false;
  cedulaBusqueda: string = '';
  atencionMedicaEncontrado: AtencionMedica | null = null;
  pacienteEncontrado: Paciente | null = null;
  fichaMedica: FichaMedica = new FichaMedica();
  emergenciaObstetrica: EmergenciaObstetrica | null = null;
  atencionMedica: AtencionMedica = new AtencionMedica();

  filteredEnfermedades: { [key: number]: Enfermedades[] } = {};
  searchQuery: string = '';

  // Variables para animaciones
  isSearching: boolean = false;
  patientFound: boolean = false;
  showSuccessAnimation: boolean = false;

  constructor(
    private router: Router,
    private atencionMedicaService: AtencionMedicaService,
    private fichaMedicaService: FichaMedicaService,
    private pacienteService: PacienteService,
    private activateRouter: ActivatedRoute,
    private examenComplementarioService: ExamenComplementarioService,
    private emergenciaObstetricaService: EmergenciaObstetricaService,
    private enfermedadesService: EnfermedadesService,
    private diagnosticoService: DiagnosticoService,
    private signoVitalService: SignoVitalService,
    private doctorService: DoctorService
  ) { }

  // metodo regresar ventana anterior
  cancelar() {
    this.router.navigate(['/atencion-medica'])
  }

  ngOnInit(): void {
    this.recuperarEnfermedades();
    const doctorGuardado = localStorage.getItem('doctorLogueado');
    if (doctorGuardado) {
      this.doctor = JSON.parse(doctorGuardado);
    }
  }

  updateTotalGlasgow(): void {
    const o = Number(this.atencionMedica.signosVitales.glasgowOcular) || 0;
    const v = Number(this.atencionMedica.signosVitales.glasgowVerbal) || 0;
    const m = Number(this.atencionMedica.signosVitales.glasgowMotora) || 0;
    this.atencionMedica.signosVitales.glasgowTotal = o + v + m;
  }

  cargarFichaMedica(): void {
    this.activateRouter.params.subscribe(params => {
      let id = params['id']
      if (id) {
        this.fichaMedicaService.getFichas(id).subscribe((fichaMedica) => this.fichaMedica = fichaMedica)
        this.editMode = true;
      }
    })
  }

  buscar(): void {
    if (this.cedulaBusqueda) {
      this.isSearching = true;
      this.patientFound = false;
      this.showSuccessAnimation = false;

      this.pacienteService.buscarPorCedula(this.cedulaBusqueda).subscribe(
        paciente => {
          console.log('Paciente encontrado:', paciente);
          this.pacienteEncontrado = paciente;
          this.isSearching = false;
          this.patientFound = true;
          this.showSuccessAnimation = true;

          // Animate success
          setTimeout(() => {
            this.showSuccessAnimation = false;
          }, 2000);

          this.buscarFicha();
        },
        error => {
          console.error('Error al buscar al paciente:', error);
          this.pacienteEncontrado = null;
          this.isSearching = false;
          this.patientFound = false;
          
          // Show error message with SweetAlert2
          Swal.fire({
            title: '¡Paciente no encontrado!',
            text: 'No se encontró ningún paciente con esa cédula.',
            icon: 'warning',
            confirmButtonText: 'Entendido',
            confirmButtonColor: '#1e40af',
            background: '#ffffff',
            color: '#1e40af'
          });
        }
      );
    } else {
      Swal.fire({
        title: 'Campo requerido',
        text: 'Por favor ingresa una cédula para buscar.',
        icon: 'info',
        confirmButtonText: 'Entendido',
        confirmButtonColor: '#1e40af'
      });
    }
  }

  buscarFicha(): void {
    if (this.pacienteEncontrado) {
      this.fichaMedicaService.getFichaPaciente(this.pacienteEncontrado.id).subscribe(
        fichaMedica => {
          this.fichaMedica = fichaMedica;
          this.atencionMedica.fichaMedica.cedula = this.fichaMedica.paciente.cedula;
          this.atencionMedica.fichaMedica.paciente = `${fichaMedica.paciente.apellido} ${fichaMedica.paciente.nombre}`;
        },
        error => {
          console.error('Error al buscar al paciente:', error);
          this.pacienteEncontrado = null;
        }
      );
    } else {
      console.error('No se puede buscar ficha: paciente no encontrado.');
    }
  }

  buscarEmergenciObstetrica(): void {
    if (this.fichaMedica) {
      this.emergenciaObstetricaService.getfichaEmergencia(this.fichaMedica.idFic).subscribe(
        emergenciaObstetrica => {
          console.log('Ficha encontrado:', emergenciaObstetrica);
          this.emergenciaObstetrica = emergenciaObstetrica;
        },
        error => {
          console.error('Error al buscar al paciente:', error);
          this.pacienteEncontrado = null;
        }
      );
    } else {
      console.error('No se puede buscar ficha: paciente no encontrado.');
    }
  }

  inicializarSignoAtencion() {
    if (this.signosVitales.length > 0) {
      // Logic here
    }
  }

  recuperarSignosVitales(): void {
    this.signoVitalService.getSignosVitales().subscribe(signosVitales => {
      signosVitales = this.signosVitales = signosVitales;
      console.log("Se ha recuperado " + this.signosVitales.length + " signos vitales.")
    });
  }

  recuperarEnfermedades(): void {
    this.enfermedadesService.getEnfermedades().subscribe(enfermedades => {
      enfermedades = this.enfermedades = enfermedades;
      console.log("Se ha recuperado " + this.enfermedades.length + " enfermedades.")
    });
  }


  filterEnfermedades(event: any, index: number): void {
    const query = event.target.value.toLowerCase();
    if (query.length > 0) {
      this.filteredEnfermedades[index] = this.enfermedades.filter(enfermedad =>
        enfermedad.nombreEnf.toLowerCase().includes(query)
      );
    } else {
      this.filteredEnfermedades[index] = [];
    }
  }

  selectEnfermedad(enfermedad: Enfermedades, index: number): void {
    this.atencionMedica.diagnosticos[index].enfermedad.nombre = enfermedad.nombreEnf;
    this.atencionMedica.diagnosticos[index].enfermedad.codigo = enfermedad.codigoEnf;
    this.filteredEnfermedades[index] = [];
  }

  convertToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  }

  // ✅ REEMPLAZA estos métodos en tu componente:

/**
 * Maneja la selección de archivos PDF
 */
onFileChange(event: any, index: number) {
  const file = event.target.files[0];
  if (file) {
    // Validar que sea PDF
    if (file.type !== 'application/pdf') {
      Swal.fire({
        title: 'Archivo inválido',
        text: 'Solo se permiten archivos PDF',
        icon: 'error',
        confirmButtonColor: '#dc2626'
      });
      return;
    }

    // Validar tamaño (máximo 10MB)
    if (file.size > 10 * 1024 * 1024) {
      Swal.fire({
        title: 'Archivo muy grande',
        text: 'El archivo no puede ser mayor a 10MB',
        icon: 'error',
        confirmButtonColor: '#dc2626'
      });
      return;
    }

    // Asignar el archivo al examen
    this.atencionMedica.examenesComplementarios[index].archivoPdfFile = file;
    this.atencionMedica.examenesComplementarios[index].nombreArchivo = file.name;
    this.atencionMedica.examenesComplementarios[index].tipoContenido = file.type;
    this.atencionMedica.examenesComplementarios[index].tamañoArchivo = file.size;

    console.log(`Archivo seleccionado para examen ${index}:`, file.name);
  }
}

/**
 * Método create() mejorado - SIN conversión a base64
 */
async create(): Promise<void> {
  this.atencionMedica.fechaAtencionAte = new Date();

  if (!this.fichaMedica || !this.doctor) {
    Swal.fire({
      title: 'Error',
      text: 'Faltan datos del doctor o ficha médica',
      icon: 'error',
      confirmButtonColor: '#dc2626'
    });
    return;
  }

  // Asignar datos del doctor
  this.atencionMedica.doctor.id = this.doctor.id;
  this.atencionMedica.doctor.cedula = this.doctor.cedula;
  this.atencionMedica.doctor.nombre = this.doctor.nombre + " " + this.doctor.apellido;

  // Asignar datos del paciente
  this.atencionMedica.fichaMedica.cedula = this.fichaMedica.paciente.cedula;
  if (this.fichaMedica.paciente) {
    this.atencionMedica.fichaMedica.paciente = `${this.fichaMedica.paciente.apellido} ${this.fichaMedica.paciente.nombre}`;
  }

  console.log("Paciente asignado:", this.atencionMedica.fichaMedica.paciente);

  try {
    // 1. Crear la atención médica SIN los PDFs
    const atencionCreada = await this.atencionMedicaService.create(this.atencionMedica).toPromise();
    
    if (!atencionCreada || !atencionCreada.id) {
      throw new Error('No se pudo crear la atención médica');
    }

    console.log('Atención médica creada con ID:', atencionCreada.id);

    // 2. Subir los PDFs uno por uno
    const uploadPromises = this.atencionMedica.examenesComplementarios
      .map(async (examen, index) => {
        if (examen.archivoPdfFile) {
          try {
            console.log(`Subiendo PDF para examen ${index}: ${examen.nombre}`);
            const response = await this.atencionMedicaService.subirPdfExamen(
              atencionCreada.id!, 
              index, 
              examen.archivoPdfFile
            ).toPromise();
            console.log(`✅ PDF ${index} subido:`, response);
            return { index, success: true, response };
          } catch (error) {
            console.error(`❌ Error subiendo PDF ${index}:`, error);
            return { index, success: false, error };
          }
        }
        return { index, success: true, response: 'No hay archivo' };
      });

    // Esperar a que se suban todos los PDFs
    const uploadResults = await Promise.all(uploadPromises);
    
    // Verificar resultados
    const errores = uploadResults.filter(result => !result.success);
    if (errores.length > 0) {
      console.warn('Algunos PDFs no se pudieron subir:', errores);
      Swal.fire({
        title: 'Atención guardada con advertencias',
        text: `La atención médica se guardó, pero ${errores.length} archivo(s) PDF no se pudieron subir.`,
        icon: 'warning',
        confirmButtonColor: '#f59e0b'
      });
    } else {
      Swal.fire({
        title: '¡Éxito!',
        text: 'Atención médica y archivos PDF guardados correctamente',
        icon: 'success',
        confirmButtonColor: '#16a34a'
      });
    }

    this.router.navigate(['/atencion-medica']);

  } catch (error) {
    console.error('Error al guardar atención médica:', error);
    Swal.fire({
      title: 'Error al guardar',
      text: 'Revisa los datos ingresados y conexión a internet',
      icon: 'error',
      confirmButtonColor: '#dc2626'
    });
  }
}

/**
 * Método para descargar PDF de un examen específico (para usar en edición)
 */
descargarPdfExamen(atencionId: string, examenIndex: number, nombreExamen: string) {
  this.atencionMedicaService.descargarPdfExamen(atencionId, examenIndex).subscribe(
    (data: Blob) => {
      const blob = new Blob([data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${nombreExamen}_examen.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    },
    error => {
      console.error('Error al descargar PDF:', error);
      Swal.fire({
        title: 'Error',
        text: 'No se pudo descargar el archivo PDF',
        icon: 'error',
        confirmButtonColor: '#dc2626'
      });
    }
  );
}

/**
 * Método para eliminar PDF de un examen específico
 */
eliminarPdfExamen(atencionId: string, examenIndex: number) {
  Swal.fire({
    title: '¿Estás seguro?',
    text: 'Se eliminará el archivo PDF del examen',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#dc2626',
    cancelButtonColor: '#6b7280',
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar'
  }).then((result) => {
    if (result.isConfirmed) {
      this.atencionMedicaService.eliminarPdfExamen(atencionId, examenIndex).subscribe(
        response => {
          console.log('PDF eliminado:', response);
          Swal.fire({
            title: '¡Eliminado!',
            text: 'El archivo PDF ha sido eliminado',
            icon: 'success',
            confirmButtonColor: '#16a34a'
          });
          // Actualizar la vista si es necesario
        },
        error => {
          console.error('Error al eliminar PDF:', error);
          Swal.fire({
            title: 'Error',
            text: 'No se pudo eliminar el archivo PDF',
            icon: 'error',
            confirmButtonColor: '#dc2626'
          });
        }
      );
    }
  });
}
  addDiagnostico(): void {
    const newDiagnostico = new Diagnostico();
    this.atencionMedica.diagnosticos.push(newDiagnostico);
  }

  eliminarDiagnostico(index: number) {
    this.atencionMedica.diagnosticos.splice(index, 1);
  }

  addExamenComplementario(): void {
    this.atencionMedica.examenesComplementarios.push(new ExamenComplementario());
  }

  eliminarExamenComplementario(index: number) {
    this.atencionMedica.examenesComplementarios.splice(index, 1);
  }
}