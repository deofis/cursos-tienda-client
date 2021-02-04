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
  }


}
