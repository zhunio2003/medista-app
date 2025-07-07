import { Component, OnInit } from '@angular/core';
import { Doctor } from '../core/model/doctor';
import { DoctorService } from '../core/service/doctor.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-doctor',
  templateUrl: './doctor.component.html',
  styleUrl: './doctor.component.css'
})
export class DoctorComponent implements OnInit {
  doctores: Doctor[] = [];
  cedulaBusqueda: string = '';
  doctorEncontrado: Doctor | null = null;
  isLoading = false;

  constructor(private doctorService: DoctorService) {}

  ngOnInit(): void {
    //console.log('Componente inicializado');
    this.cargarDoctores();
  }

  // Método para cargar doctores - CORREGIDO
  cargarDoctores(): void {
    this.isLoading = true;
    this.doctorService.getDoctores().subscribe({
      next: (doctores) => {
        //console.log('Doctores recibidos:', doctores);
        //console.log('Cantidad de doctores:', doctores.length);
        this.doctores = doctores;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error al cargar doctores:', error);
        this.isLoading = false;
        Swal.fire({
          title: 'Error',
          text: 'No se pudieron cargar los doctores',
          icon: 'error'
        });
      }
    });
  }

  // BOTON ELIMINAR
  deleteDoctor(id: number): void {
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
        this.doctorService.deleteDoctor(id).subscribe({
          next: (response) => {
            this.doctores = this.doctores.filter(doctor => doctor.id !== id);
            Swal.fire({
              title: 'Deleted!',
              text: 'Your file has been deleted.',
              icon: 'success'
            });
          },
          error: (error) => {
            console.error('Error al eliminar doctor:', error);
            Swal.fire({
              title: 'Error',
              text: 'No se pudo eliminar el doctor',
              icon: 'error'
            });
          }
        });
      }
    });
  }

  // BOTON VER
  verDetalles(doctor: Doctor): void {
    Swal.fire({
      title: `${doctor.nombre} ${doctor.apellido}`,
      html: `
        <p><strong>Cédula:</strong> ${doctor.cedula}</p>
        <p><strong>Teléfono:</strong> ${doctor.telefono}</p>
        <p><strong>Dirección:</strong> ${doctor.direccion}</p>
        <p><strong>Especialidad:</strong> ${doctor.especialidad}</p>
        <p><strong>Código MSP:</strong> ${doctor.codigoMsp}</p>
        <p><strong>Género:</strong> ${doctor.genero}</p>
      `,
    });
  }

  // BOTON BUSCAR 
  buscar(): void {
    if (this.cedulaBusqueda.trim()) {
      this.isLoading = true;
      this.doctorService.buscarPorCedula(this.cedulaBusqueda).subscribe({
        next: (doctor) => {
         // console.log('Doctor encontrado:', doctor);
          this.doctorEncontrado = doctor;
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error al buscar el doctor:', error);
          this.doctorEncontrado = null;
          this.isLoading = false;
          Swal.fire({
            title: 'No encontrado',
            text: 'No se encontró un doctor con esa cédula',
            icon: 'info'
          });
        }
      });
    }
  }

  // BOTÓN ACTUALIZAR TABLA - CORREGIDO
  refrescar(): void {
    this.doctorEncontrado = null;  // Limpia el doctor encontrado PRIMERO
    this.cedulaBusqueda = '';      // Limpia el campo de búsqueda
    this.cargarDoctores();         // Luego carga los doctores
  }

  // Funciones adicionales
  getUniqueSpecialties(): number {
    if (!this.doctores || this.doctores.length === 0) return 0;
    const specialties = [...new Set(this.doctores.map(d => d.especialidad))];
    return specialties.length;
  }

  trackByDoctorId(index: number, doctor: Doctor): any {
    return doctor.id;
  }
}