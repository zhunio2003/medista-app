import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AntecedenteFamiliar } from '../../ficha-medica/modelo/antecedente-familiar';

@Injectable({
  providedIn: 'root'
})
export class AntecedenteFamiliarService {

  private urlEndPoint:string="http://localhost:8080/api/antecedentes_familiares";
  private httpHeaders = new HttpHeaders({'Content-Type': 'application/json'})

  constructor(private http:HttpClient) { }

  getDiscapacidad(): Observable<AntecedenteFamiliar[]>{
    return this.http.get<AntecedenteFamiliar[]>(this.urlEndPoint);
  }
  // metodo crear fichas
  create(antecedenteFamiliar:AntecedenteFamiliar):Observable<AntecedenteFamiliar>{
    return this.http.post<AntecedenteFamiliar>(this.urlEndPoint, antecedenteFamiliar,{headers:this.httpHeaders})
  }
}
