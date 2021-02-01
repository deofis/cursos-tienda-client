
import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Subscription } from 'rxjs';
import { Producto } from 'src/app/products/clases/producto';
import { DataService } from '../../admin-promos/data.service';
import { ProductoService } from '../../producto.service';

@Component({
  selector: 'app-step2',
  templateUrl: './step2.component.html',
  styleUrls: ['./step2.component.scss']
})
export class Step2Component implements OnInit, OnDestroy {
@Input() newProduct:Producto;
 // file
 url:string;
 selectedFile:File=null;
 cerrarModalPromo:Subscription
  constructor(private productoService:ProductoService,
              private dataService:DataService,
              ) {
        this.newProduct=new Producto();
   }

  ngOnInit(): void {
    //// para suscribirse a cerrar el componente de promos
    this.cerrarModalPromo=this.dataService.cerrarModal$.subscribe(resp =>{
      console.log(resp)
     })
  }
  ngOnDestroy():void{
    this.cerrarModalPromo.unsubscribe();
  }
   //// Upload imgs///////
   readUrl(event:any) {
    // console.log(event);
    this.selectedFile=event.target.files[0];
    // console.log(this.selectedFile)
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();

      reader.onload = (event:any) => {
        this.url = event.target.result;
      }
      reader.readAsDataURL(event.target.files[0]);
      document.getElementById("img-ppal").style.display="block"
    }



    //////////////me traigo el producto y ledigo q si notiene imagen haga esto 
    if (this.selectedFile!==null) {
      this.productoService.uploadPhoto(this.selectedFile, this.newProduct?.id).subscribe(response => 
        console.log(response) );
    }
}

}
