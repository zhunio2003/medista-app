import { Component, OnInit } from '@angular/core';
import { AtencionMedica } from '../core/model/atencion-medica';
import { AtencionMedicaService } from '../core/service/atencion-medica.service';
import { FichaMedicaService } from '../core/service/ficha-medica.service';
import { PacienteService } from '../reportes/paciente.service';
import Swal from 'sweetalert2';
import { Paciente } from '../ficha-medica/modelo/paciente';

@Component({
  selector: 'app-atencion-medica',
  templateUrl: `./index-atencion-medica.component.html`,
  styleUrl: './atencion-medica.component.css'
})
export class AtencionMedicaComponent implements OnInit {
  atencionesMedicas: AtencionMedica[] = [];

  // ✅ SOLO AGREGUÉ ESTAS VARIABLES PARA BÚSQUEDA
  cedulaBusqueda: string = '';
  fechaBusqueda: string = '';
  // ✅ FIN DE LO AGREGADO

  atencionMedicaEncontrado: AtencionMedica | null = null;
  pacienteEncontrado: Paciente | null = null;
  AtencioMedicaEncontrado: AtencionMedica | null = null;

  constructor(
    private atencionMedicaService: AtencionMedicaService
  ) { }

  ngOnInit(): void {
    this.cargarAtencionesMedicas();
  }

  // metodo carga los datos en la tabla
  cargarAtencionesMedicas(): void {
    this.atencionMedicaService.getAtencionesMedicas().subscribe(atencionesMedicas => {
      this.atencionesMedicas = atencionesMedicas;
    });
  }

  // ✅ SOLO AGREGUÉ ESTE MÉTODO DE BÚSQUEDA
  buscar(): void {
    this.atencionMedicaService.getAtencionesMedicas().subscribe(
      atenciones => {
        let atencionesFiltradas = atenciones;

        if (this.cedulaBusqueda && this.cedulaBusqueda.trim() !== '') {
          atencionesFiltradas = atencionesFiltradas.filter(atencion => 
            atencion.fichaMedica.cedula === this.cedulaBusqueda.trim()
          );
        }

        if (this.fechaBusqueda && this.fechaBusqueda.trim() !== '') {
          atencionesFiltradas = atencionesFiltradas.filter(atencion => {
            const fechaAtencion = new Date(atencion.fechaAtencionAte).toISOString().split('T')[0];
            return fechaAtencion === this.fechaBusqueda;
          });
        }

        this.atencionesMedicas = atencionesFiltradas;
      },
      error => {
        console.error('Error al buscar las atenciones:', error);
      }
    );
  }

  // ✅ SOLO AGREGUÉ ESTE MÉTODO PARA VER TODO
  verTodo(): void {
    this.cargarAtencionesMedicas();
    this.cedulaBusqueda = '';
    this.fechaBusqueda = '';
  }
  // ✅ FIN DE LO AGREGADO

  verDetalles(atencionMedica: AtencionMedica): void {
    Swal.fire({
      title: `Paciente ${atencionMedica.fichaMedica.paciente}`,
      html: `
        <p><strong>Cédula:</strong> ${atencionMedica.fichaMedica.cedula}</p>
        <p><strong>Motivo:</strong> ${atencionMedica.motivoAte}</p>
        <p><strong>Enfermedad Actual:</strong> ${atencionMedica.enfermedadActualAte}</p>
        <p><strong>Tratamiento:</strong> ${atencionMedica.tratamientoAte}</p>
        <p><strong>Fecha de la atención:</strong> ${atencionMedica.fechaAtencionAte}</p>
      `,
    });
  }

  contarExamenesAplicados(): number {
    let total = 0;
    for (let atencion of this.atencionesMedicas) {
      if (Array.isArray(atencion.examenesComplementarios)) {
        total += atencion.examenesComplementarios.filter(e => e.aplica).length;
      }
    }
    return total;
  }

  contarDiagnosticosConfirmados(): number {
    let total = 0;
    for (let atencion of this.atencionesMedicas) {
      if (Array.isArray(atencion.diagnosticos)) {
        total += atencion.diagnosticos.filter(d => d.estado === 'Confirmado').length;
      }
    }
    return total;
  }
}