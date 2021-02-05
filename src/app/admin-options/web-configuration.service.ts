import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';

import { API_BASE_URL } from '../config/config';

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
    

  }


}
