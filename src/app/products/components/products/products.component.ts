import { Promocion } from './../../../admin-options/admin-promos/clases/promocion';
import { Component, OnInit } from '@angular/core';
import { Categoria } from 'src/app/products/clases/categoria';
import { Producto } from '../../clases/producto';
import { CatalogoService } from '../../services/catalogo.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {
  productosDestacados: Producto[];
  todosLosProductos:Producto [];
  ofertas:Producto [];
  target: HTMLInputElement;
  categorias:Categoria[];
  fotoCategoria:boolean;
 
  back1:boolean=false;
  back2:boolean=false;

tarjeta= document.querySelectorAll(".tarjetas")
cantidadPaginas= Math.ceil(this.tarjeta.length /5);
  constructor(private catalogoService:CatalogoService,
              private router:Router,) { 

  }
  ngOnInit(): void {
     
    /// ****  *** CARUSEL PRODUCTOS DESTACADOS *** ****  ///
    const fila=document.getElementById("contenedor-carouselDestacados");
    const flecha1= document.getElementById("flecha-izquierda-fila1");
     const flecha2= document.getElementById("flecha-derecha-fila1");
     flecha2.addEventListener("click",()=>{
       fila.scrollLeft += fila.offsetWidth;
       this.back1=true;
       this.backButton1();
     })
     flecha1.addEventListener("click",()=>{
      fila.scrollLeft -= fila.offsetWidth;
      this.back1=false;
      this.backButton1();
    })
/// ****  *** CARUSEL OFERTAS *** ****  ///
const fila2=document.getElementById("contenedor-carouselOfertas");
    const flecha3= document.getElementById("flecha-izquierda-fila2");
     const flecha4= document.getElementById("flecha-derecha-fila2");
     flecha4.addEventListener("click",()=>{
       fila2.scrollLeft += fila2.offsetWidth;
       this.back2=true;
       this.backButton2();
     })
     flecha3.addEventListener("click",()=>{
      fila2.scrollLeft -= fila2.offsetWidth;
      this.back2=false;
      this.backButton2();
    })

    /// EFECTO CATEGORIAS
    
    this.getProductosDestacados();
    this.getOfertas()
    this.getListaCategorias();
    this.paginacion();
    window.addEventListener("scroll",this.showCategoriesEffect);

    /// ocultar boton izquierdo
    this.backButton1();
    this.backButton2();
  
    //this.categoriasFoto();
  }

  /**** Search bar  ****/
  buscarProducto(termino:string):void {
    this.router.navigate(['/search',termino]);
   }

  backButton1(){
    const flecha1= document.getElementById("flecha-izquierda-fila1");
    if(this.back1==false){
      flecha1.style.display="none";
    }else{
      flecha1.style.display="initial";
    }
  }
  
  backButton2(){
    const flecha3= document.getElementById("flecha-izquierda-fila2");
    if(this.back2==false){
      flecha3.style.display="none";
    }else{
      flecha3.style.display="initial";
    }
  }
//// mostar categorias
showCategoriesEffect() {
  let animado= document.querySelectorAll(".card-c");
  let scrollTop= document.documentElement.scrollTop;
  for ( var i=0; i< animado.length; i++){
    let alturaAnimado= (animado[i] as HTMLElement).offsetTop;
    if(alturaAnimado-450<scrollTop){
      (animado[i] as HTMLElement).style.opacity="1";
      (animado[i] as HTMLElement).classList.add("animacion")
    }
  }
}

///// PAGINACION ARREGLAR 
  paginacion(){
    const fila=document.getElementById("contenedor-carouselDestacados");
    for (let i = 0; i < this.cantidadPaginas; i++) {
     const indicador = document.createElement("button");

     if(i===0){
       indicador.classList.add("activo");
     }
     document.querySelector(".indicadores").appendChild(indicador);
     indicador.addEventListener("click",(e)=> {
     fila.scrollLeft= i* fila.offsetWidth;
     document.querySelector(".indicadores .activo").classList.remove("activo");
    //  e.target.classList.add("activo)
     })
      
    }
  }
  getProductosDestacados():void{
    this.catalogoService.getProductosDestacados().subscribe(response => {
      this.productosDestacados=response;

    });
  }

  getOfertas():void{
    this.catalogoService.getProductos().subscribe(response => {
    this.todosLosProductos=response;
    this.ofertas= this.todosLosProductos.filter(rdo => rdo.promocion !== null);
    this.ofertas= this.ofertas.filter(oferta => oferta.promocion.estaVigente !== false);
    });
  }



    /***** get Categories *****/
    getListaCategorias():void{
      this.catalogoService.getListaCategorias().subscribe( response =>{
       this.categorias=response;
      })
    }

// categoriasFoto(){
//   for (let i = 0; i < this.categorias.length; i++) {
//     if (this.categorias[i].foto!==null) {
//       if (this.categorias[i].foto.imageUrl!==null) {
//         this.fotoCategoria=true
//       }else{
//         this.fotoCategoria=false
//       }
//     }    
//   }
//}
  



}
