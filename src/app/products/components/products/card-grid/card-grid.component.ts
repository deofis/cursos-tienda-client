import { Producto } from './../../../clases/producto';
import { Input } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { MockCartService } from 'src/app/cart/services/mock-cart.service';
import { ItemCarrito } from 'src/app/cart/clases/item-carrito';
import { CatalogoService } from 'src/app/products/services/catalogo.service';
import { PropiedadProducto } from 'src/app/products/clases/propiedad-producto';
import { ValorPropiedadProducto } from 'src/app/products/clases/valor-propiedad-producto';
import { AuthService } from 'src/app/log-in/services/auth.service';
import { FavoritosService } from 'src/app/user-options/favoritos.service';
import { Favorito } from 'src/app/products/clases/favorito';

@Component({
  selector: 'app-card-grid',
  templateUrl: './card-grid.component.html',
  styleUrls: ['./card-grid.component.scss']
})

export class CardGridComponent implements OnInit {
  @Input() producto:Producto;
  infoProducto:Producto;
  destacado:boolean=false;
  tieneFotoPpal:boolean;
  propiedades:PropiedadProducto[]=[];
  valoresSkus:ValorPropiedadProducto[]=[];
  valoresPropiedades:string[];
  propiedadesYValoresUsadosEnSkus:PropiedadProducto[] = [];
  arrayMostrarProp:PropiedadProducto[]=[];
  estaLogueado: boolean;
  userEmail: string;
  esFavorito:boolean;
  favoritos:Favorito[]=[]
  constructor(private catalogoservice:CatalogoService,
              private _cartService:MockCartService,
              private favoritosService:FavoritosService,
              private authService: AuthService) { }
 

  ngOnInit(): void {
    this.infoProducto=new Producto();
    this.valoresPropiedades = new Array;
    /* this.propiedadesYValoresUsadosEnSkus=  new PropiedadProducto(); */

    this.destacadosInsignia();
    this.tieneFoto();
    //obtengo los valores de mis skus
    this.obtenerValoresSkus();
    this.verificarSesion;
 
    this.propiedades=this.producto.propiedades
    this.getFavoritos();
  }

  /**
   * Valida que el usuario posea el rol para poder visualizar el recurso solicitado.
   * @param role string rol requerido para mostrar el recurso.
   */
  hasRole(role: string): boolean {
    return this.authService.hasRole(role);
  }
  verificarSesion(): void {
    this.authService.loggedIn.subscribe(resp => this.estaLogueado = resp);
    this.estaLogueado = this.authService.isLoggedIn();

    this.authService.useremail.subscribe(resp => this.userEmail = resp);
    this.userEmail = this.authService.getEmailUser();
  }

  destacadosInsignia(){
    if (this.producto.destacado) {
      this.destacado=true
    }else{
      this.destacado=false
    }
  }
  tieneFoto(){
    if (this.producto.foto!==null) {
      if (this.producto.foto.imageUrl!==null) {
        this.tieneFotoPpal=true
      }else{
        this.tieneFotoPpal=false
      }
    }
  }
 
 

  obtenerValoresSkus(){
    let skus = this.producto.skus;

    skus.forEach(sku => {
      let values = sku.valores;
      values.forEach((value) => {
        if (!this.valoresSkus.some(val => val.id == value.id)) {
          this.valoresSkus.push(value);
        }
      });
    });
     // z abtengo las propiedades del producto , para asociar cada valor del sku a uma propiedad y mostrarla
   setTimeout(() => {
    /* this.obtenerPropiedades() */
    this.obtenerPro2()

   }, 200);

  }
    obtenerPropiedades(){
      let valores =[]
      console.log(this.propiedades)
      for (let x = 0; x < 2; x++) {

        let propiedad = this.propiedades[x]?.nombre;

          // recorro los valores de cada una de mis prop
          for (let j = 0; j < this.propiedades[x]?.valores.length; j++) {

            let idValor = this.propiedades[x].valores[j].id
            ///  lo comparo con los ids de los valores skkus
            for (let i = 0; i < this.valoresSkus.length; i++) {

              if (idValor == this.valoresSkus[i].id) {
                //si coinciden, lo agrego a mi array de valores de la propiedad q estoy recorriendo 
                valores.push(this.valoresSkus[i]?.valor)
              }
         
            }
            
          }        
      }
      
    }

    obtenerPro2(){

      let props = new PropiedadProducto();
      
      props = this.copy(this.propiedades)

      for (let i = 0; i < this.propiedades.length; i++) {

        props[i].valores = []

      }

      let array = []

      for (let i = 0; i < this.valoresSkus.length; i++) {
        array.push(this.valoresSkus[i].valor)
        
      }

      
      
      for (let i = 0; i < this.propiedades.length; i++) {
        
        for (let j = 0; j < this.propiedades[i].valores.length; j++) {
          
          if (array.includes(this.propiedades[i].valores[j].valor)) {

            props[i].valores.push(this.propiedades[i].valores[j])
            
          }
        }
        
      }

      this.propiedadesYValoresUsadosEnSkus.push(props);
     
    }
  


 copy (obj) {
  let result;
  if (obj instanceof Array) {
    result = [ ...obj ];
  } else if (typeof obj === 'object') {
    result = {...obj}
  } else {
    return obj;
  }
  for (let prop of Reflect.ownKeys (result)) {
    result[ prop ] = this.copy (result[ prop ]);
  }
  return result;
}

mostrarPrecioOferta(producto:Producto){
  if (producto.promocion) {
     if (producto.promocion.estaVigente) {
       return true
     }else{
       return false
     }
  }else{
    return false
  }
  
}

//////////////// FAVORITOS ///////////////////
getFavoritos(){
  this.favoritosService.getFavoritos().subscribe(resp=>{
    this.favoritos=resp;
    console.log(this.favoritos);
    this.marcarFavoritos(this.producto?.id);

  })
}

marcarFavoritos(id:number){
  console.log('ejecutando')
  for (let i = 0; i < this.favoritos.length; i++) {
    if (this.favoritos[i].producto.id == id) {
      this.esFavorito=true
      console.log(this.esFavorito)
    }
    
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
      console.log("primer favorito")
    }
    
    
    
  }
}

eliminarFavorito(id:number){
  this.favoritosService.eliminarProductoFavorito(id).subscribe(resp =>{
   this.getFavoritos()
    console.log("producto quitado de favorito");
    this.esFavorito=false
  })
}

agregarFavorito(id:number){
  this.favoritosService.agregarProductoFavorito(id).subscribe(resp=>{
    console.log(resp);
    this.getFavoritos();
    this.esFavorito=true;
    console.log("producto agregado")
  })
}

///////////////////////////////////////////
}
