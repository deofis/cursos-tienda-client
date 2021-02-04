import { Carrito } from './../../clases/carrito';
import { Router } from '@angular/router';
import { MockCartService } from '../../services/mock-cart.service';
import { ItemCarrito } from '../../clases/item-carrito';
import { CarritoService } from '../../services/carrito.service';
import { DetalleCarrito } from '../../clases/detalle-carrito';
import { AuthService } from '../../../log-in/services/auth.service';
import { EnviarInfoCompraService } from 'src/app/user-options/user-profile/services/enviar-info-compra.service';
import { MatSnackBarConfig, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition, MatSnackBarRef,MatSnackBar, MatSnackBarContainer,} from  '@angular/material/snack-bar';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ShoppingCartComponent implements OnInit {

  carrito: Carrito;
  totalProductos: number=0;
  mostrarConfirmacion:boolean=false;
  mostrarResumen:boolean=false;
  mostrarCheckout:boolean=false;
  actualizarCarrito:boolean;
  // item:ItemCarrito


   /// posicion de la notificacion de producto agregado al carrito
  horizontalPosition : MatSnackBarHorizontalPosition = 'end' ;
  verticalPosition: MatSnackBarVerticalPosition = 'top' ;

  constructor(private carritoService: CarritoService,
               private _cartService:MockCartService, 
               private authService: AuthService,
               private snackBar:MatSnackBar,
               private enviarInfoCompra:EnviarInfoCompraService,
               private Router:Router,
               ) {
    this.carrito = new Carrito();
    
   }

  ngOnInit(): void {
    this.getCarrito();
    setTimeout(() => {
      this.getCarrito();
    }, 100);
       
    
 
    // this.items=JSON.parse(localStorage.getItem("Mi Carrito"));
    // console.log(this.items)

    // this._cartService.currentDataCart$.subscribe(x=>{
    //   if(x)
    //   {
    //     this.items = x;
    //     this.totalQuantity = x.length;
    //      this.totalPrice = x.reduce((sum, current) => sum + (current.producto.precio * current.cantidad), 0);
        
    //   }
    // })
    
  }

  getCarrito(): void {
    if (this.authService.isLoggedIn()) {
      this.carritoService.getCarrito().subscribe((response: any) => {
        this.carrito = response.carrito;
        console.log(this.carrito)
        this.totalProductos = this.carrito.items.length;
        this.actualizarCarrito=true;
        for (let x = 0; x < this.carrito.items.length; x++) {
          if (this.carrito.items[x].cantidad > this.carrito.items[x].sku.disponibilidad ) {
            this.carrito.items[x].cantidad=this.carrito.items[x].sku.disponibilidad
          }
        }
       
        /// envio la cantidad de producto al header para q muestre la notifiicacion
        setTimeout(() => {
            this.enviarInfoCompra.enviarCantidadProductosCarrito$.emit(this.totalProductos); 
            this.enviarInfoCompra.enviarActualizarCarrito.emit(this.actualizarCarrito);
          }, 100);
      });
    }  else{
        const getlocal = localStorage.getItem("miCarrito");
        if(getlocal != null ){ /* osea si existe*/
          this.carrito = JSON.parse(getlocal); 
          this.totalProductos=this.carrito.items.length;
        }
        let subtotal =0
        for (let x = 0; x < this.carrito.items.length; x++) {
          if (this.carrito.items[x].sku.promocion !==null && this.carrito.items[x].sku.promocion.estaVigente) {
            subtotal=this.carrito.items[x].cantidad* this.carrito.items[x].sku.promocion.precioOferta;
            this.carrito.items[x].subtotal = subtotal;
          }else{
            subtotal = this.carrito.items[x].cantidad * this.carrito.items[x].sku.precio;
            this.carrito.items[x].subtotal= subtotal;
          }
          
        }
       
        let total = 0;
        this.carrito.items.forEach(item => {
            total = total + item.subtotal;
        });
        this.carrito.total = total;
      
    }
    this.carrito.items = this.carrito.items.map((item: DetalleCarrito) => {
      if (item.cantidad>item.sku.disponibilidad) {
        item.cantidad=item.sku.disponibilidad
      }
      return item
    })
  }
 
  eliminarItem(id?: number): void {
    let skuId = id.toString();
    this.carrito.items = this.carrito.items.filter((item: ItemCarrito) => id !== item.sku.id);
    if (this.authService.isLoggedIn()) {
      this.carritoService.eliminarItem(skuId).subscribe(response => {
       this.getCarrito();
      });
    }else{
      const getlocal = localStorage.getItem("miCarrito");
      this.carrito = JSON.parse(getlocal); 
      this.carritoService.eliminarItemLocal(id,this.carrito);
      this.getCarrito();
      this.totalProductos=this.carrito.items.length;

      if (this.carrito.items.length == undefined) {
        this.totalProductos = 0;
      }
        /// envio la cantidad de producto al header para q muestre la notifiicacion
        setTimeout(() => {
          this.enviarInfoCompra.enviarCantidadProductosCarrito$.emit(this.totalProductos); 
        }, 100);
    }
    this.totalProductos=this.carrito.items.length
    console.log(this.totalProductos)
  
  }

  decrementarCantidad(item: DetalleCarrito): void {
    let skuId = item.sku.id;
   
      this.carrito.items = this.carrito.items.map((item: DetalleCarrito) => {
        if (skuId == item.sku.id) {
            --item.cantidad;
                   
          if (item.cantidad!==item.sku.disponibilidad) {
            document.getElementById("sumar").style.color="#1f4e84"
          }
          
        };
        return item;
      });
      if (item.cantidad == 0) {
        return this.eliminarItem(skuId);
      }
  
      if (this.authService.isLoggedIn()) {
        this.carritoService.actualizarCantidad(item.cantidad.toString(), skuId.toString()).subscribe(response => {
        
          this.getCarrito()
       });
      }else{
        const getlocal = localStorage.getItem("miCarrito");
        this.carrito = JSON.parse(getlocal); 
        this.carritoService.sumarORestarCantidadLocal(item.cantidad,skuId,this.carrito)
        this.getCarrito()
      }
     
        
  }
 

  incrementarCantidad(item: DetalleCarrito): void {
    let skuId = item.sku.id;
    this.carrito.items = this.carrito.items.map((item: DetalleCarrito) => {
      if (skuId == item.sku.id) {
        if (item.cantidad< item.sku.disponibilidad) {
          ++item.cantidad;  
        }
        if (item.cantidad== item.sku.disponibilidad) {
          this.openSnackBar()
        }  
      };
      return item;
    });
    if (this.authService.isLoggedIn()) {
      this.carritoService.actualizarCantidad(item.cantidad.toString(), skuId.toString()).subscribe(response => {
      
        this.getCarrito();
       });
    }else{
      const getlocal = localStorage.getItem("miCarrito");
      this.carrito = JSON.parse(getlocal); 
      this.carritoService.sumarORestarCantidadLocal(item.cantidad,skuId,this.carrito)
      this.getCarrito();
    }

   
   
 
  }

  enviarInfoACheckout(){
    this.mostrarCheckout=true;
    setTimeout(() => {
    console.log(this.mostrarCheckout)
      this.enviarInfoCompra.enviarMostrarCheckout$.emit(this.mostrarCheckout)
    }, 100);
   
  }

  openSnackBar(){
    if ($(window).scrollTop() >= 30) {
      let snackBarRef= this.snackBar.open('Producto agregado al Carrito', null, {
        duration:2000 ,
        horizontalPosition : this .horizontalPosition,
        verticalPosition : this .verticalPosition,
     });
    }else{
      let snackBarRef= this.snackBar.open('Llegaste al límite de unidades disponibles.', null, {
        duration:2000 ,
        horizontalPosition : this .horizontalPosition,
        verticalPosition : this .verticalPosition,
     });
    }
   }

   estaLogueado(){
    if (this.authService.isLoggedIn()) {
      return true
    }else{
      return false 
    }
   }

   /// cuando toco agregar cantidad, restar o eliminar item se me cierran los componentes 2 y 3 para q no se queden con info vieja
   cerrarComponentes(){
    this.mostrarResumen=false;
    this.mostrarConfirmacion=false;
    setTimeout(() => {
      this.enviarInfoCompra.enviarMostrarConfirmacion$.emit(this.mostrarConfirmacion);
      this.enviarInfoCompra.enviarMostrarResumen$.emit(this.mostrarResumen);
    }, 100);
   }

}
