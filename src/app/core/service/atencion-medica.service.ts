import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AtencionMedica } from '../model/atencion-medica';

@Injectable({
  providedIn: 'root'
})
export class AtencionMedicaService {

  private urlEndPoint:string = "http://localhost:8080/api/atenciones_medicas";
  private httpHeaders = new HttpHeaders({'Content-Type': 'application/json'});

  constructor(private http:HttpClient) { }

  getAtencionesMedicas(): Observable<AtencionMedica[]> {
    return this.http.get<AtencionMedica[]>(this.urlEndPoint);
  }

  create(atencionMedica: AtencionMedica): Observable<AtencionMedica> {
    return this.http.post<AtencionMedica>(this.urlEndPoint, atencionMedica, { headers: this.httpHeaders });
  }

  getAtencionMedica(id = 0): Observable<AtencionMedica> {
    return this.http.get<AtencionMedica>(`${this.urlEndPoint}/${id}`);
  }

  deleteAtencionMedica(id: number): Observable<void> {
    return this.http.delete<void>(`${this.urlEndPoint}/${id}`, { headers: this.httpHeaders });
  }

  buscarPorCedula(cedula: string): Observable<AtencionMedica> {
    const url = `${this.urlEndPoint}/cedula/${cedula}`;
    return this.http.get<AtencionMedica>(url);
  }

  // ✅ Método para subir PDF
  uploadPdf(id: string, archivo: File): Observable<any> {
    const formData = new FormData();
    formData.append("archivo", archivo);
    return this.http.post(`${this.urlEndPoint}/${id}/examen-pdf`, formData);
  }

  // ✅ Método para descargar PDF (opcional)
  downloadPdf(id: string): Observable<Blob> {
    return this.http.get(`${this.urlEndPoint}/${id}/examen-pdf`, {
      responseType: 'blob'  // Recibir el PDF como archivo binario
    });
  }
}
