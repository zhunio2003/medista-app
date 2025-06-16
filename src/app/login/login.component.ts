import { Component } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { DoctorService } from '../core/service/doctor.service';
import { Doctor } from '../core/model/doctor';  // Asegúrate que tienes este modelo

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  cedula: string = '';
  password: string = '';

  constructor(private doctorService: DoctorService, private router: Router) {}

  login(): void {
    if (!this.cedula || !this.password) {
      Swal.fire('Campos requeridos', 'Ingrese cédula y contraseña', 'warning');
      return;
    }

    this.doctorService.login(this.cedula, this.password).subscribe({
      next: (doctor) => {
        if (doctor) {
          // ✅ Guardar doctor logueado en el localStorage
          localStorage.setItem('doctorLogueado', JSON.stringify(doctor));

          Swal.fire('Bienvenido', `Hola Dr. ${doctor.nombre}`, 'success');
          this.router.navigate(['/home']);
        }
      },
      error: err => {
        Swal.fire('Error', 'Cédula o contraseña incorrecta', 'error');
      }
    });
  }
}
