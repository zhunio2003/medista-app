import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FichaMedica } from '../../ficha-medica/modelo/ficha-medica';

@Injectable({
  providedIn: 'root'
})
export class FichaMedicaService {

  private urlEndPoint: string = 'http://localhost:8080/api/fichas_medicas';
  private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });

  constructor(private http: HttpClient) { }

  getFichasMedicas(): Observable<FichaMedica[]> {
    return this.http.get<FichaMedica[]>(this.urlEndPoint);
  }

  create(fichaMedica: FichaMedica): Observable<FichaMedica> {
    return this.http.post<FichaMedica>(this.urlEndPoint, fichaMedica, { headers: this.httpHeaders });
  }

  getFichas(id: number): Observable<FichaMedica> {
    return this.http.get<FichaMedica>(`${this.urlEndPoint}/${id}`);
  }

  getFichaPaciente(paciente: number): Observable<FichaMedica> {
    return this.http.get<FichaMedica>(`${this.urlEndPoint}/paciente/${paciente}`);
  }

buscarConFiltros(cedula: string | null, apellido: string | null, profesion: string | null): Observable<FichaMedica[]> {
  const params: any = {};
  if (cedula !== null) params['cedula'] = cedula;
  if (apellido !== null) params['apellido'] = apellido;
  if (profesion !== null) params['profesion'] = profesion;

  return this.http.get<FichaMedica[]>(`${this.urlEndPoint}/buscar`, { params });
}




}
