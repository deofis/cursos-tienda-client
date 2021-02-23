import { Component, Input, OnInit } from '@angular/core';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { ProductoService } from 'src/app/admin-options/producto.service';
import { Favorito } from 'src/app/products/clases/favorito';
import { Producto } from 'src/app/products/clases/producto';
import { PropiedadProducto } from 'src/app/products/clases/propiedad-producto';
import { ValorPropiedadProducto } from 'src/app/products/clases/valor-propiedad-producto';
import { CatalogoService } from 'src/app/products/services/catalogo.service';
import { FavoritosService } from '../../favoritos.service';
import { EnviarInfoCompraService } from '../../user-profile/services/enviar-info-compra.service';
import { Router } from '@angular/router';
import { Sku } from 'src/app/products/clases/sku';
import { DetalleCarrito } from 'src/app/cart/clases/detalle-carrito';
import { AuthService } from 'src/app/log-in/services/auth.service';
import { CarritoService } from 'src/app/cart/services/carrito.service';
import { Carrito } from 'src/app/cart/clases/carrito';

@Component({
  selector: 'app-card-favorite',
  templateUrl: './card-favorite.component.html',
  styleUrls: ['./card-favorite.component.scss']
})
export class CardFavoriteComponent implements OnInit {
  @Input() favorito:Favorito;
  infoProducto:Producto;
  tieneValores:boolean=true;
  cantidadSeleccionada:number;
  valoresSkuSleccionado:ValorPropiedadProducto []=[];
  skusDelProducto:Sku [];
  valoresSkus:ValorPropiedadProducto[]=[];
  propiedadesProducto:PropiedadProducto[];
  mostrarActualizar:boolean=false;
  idSkuAEnviar:number;
  skuAEnviar:Sku = null;
  propiedadesFiltradas: PropiedadProducto[]=[];
  itemsCarrito:DetalleCarrito[];
  totalItemsCarrito:number;
  skusCombobox:Sku[];
  favoritos:Favorito[]=[];
  esFavorito:boolean;

  /// carrito del localStorage
  skusCarritoLS;
  selectedValue:string[]=[];
   /// posicion de la notificacion de producto agregado al carrito
  horizontalPosition : MatSnackBarHorizontalPosition = 'end' ;
  verticalPosition: MatSnackBarVerticalPosition = 'top' ;
  constructor( private favoritosService:FavoritosService,
              private catalogoservice:CatalogoService,
              private snackBar:MatSnackBar,
              private carritoService: CarritoService,
              private authService: AuthService,
              private enviarInfoCompra:EnviarInfoCompraService,
              private Router:Router,

              private activatedroute:ActivatedRoute,
              private productoService:ProductoService,
              ) { }

  ngOnInit(): void {
    
    this.getProduct();

    this.getPropiedadesProducto();
    this.getFavoritos();
 
   
   
  }
 

  cantidad(){
    if (this.skuAEnviar!== null) {
      if (this.skuAEnviar.disponibilidad==0) {
        this.cantidadSeleccionada=0;
      }
      else{
        this.cantidadSeleccionada=1
      }
    }else{
      this.cantidadSeleccionada= 0

    }
    
  }
  getFavoritos(){
    this.favoritosService.getFavoritos().subscribe(resp=>{
      this.favoritos=resp;
      this.marcarFavoritos(this.infoProducto?.id);
    })
  }

  marcarFavoritos(id:number){
    for (let i = 0; i < this.favoritos.length; i++) {
      if (this.favoritos[i].producto.id == id) {
        this.esFavorito=true
      }
      
    }
  }

  sumarUnidad(){
    
    // evaluo si la cantidad seleccionada es menor q la cantidad disponible, le sumo 
    if (this.cantidadSeleccionada < this.skuAEnviar.disponibilidad) {
      this.cantidadSeleccionada=this.cantidadSeleccionada+1
      if (this.cantidadSeleccionada == this.skuAEnviar.disponibilidad) {
        document.getElementById("sumar").style.opacity="0.5"
      }
    }
   
    if (this.cantidadSeleccionada!==1) {
      document.getElementById("restar").style.opacity="1"
    }
   
  }
  restarUnidad(){
    if (this.cantidadSeleccionada !==1 && this.cantidadSeleccionada !==0) {
      ///  si es distinto de uno le resto uno y evaluo nuevamente, si esunocambio el estilo del boton
      this.cantidadSeleccionada=this.cantidadSeleccionada-1;
      document.getElementById("sumar").style.opacity="1";
       if (this.cantidadSeleccionada==1) {
          document.getElementById("restar").style.opacity="0.5"
       }
    }
  }


