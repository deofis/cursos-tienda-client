import { Input } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { MockCartService } from 'src/app/cart/services/mock-cart.service';
import { ItemCarrito } from 'src/app/cart/clases/item-carrito';
import { Producto } from 'src/app/products/clases/producto';
import { CatalogoService } from 'src/app/products/services/catalogo.service';
import { PropiedadProducto } from 'src/app/products/clases/propiedad-producto';
import { FavoritosService } from 'src/app/user-options/favoritos.service';
import { AuthService } from 'src/app/log-in/services/auth.service';
import { Favorito } from 'src/app/products/clases/favorito';
import { isBreakOrContinueStatement } from 'typescript';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { DataService } from 'src/app/admin-options/admin-promos/data.service';

@Component({
  selector: 'app-card-carousel',
  templateUrl: './card-carousel.component.html',
  styleUrls: ['./card-carousel.component.scss']
})
export class CardCarouselComponent implements OnInit {
  @Input() producto:Producto;
  infoProducto:Producto;
  destacado:boolean=false;
  tieneFotoPpal:boolean;
  favoritos:Favorito[]=[];
  esFavorito:boolean;
  estaLogueado: boolean;
  userEmail: string;

  subscripcionModal : Subscription;
  modalInicio:boolean;
  constructor(private catalogoservice:CatalogoService,
              private _cartService:MockCartService,
              public modal: NgbModal,
              private dataService:DataService,
              private favoritosService:FavoritosService,
              private authService: AuthService) { }

  ngOnInit(): void {
    this.infoProducto=new Producto();
    this.destacadosInsignia();
    this.tieneFoto();
    this.getFavoritos(); 
    this.verificarSesion();  
   
    /// me suscribo para sabes cuando abrir o cerrar el modal de inicio de sesion
    this.subscripcionModal=this.dataService.modalInicioSesion$.subscribe(resp=> {
      this.modalInicio=resp;       
      console.log(resp)
     })

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
 
 

  getFavoritos(){
    if (this.authService.hasRole('ROLE_USER')) {
      this.favoritosService.getFavoritos().subscribe(resp=>{
        this.favoritos=resp;
        console.log(this.favoritos);
        this.marcarFavoritos(this.producto?.id);
  
      })
    }    
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


  abrirInicioDeSesion(){
    if (!this.authService.isLoggedIn()) {
      this.modalInicio=true
    }
  }
}
