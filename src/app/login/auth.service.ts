// auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Doctor } from '../core/model/doctor';
import { environment } from '../../environment/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl =  `${environment.apiBaseUrl}/doctores`;

  constructor(private http: HttpClient) {}

  login(cedula: string, password: string): Observable<Doctor> {
    return this.http.post<Doctor>(`${this.baseUrl}/login`, { cedula, password });
  }

  saveDoctorSession(doctor: Doctor): void {
    localStorage.setItem('doctorLogueado', JSON.stringify(doctor));
  }

  getDoctorSession(): Doctor | null {
    const doctor = localStorage.getItem('doctorLogueado');
    return doctor ? JSON.parse(doctor) : null;
  }

  logout(): void {
    localStorage.removeItem('doctorLogueado');
  }

  isAuthenticated(): boolean {
    return this.getDoctorSession() !== null;
  }
}
