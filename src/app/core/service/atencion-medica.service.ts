import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AtencionMedica } from '../model/atencion-medica';
import { environment } from '../../../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class AtencionMedicaService {
private urlEndPoint: string = `${environment.apiUrl}/atenciones_medicas`;
  private httpHeaders = new HttpHeaders({'Content-Type': 'application/json'});

  constructor(private http: HttpClient) { }

  getAtencionesMedicas(): Observable<AtencionMedica[]> {
    return this.http.get<AtencionMedica[]>(this.urlEndPoint);
  }

  create(atencionMedica: AtencionMedica): Observable<AtencionMedica> {
    return this.http.post<AtencionMedica>(this.urlEndPoint, atencionMedica, { headers: this.httpHeaders });
  }

  getAtencionMedica(id: string): Observable<AtencionMedica> {
    return this.http.get<AtencionMedica>(`${this.urlEndPoint}/${id}`);
  }

  deleteAtencionMedica(id: string): Observable<void> {
    return this.http.delete<void>(`${this.urlEndPoint}/${id}`, { headers: this.httpHeaders });
  }

  update(id: string, atencionMedica: AtencionMedica): Observable<AtencionMedica> {
    return this.http.put<AtencionMedica>(`${this.urlEndPoint}/${id}`, atencionMedica, { headers: this.httpHeaders });
  }

  buscarPorCedula(cedula: string): Observable<AtencionMedica> {
    const url = `${this.urlEndPoint}/cedula/${cedula}`;
    return this.http.get<AtencionMedica>(url);
  }

  // ✅ NUEVO: Subir PDF a un examen específico
  subirPdfExamen(atencionId: string, examenIndex: number, archivo: File): Observable<string> {
    const formData = new FormData();
    formData.append("archivo", archivo);
    
    return this.http.post(
      `${this.urlEndPoint}/${atencionId}/examenes/${examenIndex}/pdf`, 
      formData,
      { responseType: 'text' }
    );
  }

  // ✅ NUEVO: Descargar PDF de un examen específico
  descargarPdfExamen(atencionId: string, examenIndex: number): Observable<Blob> {
    return this.http.get(
      `${this.urlEndPoint}/${atencionId}/examenes/${examenIndex}/pdf`, 
      { responseType: 'blob' }
    );
  }

  // ✅ NUEVO: Eliminar PDF de un examen específico
  eliminarPdfExamen(atencionId: string, examenIndex: number): Observable<string> {
    return this.http.delete(
      `${this.urlEndPoint}/${atencionId}/examenes/${examenIndex}/pdf`,
      { responseType: 'text' }
    );
  }

  // === MÉTODOS DEPRECADOS (mantén por compatibilidad si es necesario) ===
  uploadPdf(id: string, archivo: File): Observable<any> {
    const formData = new FormData();
    formData.append("archivo", archivo);
    return this.http.post(`${this.urlEndPoint}/${id}/examen-pdf`, formData);
  }

  downloadPdf(id: string): Observable<Blob> {
    return this.http.get(`${this.urlEndPoint}/${id}/examen-pdf`, {
      responseType: 'blob'
    });
  }
}