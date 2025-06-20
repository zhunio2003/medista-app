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

  onFileChange(event: any, index: number) {
    const file = event.target.files[0];
    if (file) {
      this.atencionMedica.examenesComplementarios[index].archivoPdfFile = file;
    }
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

    this.atencionMedica.doctor.id = this.doctor.id;
    this.atencionMedica.doctor.cedula = this.doctor.cedula;
    this.atencionMedica.doctor.nombre = this.doctor.nombre + " " + this.doctor.apellido;

    this.atencionMedica.fichaMedica.cedula = this.fichaMedica.paciente.cedula;
    if (this.fichaMedica.paciente) {
      this.atencionMedica.fichaMedica.paciente = `${this.fichaMedica.paciente.apellido} ${this.fichaMedica.paciente.nombre}`;
    }
    console.log("Paciente asignado:", this.atencionMedica.fichaMedica.paciente);

    // Convertir todos los PDFs a base64 antes de enviar
    for (let examen of this.atencionMedica.examenesComplementarios) {
      if (examen.archivoPdfFile) {
        try {
          const base64 = await this.convertToBase64(examen.archivoPdfFile);
          examen.archivoPdf = base64; 
        } catch (error) {
          console.error(`Error al convertir PDF a base64 para el examen ${examen.nombre}`, error);
        }
      }
    }

    // Crear atención médica en MongoDB
    this.atencionMedicaService.create(this.atencionMedica).subscribe(
      () => {
        Swal.fire({
          title: '¡Éxito!',
          text: 'Atención médica guardada correctamente',
          icon: 'success',
          confirmButtonColor: '#16a34a'
        });
        this.router.navigate(['/atencion-medica']);
      },
      error => {
        console.error('Error al guardar atención médica:', error);
        Swal.fire({
          title: 'Error al guardar',
          text: 'Revisa los datos ingresados',
          icon: 'error',
          confirmButtonColor: '#dc2626'
        });
      }
    );
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