  getProduct(){
    this.infoProducto=new Producto();
    this.infoProducto=this.favorito?.producto;
    
      setTimeout(() => {
        this.getPropiedadesProducto();
        this.getSkusDelProducto();
        this.obtenerValoresSkus();
      }, 300);
  };


  getSkusDelProducto(){
    this.productoService.getAllTheSkus(this.infoProducto?.id).subscribe(response => {
      this.skusDelProducto=response;
      this.obtenerValoresSkus();
      setTimeout(() => {
        this.identificarSkuSeleccionado()

      }, 400);
    });
  }
  
  obtenerValoresSkus(){
    let skus = this.infoProducto.skus;

    skus.forEach(sku => {
      let values = sku.valores;
      values.forEach((value) => {
        if (!this.valoresSkus.some(val => val.id == value.id)) {
          this.valoresSkus.push(value);
        }
      });
    });
    if (skus.length===0) {
     let idDefaultSku=this.infoProducto.defaultSku.id;
     this.productoService.getSku(this.infoProducto.id, idDefaultSku).subscribe( response => {
      this.skuAEnviar=response;   
      this.cantidad();
    })

    }
  }

  getPropiedadesProducto(){  /////FUNCIONA  
       this.catalogoservice.getPropiedadesProducto(this.infoProducto?.id).subscribe((resp:any) => {
        this.propiedadesProducto = resp;
        this.filtrarPropiedades();
      });
  };
  filtrarPropiedades() {
    this.propiedadesFiltradas = this.propiedadesProducto;
    this.propiedadesFiltradas?.forEach(propiedad => {
      let valoresPropiedad = propiedad.valores;
      propiedad.valores = [];
      for (let i = 0; i < this.valoresSkus.length; i++) {
        for (let x = 0; x < valoresPropiedad.length; x++) {
          if (valoresPropiedad[x].id == this.valoresSkus[i].id) {
            propiedad.valores.push(this.valoresSkus[i]);
          }
        }
      }
      if (propiedad.valores.length==0) {
        this.tieneValores=false
      }
    });
    // console.log(this.propiedadesFiltradas)
  }
 //// recargar el componente para que se reestablezcan los valores de los combobox 
 resetSeleccion(){
  this.mostrarActualizar=false;

   this.getProduct();
    this.getPropiedadesProducto();
 
  }
//////
  
