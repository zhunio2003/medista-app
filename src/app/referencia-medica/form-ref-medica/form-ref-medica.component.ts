import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ReferenciaMedica } from '../../core/model/referencia-medica';
import { FichaMedicaService } from '../../core/service/ficha-medica.service';
import { PacienteService } from '../../core/service/paciente.service';
import { Diagnostico } from '../../core/model/diagnostico';
import { Enfermedades } from '../../core/model/Enfermedades';
import { EnfermedadesService } from '../../core/service/enfermedades.service';
import { ReferenciaMedicaService } from '../../core/service/referencia-medica.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-form-ref-medica',
  templateUrl: './form-ref-medica.component.html',
  styleUrls: ['./form-ref-medica.component.css']
})
export class FormRefMedicaComponent implements OnInit {
  referencia: ReferenciaMedica = new ReferenciaMedica();
  enfermedades: Enfermedades[] = [];
  filteredEnfermedades: { [key: number]: Enfermedades[] } = {};

  cedulaBusqueda: string = '';
  pacienteEncontrado: any = null;
  fichaMedica: any = null;
  isSearching: boolean = false;
  patientFound: boolean = false;
  showSuccessAnimation: boolean = false;

  constructor(
    private router: Router,
    private referenciaService: ReferenciaMedicaService,
    private fichaMedicaService: FichaMedicaService,
    private pacienteService: PacienteService,
    private enfermedadesService: EnfermedadesService
  ) {}

  ngOnInit(): void {
    this.recuperarEnfermedades();
    const doctorGuardado = localStorage.getItem('doctorLogueado');
    if (doctorGuardado) {
      const doc = JSON.parse(doctorGuardado);
      this.referencia.doctor.id = doc.id;
      this.referencia.doctor.nombre = `${doc.nombre} ${doc.apellido}`;
      this.referencia.doctor.cedula = doc.cedula;
    }
  }

  recuperarEnfermedades(): void {
    this.enfermedadesService.getEnfermedades().subscribe(enfermedades => {
      this.enfermedades = enfermedades;
    });
  }

  buscar(): void {
    if (this.cedulaBusqueda) {
      this.isSearching = true;
      this.pacienteEncontrado = null;
      this.fichaMedica = null;

      this.pacienteService.buscarPorCedula(this.cedulaBusqueda).subscribe(
        paciente => {
          this.pacienteEncontrado = paciente;
          this.isSearching = false;
          this.patientFound = true;
          this.showSuccessAnimation = true;

          setTimeout(() => {
            this.showSuccessAnimation = false;
          }, 2000);

          this.buscarFicha();
        },
        error => {
          this.isSearching = false;
          this.patientFound = false;
          Swal.fire({
            title: '¡Paciente no encontrado!',
            text: 'No se encontró ningún paciente con esa cédula.',
            icon: 'warning',
            confirmButtonText: 'Entendido',
            confirmButtonColor: '#1e40af'
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
        ficha => {
          this.fichaMedica = ficha;
          this.referencia.fichaMedica.id = ficha.idFic;
          this.referencia.fichaMedica.cedula = ficha.paciente.cedula;
          this.referencia.fichaMedica.paciente = `${ficha.paciente.apellido} ${ficha.paciente.nombre}`;
        },
        error => {
          console.error('Error al obtener ficha médica', error);
        }
      );
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
    this.referencia.diagnosticos[index].enfermedad.nombre = enfermedad.nombreEnf;
    this.referencia.diagnosticos[index].enfermedad.codigo = enfermedad.codigoEnf;
    this.filteredEnfermedades[index] = [];
  }

  addDiagnostico(): void {
    this.referencia.diagnosticos.push(new Diagnostico());
  }

  eliminarDiagnostico(index: number): void {
    this.referencia.diagnosticos.splice(index, 1);
  }

  cancelar(): void {
    this.router.navigate(['/referencia-medica']);
  }

  create(): void {
    if (!this.fichaMedica || !this.pacienteEncontrado) {
      Swal.fire({
        title: 'Error',
        text: 'Faltan datos del paciente o ficha médica',
        icon: 'error',
        confirmButtonColor: '#dc2626'
      });
      return;
    }

    this.referencia.fecha = new Date().toISOString().substring(0, 10);

    this.referenciaService.create(this.referencia).subscribe(
      () => {
        Swal.fire({
          title: '¡Éxito!',
          text: 'Referencia médica guardada correctamente',
          icon: 'success',
          confirmButtonColor: '#16a34a'
        });
        this.router.navigate(['/referencia-medica']);
      },
      error => {
        console.error('Error al guardar referencia médica:', error);
        Swal.fire({
          title: 'Error al guardar',
          text: 'Revisa los datos ingresados',
          icon: 'error',
          confirmButtonColor: '#dc2626'
        });
      }
    );
  }
}
