import { EventEmitter, Injectable } from '@angular/core';
import { Producto } from 'src/app/products/clases/producto';
import { Sku } from 'src/app/products/clases/sku';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  productoSelec$ = new EventEmitter<Producto>();

  productoNo$ = new EventEmitter<Producto>();

  promocionado$ = new EventEmitter();

  cerrarModal$ = new EventEmitter();

  productoSkuSelec = new EventEmitter<Sku>();

  modalInicioSesion$ = new EventEmitter();

  constructor() { }
}
