import { Producto } from './../../products/clases/producto';
import { EnviarProductoService } from './../enviar-producto.service';
import { Subscription } from 'rxjs';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss']
})
export class AddProductComponent implements OnInit {
step2:boolean=false;
subscripcionProducto : Subscription;
newProduct:Producto;
productoCreado:boolean=false
  constructor( private enviarProducto:EnviarProductoService) { }

  ngOnInit(): void {
    
    this.subscripcionProducto=this.enviarProducto.enviarProducto$.subscribe(producto=> {
     console.log(producto)
      this.newProduct=new Producto();
      this.newProduct=producto;
      this.productoCreado=true
    })
  }

}
