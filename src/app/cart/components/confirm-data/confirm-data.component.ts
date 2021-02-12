import { CheckoutService } from '../../services/checkout.service';
import { MedioPago } from './../../../admin-options/admin-ventas/clases/MedioPago';
import { Direccion } from './../../../log-in/clases/cliente/direccion';
import { DetalleOperacion } from './../../../admin-options/admin-ventas/clases/DetalleOperacion';
import { Cliente } from './../../../log-in/clases/cliente/cliente';
import { PerfilClienteService } from './../../../user-options/user-profile/services/perfil-cliente.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Carrito } from '../../clases/carrito';
import { CarritoService } from '../../services/carrito.service';
import { AuthService } from 'src/app/log-in/services/auth.service';
import { EnviarInfoCompraService } from 'src/app/user-options/user-profile/services/enviar-info-compra.service';
import { Input } from '@angular/core';
import { Operacion } from 'src/app/admin-options/admin-ventas/clases/Operacion';
import { DetalleCarrito } from '../../clases/detalle-carrito';
import Swal from "sweetalert2";
import { Router } from '@angular/router';
import { OperacionRequest } from 'src/app/admin-options/admin-ventas/clases/operacionRequest';
import { Sku } from 'src/app/products/clases/sku';

@Component({
  selector: 'app-confirm-data',
  templateUrl: './confirm-data.component.html',
  styleUrls: ['./confirm-data.component.scss']
})
export class ConfirmDataComponent implements OnInit, OnDestroy {
  @Input() clienteDireccion:any;
  @Input() entrega:string;
  @Input() pago:MedioPago;
  infoCliente:any;
  carrito: Carrito;
  costoDeEnvio:number=0;
 
  /// para cerrar el componente cuando voy a editar

  mostrarConfirmacion:boolean
  
  // lo que envio al back
  operacion:Operacion;
  items:DetalleOperacion[];
  item:DetalleOperacion ;

  /// comprar ya
  operacionComprarYa:OperacionRequest;
  @Input() skuComprarAhora:Sku;
  @Input() cantidad:number;
  subtotal:number
  constructor(private perfilClienteService:PerfilClienteService,
              private authService: AuthService,
              private enviarInfoCompra:EnviarInfoCompraService,
              private carritoService: CarritoService,
              private router: Router,
              private checkoutService:CheckoutService) {
                this.item = new DetalleOperacion();
                this.items = new Array<DetalleOperacion>();
                this.operacion = new Operacion();
                this.operacionComprarYa = new OperacionRequest();
               }

  ngOnInit(): void {
      this.getPerfilCliente(); 
      this.getCarrito(); 
      setTimeout(() => {
        console.log(this.clienteDireccion)
      }, 1000); 
      this.subtotalComprarAhora();
      // this.carritoService.refreshNeeded$
      // .subscribe(()=>{
      //   this.getCarrito();
      // })
     }
     
     
  ngOnDestroy():void{
  }
  
