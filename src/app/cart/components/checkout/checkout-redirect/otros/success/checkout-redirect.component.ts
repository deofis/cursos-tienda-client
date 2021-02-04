import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CheckoutPayload } from 'src/app/cart/clases/dto/checkout-payload';
import { EnviarInfoCompraService } from 'src/app/user-options/user-profile/services/enviar-info-compra.service';
import { CheckoutService} from '../../../../../services/checkout.service';


@Component({
  selector: 'app-checkout-redirect-envio',
  templateUrl: './checkout-redirect.component.html',
  styleUrls: ['./checkout-redirect.component.scss']
})
export class CheckoutRedirectComponent implements OnInit {
  subscripcionInfoCompra : Subscription;
  entrega:string;
  constructor(private activatedRoute: ActivatedRoute,
                private router: Router,
                private enviarInfoCompra:EnviarInfoCompraService,
                private checkoutService:CheckoutService,
                ) { }

  ngOnInit(): void {
    this.completarCheckout();

 
  }
  completarCheckout(){
    /// tomo el nro de operacion de la ruta y lo envio al servicio para completar el pago 
    this.activatedRoute.queryParams.subscribe( param=> {
      const checkoutPayload=new CheckoutPayload() ;
      //si estoy con paypal
      if (param.token) {
        checkoutPayload.nroOperacion=param.nroOperacion;
        checkoutPayload.paymentId=param.token;
        
      }else if(param.payment_id){ // si es mercado pago 
        checkoutPayload.nroOperacion=param.nroOperacion;
        checkoutPayload.paymentId=param.payment_id;
        checkoutPayload.preferenceId=param.preference_id;
      }
      this.checkoutService.completarPago(checkoutPayload).subscribe(response => {
        console.log(response.pago)
      })
    }) 
  }
}
