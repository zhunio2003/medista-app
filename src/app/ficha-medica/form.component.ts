import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from '@angular/router';
import Swal from "sweetalert2";
import { DiscapacidadService } from "../core/service/discapacidad.service";
import { PacienteService } from "../core/service/paciente.service";
import { FichaMedicaService } from "../core/service/ficha-medica.service";
import { AntecedenteFamiliarService } from "../core/service/antecedente-familiar.service";
import { EmergenciaObstetrica } from "../core/model/emergencia-obstetrica";
import { EmergenciaObstetricaService } from "../core/service/emergencia-obstetrica.service";
import { FichaMedica } from "./modelo/ficha-medica";

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit {

  fichaMedica: FichaMedica = new FichaMedica();
  editMode: boolean = false;
  showTextarea = false;
  emergenciaObstetrica: EmergenciaObstetrica = new EmergenciaObstetrica();

  constructor(
    private fichaMedicaService: FichaMedicaService,
    private discapacidadService: DiscapacidadService,
    private antecedenteFamiliarService: AntecedenteFamiliarService,
    private pacienteService: PacienteService,
    private emergenciaObstetricaService: EmergenciaObstetricaService,
    private router: Router,
    private activateRouter: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.cargarFicha();
  }

  cancelar(): void {
    this.router.navigate(['/ficha-medica']);
  }
// metodo cargar fichas  en el form para editar
  cargarFicha(): void {
    this.activateRouter.params.subscribe(params => {
      let id = params['id'];
      if (id) {
        this.fichaMedicaService.getFichas(id).subscribe(ficha => {
          this.fichaMedica = ficha;
          this.editMode = true; // Deshabilitar el modo de edición
        });
      }
    });
  }

 

  public create(): void {
    // En caso de ser docente
    if (this.fichaMedica.paciente.profesion === 'Profesor') {
      this.fichaMedica.paciente.carrera = 'NoAplica';
      this.fichaMedica.paciente.ciclo = 'NoAplica';
    }
  
    this.pacienteService.create(this.fichaMedica.paciente).subscribe(paciente => {
      this.discapacidadService.create(this.fichaMedica.discapacidad).subscribe(discapacidad => {
        this.antecedenteFamiliarService.create(this.fichaMedica.antecedenteFamiliar).subscribe(antecedente => {
          this.fichaMedica.paciente = paciente;
          this.fichaMedica.discapacidad = discapacidad;
          this.fichaMedica.antecedenteFamiliar = antecedente;
  
          this.fichaMedicaService.create(this.fichaMedica).subscribe(fichaMedica => {
            this.fichaMedica = fichaMedica;
  
            // Si el paciente es femenino, crear la emergencia obstétrica
            if (this.fichaMedica.paciente.genero === 'femenino') {
              this.emergenciaObstetrica.fichaMedica = fichaMedica;
              this.emergenciaObstetricaService.create(this.emergenciaObstetrica).subscribe(emergencia => {
                Swal.fire('Ficha médica guardada', `Ficha médica del paciente ${this.fichaMedica.paciente.nombre} guardada con éxito`, 'success');
                this.router.navigate(['/ficha-medica']);
              }, error => {
                Swal.fire('Error', 'Hubo un problema al guardar la emergencia obstétrica', 'error');
              });
            } else {
              Swal.fire('Ficha médica guardada', `Ficha médica del paciente ${this.fichaMedica.paciente.nombre  } guardada con éxito`, 'success');
              this.router.navigate(['/ficha-medica']);
            }
          }, error => {
            Swal.fire('Error', 'Hubo un problema al guardar la ficha médica', 'error');
          });
        }, error => {
          Swal.fire('Error', 'Hubo un problema al guardar el antecedente familiar', 'error');
        });
      }, error => {
        Swal.fire('Error', 'Hubo un problema al guardar la discapacidad', 'error');
      });
    }, error => {
      Swal.fire('Error', 'Hubo un problema al guardar el paciente', 'error');
    });
  }
  
  

  toggleTextarea(state: boolean) {
    this.showTextarea = state;
  }

 
}
