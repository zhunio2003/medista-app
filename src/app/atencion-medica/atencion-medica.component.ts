import { Component } from '@angular/core';
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
export class AtencionMedicaComponent {
  atencionesMedicas: AtencionMedica[] = []; // Asegúrate de inicializar como un arreglo vacío

  cedulaBusqueda: string = '';
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
      atencionesMedicas = this.atencionesMedicas = atencionesMedicas;

    });
  }




  /// BOTON ELIMINAR
  //eliminar datos de la base
  /*deleteDoctor(id:number):void{
    Swal.fire({
      title: 'Are you sure?',
      text: 'You won\'t be able to revert this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.doctorService.deleteDoctor(id).subscribe(response => {
          this.doctores=this.doctores.filter(Doctor=>Doctor.idDoctor !==id);
          Swal.fire({
            title: 'Deleted!',
            text: 'Your file has been deleted.',
            icon: 'success'
          });
        });
      }
    });
  }*/
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
