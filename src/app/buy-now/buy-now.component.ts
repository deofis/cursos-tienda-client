import { Component, Input, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { MedioPago } from '../admin-options/admin-ventas/clases/MedioPago';
import { Sku } from '../products/clases/sku';
import { EnviarInfoCompraService } from '../user-options/user-profile/services/enviar-info-compra.service';

@Component({
  selector: 'app-buy-now',
  templateUrl: './buy-now.component.html',
  styleUrls: ['./buy-now.component.scss']
})
export class BuyNowComponent implements OnInit {
  mostrarResumen:boolean=true;
  @Input() skuComprarAhora:Sku;
  @Input() cantidad:number; 
  subscripcionInfoCompra : Subscription;
  clienteDireccion:any;
  pago:MedioPago;
  entrega:string;
  constructor(private enviarInfoCompra:EnviarInfoCompraService) { }

  ngOnInit(): void {
     //// recibo del step 2 "checkout" la info cliente
     this.subscripcionInfoCompra=this.enviarInfoCompra.enviarCliente$.subscribe(dir=> {
      this.clienteDireccion=dir;
      console.log(this.clienteDireccion)
    })
   //// recibo del step 2 "checkout" la infoforma de entrega
   this.subscripcionInfoCompra=this.enviarInfoCompra.enviarEntrega$.subscribe(entrega=> {
      this.entrega=entrega;
      console.log(this.entrega)
    })
     //// recibo del step 2 "checkout" la info  forma de pago 
   this.subscripcionInfoCompra=this.enviarInfoCompra.enviarPago$.subscribe(pago=> {
      this.pago=pago;
      console.log(this.pago)
    })
  }

}
