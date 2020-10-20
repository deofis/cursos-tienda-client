import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Carrito } from 'src/app/products/clases/carrito';
import { ItemCarrito } from 'src/app/products/clases/item-carrito';
import { Producto } from 'src/app/products/clases/producto';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cart = new BehaviorSubject<Array<ItemCarrito>>(null); 
  public currentDataCart$ = this.cart.asObservable();
  carrito:Carrito;

  constructor() {
    this.carrito=new Carrito()
   }
  //**Esta función se encarga de recibir el item que debemos agregar al carrito, nos fijamos si ya existe aumentamos su cantidad, sino lo agregamos y volvemos a enviar el valor a todos los observers
  public changeCart(newData: ItemCarrito) {
    //Obtenemos el valor actual
    let listCart = this.cart.getValue();
    //Si no es el primer item del carrito
    if(listCart)
    {
      //Buscamos si ya cargamos ese item en el carrito
      let objIndex = listCart.findIndex((obj => obj.producto.id == newData.producto.id));
      //Si ya cargamos uno aumentamos su cantidad
      if(objIndex != -1)
      {
       listCart[objIndex].cantidad += 1;
      }
      //Si es el primer item de ese tipo lo agregamos derecho al carrito
      else {
        listCart.push(newData);
      }  
    }
    //Si es el primer elemento lo inicializamos
    else {
      listCart = [];
      listCart.push(newData);
    }
    this.cart.next(listCart); //Enviamos el valor a todos los Observers que estan escuchando nuestro Observable
  }

   //**Con esta función removemos un elemento del carrito y volvemos a envíar la lista de esos elementos para que se propague entre los observer
  public removeElementCart(newData:ItemCarrito){
    //Obtenemos el valor actual de carrito
    let listCart = this.cart.getValue();
    //Buscamos el item del carrito para eliminar
    let objIndex = listCart.findIndex((obj => obj.producto.id == newData.producto.id));
    if(objIndex != -1)
    {
      //Seteamos la cantidad en 1 (ya que los array se modifican los valores por referencia, si vovlemos a agregarlo la cantidad no se reiniciará)
      listCart[objIndex].cantidad = 1;
      //Eliminamos el item del array del carrito
      listCart.splice(objIndex,1);
    }
    this.cart.next(listCart); //Enviamos el valor a todos los Observers que estan escuchando nuestro Observable
  }

}
