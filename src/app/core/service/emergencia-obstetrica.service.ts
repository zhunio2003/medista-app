import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EmergenciaObstetrica } from '../model/emergencia-obstetrica';
import { Observable } from 'rxjs';
import { environment } from '../../../environment/environment';


@Injectable({
  providedIn: 'root'
})
export class EmergenciaObstetricaService {

  private urlEndPoint: string = `${environment.apiUrl}/emergencias_obstetricas`;
  private httpHeaders = new HttpHeaders({'Content-Type': 'application/json'})

  constructor(private http:HttpClient) { }
  // metodo obtener pacientes
  getEmergenciasObstetrica(): Observable<EmergenciaObstetrica[]>{
    return this.http.get<EmergenciaObstetrica[]>(this.urlEndPoint);
  }
// metodo crear pacientes
  create(emergenciaObstetrica:EmergenciaObstetrica):Observable<EmergenciaObstetrica>{
    return this.http.post<EmergenciaObstetrica>(this.urlEndPoint, emergenciaObstetrica,{headers:this.httpHeaders})
  }

  getfichaEmergencia(fichaMedica: number): Observable<EmergenciaObstetrica> {
    return this.http.get<EmergenciaObstetrica>(`${this.urlEndPoint}/fichaMedica/${fichaMedica}`);
  }
}
