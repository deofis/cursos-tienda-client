import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';

import { API_BASE_URL } from '../config/config';
import { isParameter } from 'typescript';
import { param } from 'jquery';

@Injectable({
  providedIn: 'root'
})
export class WebConfigurationService {

  url: string = API_BASE_URL + "/api";

  constructor( private http: HttpClient ) { }


  getBanners(){
    return this.http.get(`${this.url}/banners`).pipe(map((resp:any) => {
      return resp;
    }))
  };

  crearNuevoBanner(bannerDto: string, archivo: File){

    let formData = new FormData();
    formData.append("foto", archivo);
    formData.append("bannerDto", bannerDto);

    return this.http.post(`${this.url}/banners`, formData).pipe(map((resp: any) => {
      return resp;
    }))
    

  };

  eliminarBanner(idBanner: number){
    return this.http.delete(`${this.url}/banners/${idBanner}`).pipe(map((resp: any) => {
      return resp;
    }))
  };

  editarImagenBanner(idBanner: any, imagen: File){
    let formData = new FormData();
    formData.append("foto", imagen);
    formData.append("id", idBanner);

    return this.http.put(`${this.url}/banners/${idBanner}/imagen`, formData).pipe(map((resp:any) => {
      return resp;
    }))

  };

  editarBannerUrl(idBanner: number, url: string){
    let parametros = new HttpParams();
    parametros = parametros.append("actionUrl", url);

    return this.http.put(`${this.url}/banners/${idBanner}/actionUrl`, null, {params: parametros});

  }


}