  //// metodo que se activa en change del combobox, para ir trayendo skus acorde al valor seleccionado
  valoresSiguienteCombobox(i){
    /// pongo el sku ocmo null para que vuelva por unos segundos a estar los botones disabled hasta q haga todo el proceso y encuentre q los valores me generan un sku a enviar 
    this.skuAEnviar=null
    /// tomo el valor de la propiedad que seleccioné
    setTimeout(() => {
      let valorCombobox= this.selectedValue;
      console.log(valorCombobox)
      let valoresElejidosHastaElMomento = []
      // me fijo si es la primer seleccion que hago desde q se iniciaron los valores
      if( this.valoresSkuSleccionado.length == 0  ){
           for (let x = 0; x < this.skusDelProducto?.length; x++) {
          // let   valorSeleccionado= this.skusDelProducto.filter(sku=> sku.valores[x].valor ==valorCombobox);
          for (let z = 0; z < this.skusDelProducto[x]?.valores.length; z++) {
            for (let j = 0; j < valorCombobox.length; j++) {
              if(this.skusDelProducto[x].valores[z].valor == valorCombobox[j]){
                /// si no hay ninguno con ese id lo pusheo
                   for (let u = 0; u < this.skusDelProducto[x].valores.length; u++) {
                     if (!this.valoresSkuSleccionado.some(val => val.id == this.skusDelProducto[x].valores[u].id )) {
                       this.valoresSkuSleccionado.push(this.skusDelProducto[x].valores[u]);
                     }
                   }
                  }
              
            }
            
          }
         };
       
      ///lleno mis propiedades filtradas con los valores que coinciden ccon los valores del combobox seleccione
      this.propiedadesFiltradas = this.propiedadesProducto;
      this.propiedadesFiltradas?.forEach(propiedad => {
        let valoresPropiedad = propiedad.valores;
        propiedad.valores = [];
        for (let i = 0; i < this.valoresSkuSleccionado.length; i++) {
          for (let x = 0; x < valoresPropiedad.length; x++) {
            if (valoresPropiedad[x].id == this.valoresSkuSleccionado[i].id) {
              propiedad.valores.push(this.valoresSkuSleccionado[i])
            }
          }
        }
      });
      this.mostrarActualizar=true;
         
      } else{
      /// filtro los valores de los combobx para en esa propiedad solo dejar el valor q elegi   
      this.propiedadesFiltradas[i].valores= this.propiedadesFiltradas[i].valores.filter((k) => k.valor == valorCombobox[0] );
      this.propiedadesFiltradas[i].valores= this.propiedadesFiltradas[i].valores.filter((k) => k.valor == valorCombobox[1] );
      this.propiedadesFiltradas[i].valores= this.propiedadesFiltradas[i].valores.filter((k) => k.valor == valorCombobox[2] );
      this.propiedadesFiltradas[i].valores= this.propiedadesFiltradas[i].valores.filter((k) => k.valor == valorCombobox[3] );


      
      for (let j = 0; j < this.selectedValue.length; j++) {
       let valorElegido=this.selectedValue[j]
       if(valorElegido !== undefined && valorElegido !== null && valorElegido !== ""){
        valoresElejidosHastaElMomento.push(valorElegido)
       }
      }
      this.valoresSkuSleccionado=[];
      // lo vacio y vuelvo a llenar con g
      console.log(valoresElejidosHastaElMomento)
      console.log(this.skusDelProducto)
      for (let x = 0; x < this.skusDelProducto?.length; x++) {
        // let   valorSeleccionado= this.skusDelProducto.filter(sku=> sku.valores[x].valor ==valorCombobox);
        for (let z = 0; z < this.skusDelProducto[x]?.valores.length; z++) {
          for (let p = 0; p < valoresElejidosHastaElMomento.length; p++) {
            var preseleccion = []
            if(this.skusDelProducto[x].valores[z].valor == valoresElejidosHastaElMomento[p]){
             preseleccion.push(this.skusDelProducto[x])
            }
          }         
        } 
       };
      }
     
    }, 900);
    setTimeout(() => {
      this.identificarSkuSeleccionado()
    }, 600);
     
  }
  identificarSkuSeleccionado(){
    let valoresAEnviar:ValorPropiedadProducto []=[];
    for (let i = 0; i < this.selectedValue.length; i++) {
      let valorCombobox= this.selectedValue[i];
      // console.log(valorCombobox)
      for (let x = 0; x < this.valoresSkus.length; x++) {
        if (valorCombobox === this.valoresSkus[x].valor) {
          valoresAEnviar.push(this.valoresSkus[x] as ValorPropiedadProducto); 
        }
      }
    }
    // recommo mi array de skus del producto y si algun sku tiene los mismos valores seleccionados, obtengo su id
    
    let b = valoresAEnviar
    console.log(b)
    for (let x = 0; x < this.skusDelProducto.length; x++) {
      let a = this.skusDelProducto[x].valores;
        if ( JSON.stringify(a) == JSON.stringify(b)) {
          console.log(a)
            //identifico el sku
            this.idSkuAEnviar=this.skusDelProducto[x].id
              // con el id llamo a ese sku para luego enviarlo al servicio
            this.productoService.getSku(this.infoProducto?.id, this.idSkuAEnviar).subscribe( response => {
            this.skuAEnviar=response;
            this.cantidad();
            console.log(this.skuAEnviar)  
            })
            break;
         }      
    }
   
       
   }
  ///////
 
