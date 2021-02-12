import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

import { API_BASE_URL } from '../config/config';
@Injectable({
  providedIn: 'root'
})
export class FavoritosService {
  url:string = API_BASE_URL + "/api";
  constructor(private http: HttpClient) { }

  agregarProductoFavorito(id:number){

    return this.http.post(`${this.url}/favoritos/producto/${id}/agregar`,null)
  }

  eliminarProductoFavorito(id:number){
    return this.http.delete(`${this.url}/favoritos/producto/${id}/quitar`);

  }

  getFavoritos(){
    return this.http.get(`${this.url}/perfil/favoritos`).pipe(map((resp:any) => {
      return resp.favoritos.items
  }))


  }

}
