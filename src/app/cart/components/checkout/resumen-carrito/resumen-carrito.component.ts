import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Carrito } from 'src/app/cart/clases/carrito';
import { CarritoService } from 'src/app/cart/services/carrito.service';
import { AuthService } from 'src/app/log-in/services/auth.service';
import { EnviarInfoCompraService } from 'src/app/user-options/user-profile/services/enviar-info-compra.service';

import { Router } from '@angular/router';
import { EventEmitter } from '@angular/core';
import { DetalleOperacion } from 'src/app/admin-options/admin-ventas/clases/DetalleOperacion';
import { Sku } from 'src/app/products/clases/sku';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-resumen-carrito',
  templateUrl: './resumen-carrito.component.html',
  styleUrls: ['./resumen-carrito.component.scss']
})
export class ResumenCarritoComponent implements OnInit ,  OnDestroy{
  carrito: Carrito;
  totalProductos: number;
  totalPrice:number ;
  totalQuantity:number;
  costoDeEnvio = 0;
  llegoCarrito:boolean;
  subscripcionSkuComprarYa : Subscription;
  skuComprarYa:Sku;
  itemComprarAhora:DetalleOperacion;

  @Input() actualizarCarrito:boolean;

  ///comprar ahora
  @Input() skuComprarAhora:Sku;
  @Input() cantidadComprarAhora:number;
  subtotalComprarAhora:number;
  constructor(private carritoService: CarritoService,
              private authService: AuthService,
              private enviarInfoCompra:EnviarInfoCompraService,
              private Router:Router, ) {
      this.carrito = new Carrito();
      this.skuComprarYa= new Sku();
      this.itemComprarAhora = new DetalleOperacion();
     }
  ngOnDestroy(): void {
    
  }

  ngOnInit(): void {
    this.getCarrito();
    
    if (this.actualizarCarrito) {
      this.getCarrito();
    }
    this.crearItemComprarAhora();
        
  }
  getCarrito(): void {
    if (this.authService.isLoggedIn()) {
      this.carritoService.getCarrito().subscribe((response: any) => {
        this.carrito = response.carrito;
        console.log(this.carrito)
        this.llegoCarrito=true;
        setTimeout(() => {
          console.log(this.llegoCarrito)
          this.enviarInfoCompra.llegoCarrito$.emit(this.llegoCarrito);
         
        }, 100);

        this.totalProductos = this.carrito.items.length;
      });
    }
  }
  crearItemComprarAhora(){
    // si existe, seteo el item y la cantidad
    console.log(this.skuComprarAhora)
    if (this.skuComprarAhora !==undefined || this.skuComprarAhora !== null) {
      this.itemComprarAhora.sku=this.skuComprarAhora;
      this.itemComprarAhora.cantidad=this.cantidadComprarAhora;
      // y el subtotal en nbase a si tiene promo o no 
      if (this.itemComprarAhora.sku.promocion!==null) {
        if (this.itemComprarAhora.sku.promocion.estaVigente) {
          this.subtotalComprarAhora = this.itemComprarAhora.cantidad * this.itemComprarAhora.sku.promocion.precioOferta
        }else{
          this.subtotalComprarAhora = this.itemComprarAhora.cantidad * this.itemComprarAhora.sku.precio

        }
      }else{
        this.subtotalComprarAhora= this.itemComprarAhora.cantidad * this.itemComprarAhora.sku.precio
      }
    }
  }
}
