import { Component, OnInit } from '@angular/core';
import { ReferenciaMedicaService } from '../core/service/referencia-medica.service';
import { ReferenciaMedica } from '../core/model/referencia-medica';
import Swal from 'sweetalert2';
import { AtencionMedica } from '../core/model/atencion-medica';
import { AtencionMedicaService } from '../core/service/atencion-medica.service';

@Component({
  selector: 'app-referencia-medica',
  templateUrl: './index-referencia-medica.component.html',
  styleUrls: ['./referencia-medica.component.css']
})
export class ReferenciaMedicaComponent implements OnInit {

  referencias: ReferenciaMedica[] = [];
  atencionesMedicas: AtencionMedica[] = [];
  referencia: ReferenciaMedica = new ReferenciaMedica();


  constructor(private referenciaService: ReferenciaMedicaService,
    private atencionMedicaService: AtencionMedicaService
  ) { }

  ngOnInit(): void {
    this.cargarReferencias();
    this.atencionMedicaService.getAtencionesMedicas().subscribe(
      (data: AtencionMedica[]) => {
        this.atencionesMedicas = data;
      },
      error => {
        console.error('Error al obtener atenciones médicas:', error);
      }
    );

  }

  cargarReferencias(): void {
    this.referenciaService.getReferencias().subscribe(
      referencias => {
        this.referencias = referencias;
      },
      error => {
        console.error('Error al cargar referencias:', error);
        console.log('Detalles del error:', error);

      }
    );
  }

  //Eliminar referencias
  deleteReferencia(id: number): void {
    Swal.fire({
      title: 'Estas seguro?',
      text: '¡No podrás revertir esto!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, elimínalo!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.referenciaService.deleteReferencia(id).subscribe(response => {
          // this.referencias = this.referencias.filter(ReferenciaMedica => ReferenciaMedica.id !== id);
          Swal.fire({
            title: 'Eliminado!',
            text: 'Su registro ha sido eliminado.',
            icon: 'success'
          });
        });
      }
    });
  }


  verDetalles(referencia: ReferenciaMedica): void {
    const diagnosticosHtml = referencia.diagnosticos.map(diagnostico => `
      <li>
      <td>ID: ${diagnostico.descripcion}</td>
      <td>Diagnostico: ${diagnostico.descripcion || 'No especificado'}</td>
      <td>Codigo: ${diagnostico.enfermedad.codigo || 'No especificado'}</td>
      <td>Tipo: ${diagnostico.estado ? 'Presuntivo' : 'Definitivo'}</td>
    </li>
  `).join('');

    Swal.fire({
      title: `${referencia.entidadSistema}`,
      html: `
        <p><strong>Fecha:</strong> ${referencia.fecha}</p>
        <p><strong>Paciente:</strong> ${referencia.fichaMedica.paciente}</p>
        <p><strong>Entidad:</strong> ${referencia.entidadSistema}</p>
        <p><strong>Especialidad:</strong> ${referencia.especialidad}</p>
        <p><strong>Establecimiento:</strong> ${referencia.establecimiento}</p>
        <p><strong>Hallazgos MSP:</strong> ${referencia.hallazgos}</p>
        <p><strong>Institución:</strong> ${referencia.institucion}</p>
        ${referencia.motivoLimitada ? `<p><strong>Motivo: Limitada capacidad resolutiva</strong></p>` : ''}
      ${referencia.motivoFaltaProfesional? `<p><strong>Motivo: Falta de profesional</strong></p>` : ''}
      ${referencia.motivoOtros? `<p><strong>Motivo: Otros</strong></p>` : ''}
        <p><strong>Resumen:</strong> ${referencia.resumen}</p>
        <p><strong>Servicio:</strong> ${referencia.servicio}</p>
        <p><strong>Diagnósticos:</strong></p>
        <ul>${diagnosticosHtml}</ul>
      `,
    });
  }

/*getEntidadFrecuente(): string {
  const conteo: { [entidad: string]: number } = {};

  for (let ref of this.referencias) {
    const entidad = ref.entidad_sistema_ref;
    if (entidad) {
      conteo[entidad] = (conteo[entidad] || 0) + 1;
    }
  }

  let maxEntidad = '';
  let max = 0;
  for (let key in conteo) {
    if (conteo[key] > max) {
      max = conteo[key];
      maxEntidad = key;
    }
  }

  return maxEntidad || '-';
}
*/


}
