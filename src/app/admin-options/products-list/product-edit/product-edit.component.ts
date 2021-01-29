import { Component, OnInit, Input } from '@angular/core';
import { Producto } from 'src/app/products/clases/producto';

@Component({
  selector: 'app-product-edit',
  templateUrl: './product-edit.component.html',
  styleUrls: ['./product-edit.component.scss']
})
export class ProductEditComponent implements OnInit {

  @Input () producto: Producto

  constructor() { }

  ngOnInit(): void {
  }

}
