import { Producto } from './../products/clases/producto';
import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EnviarProductoService {
  enviarProducto$ = new EventEmitter();
  mostrarStep3=new EventEmitter();
  constructor() { }
}