  /// traigo la info del cliente loggeado (nombre,mail,telefono,direccion...)
getPerfilCliente():void{
  if (this.authService.isLoggedIn()) {
  this.perfilClienteService.getInfoPerfilCliente().subscribe(response => {
  this.infoCliente=response;
  });
  }
}

getCarrito(): void {
  if (this.authService.isLoggedIn()) {
    this.carritoService.getCarrito().subscribe((response: any) => {
      this.carrito = response.carrito;
    });
  }
}



cerrarComponente(){
  this.mostrarConfirmacion=false;
  setTimeout(() => {
    this.enviarInfoCompra.enviarMostrarConfirmacion$.emit(this.mostrarConfirmacion);
  }, 100);
}

irAPagar(){
  /*** lleno el objeto operacion con  */

  /// infoCliente
  this.operacion.cliente=this.infoCliente;
  /// direccion de envio
  let direccion =new Direccion();
  direccion.calle=this.clienteDireccion?.calle;
  direccion.ciudad=this.clienteDireccion?.ciudad;
  direccion.codigoPostal=this.clienteDireccion?.codigoPostal;
  direccion.numeroCalle=this.clienteDireccion?.numeroCalle;
  direccion.piso=this.clienteDireccion?.piso;

  this.operacion.direccionEnvio=direccion
  // total es calculado por el servidor
  // this.operacion.total=this.carrito.total;
  // items
  for (let i = 0; i < this.carrito?.items.length; i++) {
    
    this.item.sku=this.carrito.items[i].sku;
    this.item.cantidad=this.carrito.items[i].cantidad;
    // El error era: El ITEM (DetalleOperacion) de la Operacion, es distinto al DetalleCarrito.
    // DetalleCarrito se CREA al registrar operación, por ende, no se debe asignar ningun ID, 
    // ya que se genera automáticamente por el servidor.
    // **** this.item.id=this.carrito.items[i].id;  ****

    
    
    // Pasa lo mismo con el subtotal del item, y el total de la operación:
    // Es calculado y guardado por el SERVIDOR.
    // this.item.subtotal=this.carrito.items[i].subtotal
  
   this.items.push(this.item);
   this.item= new DetalleOperacion();
   }

   this.operacion.items=this.items as DetalleOperacion[]
   // En resumen, para completar la OPERACION, la app cliente solo debe generar los datos a enviar:
   // cliente asociado, direccion de envio, medio de pago y los items (detalle operacion), con solamente
   // el sku y la cantidad por sku.
  /// medio de pago 
   this.operacion.medioPago=this.pago


    console.log(this.operacion)

 /// registro la operacion
  this.checkoutService.registrarNuevaOperacion(this.operacion).subscribe( response => {
    const infoPago= response.pago;
    console.log(infoPago);
    /// evaluo si el metodo de pago es paypal, abro el fm paypal
    if(this.operacion.medioPago.id !==1){
      window.open(infoPago.approveUrl, "_self");
    } else { /// si no lo es, abro el de efvo
      const url = this.router.serializeUrl( this.router.createUrlTree([`cash/approved`]));
      window.open(url, "_self");
    }
   }, err => {
     alert(err.error.error);
    console.log(err);
    });
    //// deshabilito los botones para q no puedan volver a realizar la misma compra o editarla
    let btnConfirm= document.getElementById("btn-confirm") as HTMLButtonElement;
    btnConfirm.disabled=true;
    let btnEdit= document.getElementById("btn-edit") as HTMLButtonElement;
    btnEdit.disabled=true;
  }

///////////// COMPRAR AHORA //////////
  irAPagarYa(){
    ////mdio de pago
    this.operacionComprarYa.medioPago=this.pago;
    /// direccion de envio
    let direccion =new Direccion();
    direccion.calle=this.clienteDireccion?.calle;
    direccion.ciudad=this.clienteDireccion?.ciudad;
    direccion.codigoPostal=this.clienteDireccion?.codigoPostal;
    direccion.numeroCalle=this.clienteDireccion?.numeroCalle;
    direccion.piso=this.clienteDireccion?.piso;

    this.operacionComprarYa.direccionEnvio=direccion;
    //// item 
    let itemComprarYa = new DetalleOperacion();
    itemComprarYa.sku=this.skuComprarAhora;
    itemComprarYa.cantidad=this.cantidad;
    this.operacionComprarYa.item=itemComprarYa


    console.log(this.operacionComprarYa);
     /// registro la operacion
     this.checkoutService.registrarNuevaOperacionComprarYa(this.operacionComprarYa).subscribe( response => {
    const infoPago= response.pago;
    console.log(infoPago);
    /// evaluo si el metodo de pago es paypal, abro el fm paypal
    if(this.operacionComprarYa.medioPago.id !==1){
      window.open(infoPago.approveUrl, "_self");
    } else { /// si no lo es, abro el de efvo
      const url = this.router.serializeUrl( this.router.createUrlTree([`cash/approved`]));
      window.open(url, "_self");
    }
   }, err => {
     alert(err.error.error);
    console.log(err);
    });

    //// deshabilito los botones para q no puedan volver a realizar la misma compra o editarla
    let btnConfirm= document.getElementById("btn-confirm") as HTMLButtonElement;
    btnConfirm.disabled=true;
    let btnEdit= document.getElementById("btn-edit") as HTMLButtonElement;
    btnEdit.disabled=true;
  }

  subtotalComprarAhora(){
    if (this.skuComprarAhora.promocion!==null) {
      if (this.skuComprarAhora.promocion.estaVigente) {
        this.subtotal = this.cantidad * this.skuComprarAhora.promocion.precioOferta
      }else{
        this.subtotal = this.cantidad * this.skuComprarAhora.precio

      }
    }else{
      this.subtotal= this.cantidad * this.skuComprarAhora.precio
    }
  }

  ///////////////////////////////
}

