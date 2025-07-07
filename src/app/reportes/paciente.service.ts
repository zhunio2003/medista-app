import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Paciente } from '../ficha-medica/modelo/paciente';
import { environment } from '../../environment/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class PacienteService {

  private urlEndPoint:string=`${environment.apiBaseUrl}/pacientes`;
  private httpHeaders = new HttpHeaders({'Content-Type': 'application/json'})

  constructor(private http:HttpClient) { }

  // metodo obtener pacientes
  getPacientes(): Observable<Paciente[]>{
    return this.http.get<Paciente[]>(this.urlEndPoint);
  }

    // metodo buscar por cedula
  buscarPorCedula(cedula: string): Observable<Paciente> {
    const url = `${this.urlEndPoint}/cedula/${cedula}`;
    return this.http.get<Paciente>(url);
  }

  buscarPorProfesion(profesion: string): Observable<Paciente> {
    const url = `${this.urlEndPoint}/profesion/${profesion}`;
    return this.http.get<Paciente>(url);
  }

}