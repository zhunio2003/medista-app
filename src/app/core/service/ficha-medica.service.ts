import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FichaMedica } from '../../ficha-medica/modelo/ficha-medica';
import { HistorialGinecologico } from '../model/historial-ginecologico'; // ✅ AGREGAR
import { environment } from '../../../environment/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class FichaMedicaService {

  private urlEndPoint: string = `${environment.apiBaseUrl}/fichas_medicas`;
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

  // ✅ MÉTODOS NUEVOS para historial ginecológico

  /**
   * Obtiene el historial ginecológico de una ficha médica
   */
  getHistorialGinecologico(fichaId: number): Observable<HistorialGinecologico> {
    return this.http.get<HistorialGinecologico>(`${this.urlEndPoint}/${fichaId}/historial-ginecologico`);
  }

  /**
   * Crea o actualiza el historial ginecológico de una ficha médica
   */
  saveHistorialGinecologico(fichaId: number, historial: HistorialGinecologico): Observable<HistorialGinecologico> {
    return this.http.post<HistorialGinecologico>(
      `${this.urlEndPoint}/${fichaId}/historial-ginecologico`, 
      historial, 
      { headers: this.httpHeaders }
    );
  }

  /**
   * Actualiza el historial ginecológico existente
   */
  updateHistorialGinecologico(fichaId: number, historial: HistorialGinecologico): Observable<HistorialGinecologico> {
    return this.http.put<HistorialGinecologico>(
      `${this.urlEndPoint}/${fichaId}/historial-ginecologico`, 
      historial, 
      { headers: this.httpHeaders }
    );
  }

  /**
   * Elimina el historial ginecológico de una ficha médica
   */
  deleteHistorialGinecologico(fichaId: number): Observable<void> {
    return this.http.delete<void>(`${this.urlEndPoint}/${fichaId}/historial-ginecologico`);
  }
}