  //// agregar al carrito y mostrar snackbar 
  agregarCarrito(sku:Sku): void {
    // if localStorage.getItem("carrito")
   if (this.authService.isLoggedIn()) {
     /// envio el sku al carrito
      this.carritoService.agregarSkuAlCarrito(sku?.id.toString(),this.cantidadSeleccionada.toString()).subscribe(response => {
        /// actualizo la cantidad acorde a la cantidad elegida 
        ///seteo la cantidad de items para compartirla por el event emmiter
        this.totalItemsCarrito = response.carrito.items.length;
        setTimeout(() => {
          this.enviarInfoCompra.enviarCantidadProductosCarrito$.emit(this.totalItemsCarrito); 
        }, 100);
      });
      
     }else{
      // verifico si existe micarrito
      const getlocal = localStorage.getItem("miCarrito");
      let carrito:Carrito;
      if(getlocal != null ){ /* osea si existe*/
        carrito = JSON.parse(getlocal); 
      
        this.carritoService.agregarItemLocal(sku,carrito)
         /// actualizo la cantidad acorde a la cantidad elegida , si ya tiene le sumo en vez de editar 
         this.carritoService.actualizarCantidadLocal( this.cantidadSeleccionada,sku?.id,carrito)

        /// envio el array completo , con la info q me traje y parsié y con el nuevo item
        localStorage.setItem("miCarrito",JSON.stringify(carrito) );
        // envio la cantidad que tengo para la notif del header
        this.totalItemsCarrito = carrito.items.length;
        setTimeout(() => {
          this.enviarInfoCompra.enviarCantidadProductosCarrito$.emit(this.totalItemsCarrito); 
        }, 100);
      }else{ /* si no existe, lo creo con el sku q estoy enviando como contenido*/
        let nuevoCarrito:Carrito= new Carrito();
        let detalle: DetalleCarrito = new DetalleCarrito();
    
        detalle.sku=sku;
        
        detalle.cantidad=1;
        /// actualizo la cantidad acorde a la cantidad elegida 
        this.carritoService.actualizarCantidadLocal( this.cantidadSeleccionada,sku?.id,carrito)
        nuevoCarrito.items.push(detalle);
        localStorage.setItem("miCarrito",JSON.stringify(nuevoCarrito) );
        this.totalItemsCarrito = nuevoCarrito.items.length;
        setTimeout(() => {
          this.enviarInfoCompra.enviarCantidadProductosCarrito$.emit(this.totalItemsCarrito); 
        }, 100);
      }
    
    }

  
  }
   // prod agregado al carrito
   openSnackBar(){
    if ($(window).scrollTop() >= 30) {
      let snackBarRef= this.snackBar.open('Producto agregado al Carrito', null, {
        duration:1300 ,
        horizontalPosition : this .horizontalPosition,
        verticalPosition : this .verticalPosition,
        
     });
    }else{
      let snackBarRef= this.snackBar.open('Producto agregado al Carrito', null, {
        duration:1300 ,
        horizontalPosition : this .horizontalPosition,
        verticalPosition : this .verticalPosition,
        
     });
    }
   }

   administrarFavoritos(id:number){
    //si estoy logueado
    if (this.authService.isLoggedIn()) {

      // me fijo si tengo favoritos, los recorro
      if(this.favoritos.length!==0){
        //filtro los favoritos, si coincide con el id lo guardo en valor
        let valor= this.favoritos.filter(favorito=> favorito.producto.id == id)
        //si valor no tiene nada es porque no hubo coincidencia, entonces lo agrego
        if(valor.length==0){
          this.agregarFavorito(id);
        }else{
          this.eliminarFavorito(id);
        }
       
      }else{ /// si no tengo favoritos, lo agrego
        this.agregarFavorito(id);
      }
      
      
      
    }
  }

  eliminarFavorito(id:number){
    this.favoritosService.eliminarProductoFavorito(id).subscribe(resp =>{
    
      this.getFavoritos();
      this.esFavorito=false
    })
  }

  agregarFavorito(id:number){
    this.favoritosService.agregarProductoFavorito(id).subscribe(resp=>{
      this.esFavorito=true;
      this.getFavoritos();
    })
  }
 
 
}
