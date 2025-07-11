import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { Doctor } from "../core/model/doctor";
import { DoctorService } from "../core/service/doctor.service";
import Swal from "sweetalert2";

@Component({
    selector: 'app-form',
    templateUrl: './formdoc.component.html',
    styleUrl: './formdoc.component.css'
})

export class FormDocComponent implements OnInit{

    editMode: boolean = false; //  propiedad para rastrear el modo de edición
    public doctor:Doctor = new Doctor()

    constructor(private doctorService:DoctorService, private router:Router,
        private activateRouter:ActivatedRoute){}

    // metodo regresar ventana anterior
    cancelar(){
        this.router.navigate(['/doctor'])
    }
    // crear doctor y modifica
    public create():void{
        this.doctorService.create(this.doctor)
        .subscribe(
           doctor=> {this.router.navigate(['/doctor'])
           Swal.fire('Doctor guardado',  `Doctor ${this.doctor.nombre} guardado con exito`,'success')
           this.editMode = false; // Deshabilitar el modo de edición después de guardar los cambios
           }
          )
      }

      // metodo cargar pacientes en el form para editar
      cargarDoctor():void{
        this.activateRouter.params.subscribe(params=>{
            let id=params['id']
            if(id){
                this.doctorService.getDoctor(id).subscribe((doctor)=>this.doctor=doctor)
                this.editMode = true; // Deshabilitar el modo de edición
            }
        })
      }
        
        // llamo al metodo cargarDoctor cuando inicializo el form para editar
    ngOnInit(): void {
        this.cargarDoctor()
    }
}