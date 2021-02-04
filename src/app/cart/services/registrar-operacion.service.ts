import { Observable } from 'rxjs';
import { Operacion } from './../../admin-options/admin-ventas/clases/Operacion';
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { API_BASE_URL } from 'src/app/config/config';

@Injectable({
  providedIn: 'root'
})
export class RegistrarOperacionService {
  url:string;
  constructor(private http:HttpClient) {
    this.url = `${API_BASE_URL}/api`
   }

  registrarNuevaOperacion(operacion:Operacion):Observable<any>{
    return this.http.post(`${this.url}/operaciones/nueva`, operacion);

  };

  completarPago(nroOp:string):Observable<any>{
    let parametros=new HttpParams();
    parametros=parametros.append("nroOperacion",nroOp);
    return this.http.post(`${this.url}/checkout/completar/pago`,null, {params:parametros});

  }
}
