import { Component, OnInit } from '@angular/core';
import { PacienteService } from '../core/service/paciente.service';
import { FichaMedicaService } from '../core/service/ficha-medica.service';
import Swal from 'sweetalert2';
import { FichaMedica } from './modelo/ficha-medica';

@Component({
  selector: 'app-ficha-medica',
  templateUrl: './index-ficha-medica.component.html',
  styleUrls: ['./ficha-medica.component.css']
})
export class FichaMedicaComponent implements OnInit {
  fichaMedica: FichaMedica[] = [];
  cedulaBusqueda: string = '';
  apellidoBusqueda: string = '';
  profesionBusqueda: string = '';
  fichaMedicaEncontrada: FichaMedica[] = [];

  constructor(
    private fichaMedicaService: FichaMedicaService,
    private pacienteService: PacienteService
  ) { }

  ngOnInit(): void {
    this.cargarFichaMedica();
  }

  cargarFichaMedica(): void {
    this.fichaMedicaService.getFichasMedicas().subscribe(fichaMedica => {
      this.fichaMedica = fichaMedica;
    });
  }

  verDetalle(fichaMedica: FichaMedica): void {
    Swal.fire({
      title: `${fichaMedica.paciente.nombre} ${fichaMedica.paciente.apellido}`,
      html: `
        <div style="display: flex; flex-wrap: wrap;">
          <div style="flex: 1; min-width: 200px; padding-right: 10px;">
            <p><strong>Fecha Registro:</strong>${fichaMedica.fechaElaboracion} </p>
            <p><strong>Cédula:</strong> ${fichaMedica.paciente.cedula}</p>
            <p><strong>Rol:</strong> ${fichaMedica.paciente.profesion}</p>
            <p><strong>Fecha Nacimiento:</strong>${fichaMedica.paciente.fechaNacimiento} </p>
            <p><strong>Lugar:</strong>${fichaMedica.paciente.lugar} </p>
            <p><strong>Pais:</strong>${fichaMedica.paciente.pais} </p>
            <p><strong>Dirección:</strong>${fichaMedica.paciente.direccion} </p>
            <p><strong>Barrio:</strong>${fichaMedica.paciente.barrio} </p>
            <p><strong>Parroquia:</strong>${fichaMedica.paciente.parroquia} </p>
            <p><strong>Cantón:</strong>${fichaMedica.paciente.canton} </p>
            <p><strong>Provincia:</strong>${fichaMedica.paciente.provincia} </p>
            <p><strong>Teléfono:</strong>${fichaMedica.paciente.telefono} </p>
            <p><strong>Género:</strong>${fichaMedica.paciente.genero} </p>
            <p><strong>Estado Civil:</strong>${fichaMedica.paciente.estadoCivil} </p>
          </div>
          <div style="flex: 1; min-width: 200px;">
            <p><strong>Tipo Sangre:</strong>${fichaMedica.paciente.tipoSangre} </p>
            <p><strong>Carrera:</strong>${fichaMedica.paciente.carrera} </p>
            <p><strong>Ciclo:</strong>${fichaMedica.paciente.ciclo} </p>
            <p><strong>Discapacidad:</strong>${fichaMedica.discapacidad.discapacidadG} </p>
            <p><strong>Tipo:</strong>${fichaMedica.discapacidad.subtipoDis} </p>
            <p><strong>Porcentaje:</strong>${fichaMedica.discapacidad.porcentajeDis} </p>
            <p><strong>Carnet CONADIS:</strong>${fichaMedica.discapacidad.carnetCon} </p> 
            <p><strong>Numero CONADIS:</strong>${fichaMedica.discapacidad.numeroConadis} </p>   
            <p><strong>Antecedentes:</strong> </p>
            <p><strong>Alérgia:</strong>${fichaMedica.antecedenteFamiliar.alergiaAnt} </p>
            <p><strong>Clínico:</strong>${fichaMedica.antecedenteFamiliar.clinicoAnt} </p>
            <p><strong>Ginecológico:</strong>${fichaMedica.antecedenteFamiliar.ginecologoAnt} </p>
            <p><strong>Traumatológico:</strong>${fichaMedica.antecedenteFamiliar.traumatologicoAnt} </p>
            <p><strong>Quirúrgico:</strong>${fichaMedica.antecedenteFamiliar.quirurgicoAnt} </p>
            <p><strong>Farmacológico:</strong>${fichaMedica.antecedenteFamiliar.farmacologicoAnt} </p>
          </div>
        </div>
      `,
    });
  }

 buscar(): void {
  const cedula = this.cedulaBusqueda?.trim() === '' ? null : this.cedulaBusqueda.trim();
  const apellido = this.apellidoBusqueda?.trim() === '' ? null : this.apellidoBusqueda.trim();
  const profesion = this.profesionBusqueda?.trim() === '' ? null : this.profesionBusqueda.trim();

  this.fichaMedicaService.buscarConFiltros(cedula, apellido, profesion).subscribe(resultados => {
    this.fichaMedicaEncontrada = resultados;
  });
}


  recargarTabla(): void {
  this.fichaMedicaService.getFichasMedicas().subscribe(fichas => {
    this.fichaMedicaEncontrada = [];
    this.fichaMedica = fichas;
    this.cedulaBusqueda = '';
    this.apellidoBusqueda = '';
    this.profesionBusqueda = '';
  });
}



  // Eliminar ficha (sin implementar)
  deleteFicha(): void { }
}
