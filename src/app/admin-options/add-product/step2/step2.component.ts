
import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { Producto } from 'src/app/products/clases/producto';
import { CatalogoService } from 'src/app/products/services/catalogo.service';
import { DataService } from '../../admin-promos/data.service';
import { EnviarProductoService } from '../../enviar-producto.service';
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
 cerrarModalPromo:Subscription;
 listaDePropiedades:string;
 mostrarStep3:boolean
  constructor(private productoService:ProductoService,
              private dataService:DataService,
              public modal: NgbModal,
              private router:Router,
              private catalogoservice:CatalogoService,

              private enviarNewProduct:EnviarProductoService,
              private catalogoService: CatalogoService,
              ) {
        this.newProduct=new Producto();
   }

  ngOnInit(): void {
   
    //// para suscribirse a cerrar el componente de promos
    this.cerrarModalPromo=this.dataService.cerrarModal$.subscribe(resp =>{
      console.log(resp)
     })
    

     setTimeout(() => {
      this.listarPropiedades();
     }, 1000);
      
  }
  ngOnDestroy():void{
    this.cerrarModalPromo.unsubscribe();
  }

  listarPropiedades(){
    let propiedades=[]
    for (let x = 0; x < this.newProduct.propiedades.length; x++) {
      propiedades.push(this.newProduct.propiedades[x].nombre)
    }
    this.listaDePropiedades=propiedades.toString();
    if (this.newProduct.propiedades.length === 0) {
      this.listaDePropiedades=null
    }
  }
    ///// MODAL PROMO ////
    openCentrado(promo){
      this.modal.open(promo,{size: 'lg', centered:true})
    }
    promoProd(producto:Producto){
      setTimeout(() => {
        this.dataService.productoSelec$.emit(producto)
      }, 100);
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
      document.getElementById("no-img").style.display="none"

    }
}

guardarCambios(){
  //////////////si hay una foto seleccionada, se la cargo al producto
  if (this.selectedFile!==null) {
    this.productoService.uploadPhoto(this.selectedFile, this.newProduct?.id).subscribe(response => 
      console.log(response) );
  }
  
}
cerrarForm(){
  //para refrescar el form 
  setTimeout(() => {
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate(['/products-list']);
      this.modal.dismissAll(); 
    })
  }, 700);
 
}

enviarMostrarStep3(){
  this.mostrarStep3=true;
  this.enviarNewProduct.mostrarStep3.emit(this.mostrarStep3);
}

}
