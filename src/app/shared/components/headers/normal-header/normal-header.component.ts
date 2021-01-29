import { Component, EventEmitter, Input, OnInit, Output, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { CatalogoService } from 'src/app/products/services/catalogo.service';
import { Categoria } from 'src/app/products/clases/categoria';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { ItemCarrito } from 'src/app/cart/clases/item-carrito';
import { AuthService } from '../../../../log-in/services/auth.service';
import { CarritoService } from '../../../../cart/services/carrito.service';
import { Carrito } from '../../../../cart/clases/carrito';
import { Subcategoria } from 'src/app/products/clases/subcategoria';
import { Subscription } from 'rxjs';
import { EnviarInfoCompraService } from 'src/app/user-options/user-profile/services/enviar-info-compra.service';

declare function inicializarNotificaciones(target: HTMLElement, email: string);

@Component({
  selector: 'app-normal-header',
  templateUrl: './normal-header.component.html',
  styleUrls: ['./normal-header.component.scss']
})
export class NormalHeaderComponent implements OnInit, AfterViewInit {

  categorias:Categoria[];
  subcategorias: Subcategoria[];
  subscripcionInfoCompra : Subscription;
  //para el numero del carrito
  items: Array<ItemCarrito>;
  totalPrice:number = 0;
  totalQuantity:number = 0;
  carrito: Carrito;

  // Para perfil de usuario y notificaciones
  @ViewChild('notificationsInbox') notificationsInbox: ElementRef;
  estaLogueado: boolean;
  userEmail: string;
  totalItemsCarrito:number;

  subcategoriasMostrar:Subcategoria[]=[];
  
  constructor (private catalogoservice:CatalogoService,
              private router:Router,
              private authService: AuthService,
              private enviarInfoCompra:EnviarInfoCompraService,
              private carritoService: CarritoService) {
                this.totalItemsCarrito = 0;
              }

  ngOnInit(): void {
  
    this.verificarSesion();
    this.getCarrito(); 
    setTimeout(() => {
      this.subscripcionInfoCompra=this.enviarInfoCompra.enviarCantidadProductosCarrito$.subscribe(totalProductos=> {
        this.totalItemsCarrito=totalProductos;
      })
  
    }, 300);
   
    this.getListaCategorias();

    //cart counter
    //this.carritoService.getCarrito().subscribe(response => {
    //  this.totalQuantity = response.carrito.items.length;
    //});
  //  this._cartService.currentDataCart$.subscribe(x=>{
  //   if(x) {
  //     this.items = x;
  //     this.totalQuantity = x.length;
  //      this.totalPrice = x.reduce((sum, current) => sum + (current.producto.precio * current.cantidad), 0); 
  //   }
  //     })
  }

  ngAfterViewInit(): void {
    this.initNotificaciones();
  }

  /**
   * Inicializa las notificaciones en el Header, utilizando #notificationsInbox
   * y el email del usuario logueado (en caso de estar logueado) para recibir las
   * notificaciones correspondientes.
   */
  initNotificaciones(): void {
    if (!this.estaLogueado) {
      return ;
    }
      
    let notificationsInboxHtmlElement = this.notificationsInbox?.nativeElement as HTMLElement;
    inicializarNotificaciones(notificationsInboxHtmlElement, this.userEmail);
  }

  getCarrito(): void {
    if (this.authService.isLoggedIn()) {
      this.carritoService.getCarrito().subscribe((response: any) => {
        this.totalItemsCarrito = response.carrito.items.length;
      });
    }else{
      const getlocal = localStorage.getItem("miCarrito");
      this.carrito = JSON.parse(getlocal); 
      if (this.carrito!==null) {
        this.totalItemsCarrito=this.carrito.items.length;
      }
    }
    this.hayAlgoEnElCarrito()
  }

  hayAlgoEnElCarrito(){
    if (this.totalItemsCarrito=== 0) {
      return false
    }else{
      return true
    }
  }
   /***** GET CATEGORIES *****/
  getListaCategorias():void{
    this.catalogoservice.getListaCategorias().subscribe( response =>{
     this.categorias=response;
    }
     )
  }
              /********DROP DOWN MENUS */
//***categories */
  showCategories(){
 
    let categoriesList= document.getElementById("container-subcategories");
    categoriesList.style.display="flex";

    
    this.bgOpenMenu();    
  }
 
showsubcategories(index:number){
  /// me fijo que cantidad de subcategorias trae y en base a eso pongo la cantidad de columnas  a mostrar con los if 
 let container = document.getElementById("container-sub");
 container.style.display="grid";
 let categoriaActual=this.categorias[index]; 
 let subcatActuales=categoriaActual.subcategorias;
this.subcategoriasMostrar=[]
 for (let x = 0; x < subcatActuales.length ; x++) {
  this.subcategoriasMostrar.push(subcatActuales[x])
 }

 if (subcatActuales.length>4) {
   let columnas = subcatActuales.length /4
   let numeroColumnas= Math.ceil(columnas)
   if (numeroColumnas== 2) {
     container.style.gridTemplateColumns=" 170px 170px"
   }
   if (numeroColumnas== 3) {
    container.style.gridTemplateColumns=" 170px 170px 170px"
  }
  if (numeroColumnas== 4) {
    container.style.gridTemplateColumns=" 170px 170px 170px 170px"
  }
 }

 /// dejo seleccionado la categoria a la que entro
 let categorias= document.getElementsByClassName("items-categories") as HTMLCollectionOf<HTMLElement>;

 for (let j = 0; j < categorias.length; j++) {
  categorias[j].style.backgroundColor="rgb(243, 236, 236)";
  categorias[j].style.color="rgb(87, 83, 83)"
   if (j==index) {
    categorias[index].style.backgroundColor="#223e66";
    categorias[index].style.color="#fff"
    let flechas = document.getElementsByClassName("flecha-cat") as HTMLCollectionOf<HTMLElement>;
    for (let z = 0; z < flechas.length; z++) {
      if (z==index) {
        flechas[z].style.transform="rotate(-90deg)";
        flechas[z].style.transitionDuration="0.5s"
      }
      
    }
   }
 }
}
hiddesubcategories(){
  let subcategorias= document.getElementsByClassName("borrar") as HTMLCollectionOf<HTMLElement>;
  for (let x = 0; x < subcategorias.length; x++) {
  subcategorias[x].style.display="none"
  }
}
hiddeSubAndCategories(){
  let categoriesList= document.getElementById("container-subcategories");
    categoriesList.style.display="none";
  this.hiddeBgMenu();
}
showCategoriesAndSubcategories(){
  let containerSubcategories = document.getElementById("container-sub");
  containerSubcategories.style.display="block";
  let categoriesList= document.getElementById("categoriesList");
  categoriesList.style.display="block";
}
///****User options */
showUserMenu(){
  let userOptions = document.getElementById("userOptions");
  userOptions.style.display="block";
  /* this.bgOpenMenu(); */
}
hiddeUserMenu(){
  let userOptions = document.getElementById("userOptions");
  userOptions.style.display="none";
  this.hiddeBgMenu()
}

/******* Background Menu */
bgOpenMenu(){
  let bgCategories= document.getElementById("bg-menu");
  bgCategories.style.display="block";
}
hiddeBgMenu(){
  let bgCategories= document.getElementById("bg-menu");
  bgCategories.style.display="none";
}
/******* Menu mobile */
showMenu(){
  let menu = document.getElementById("hamburgerM");
  menu.style.display="block";

   document.getElementById("openM").style.display="none";
   document.getElementById("closeM").style.display="block";
}
hiddeMenu(){
  let menu = document.getElementById("hamburgerM");
  menu.style.display="none";

   document.getElementById("openM").style.display="block";
   document.getElementById("openM").style.marginTop="5px"
   document.getElementById("closeM").style.display="none";
}

          /**** Search bar  ****/
  buscarProducto(termino:string):void {
    this.router.navigate(['/search',termino]);
    this.hiddeSubAndCategories()
   }

   irPerfil(): void {
     if (this.estaLogueado) {
       this.router.navigate(['user-profile']);
     } else {
       this.router.navigate(['login']);
     }
   }

 
  
  /**
   * Se encarga de recibir los cambios en la sesión. La primera vez que carga el componente
   * recibe el estado actual de la sesión, pero esta subscripto a un EventEmitter que notifica
   * a todos los subscriptores cada vez que se realiza un cambio de estado en la sesión del
   * usuario.
   */
  verificarSesion(): void {
    this.authService.loggedIn.subscribe(resp => this.estaLogueado = resp);
    this.estaLogueado = this.authService.isLoggedIn();

    this.authService.useremail.subscribe(resp => this.userEmail = resp);
    this.userEmail = this.authService.getEmailUser();
  }

  /**
   * Valida que el usuario posea el rol para poder visualizar el recurso solicitado.
   * @param role string rol requerido para mostrar el recurso.
   */
  hasRole(role: string): boolean {
    return this.authService.hasRole(role);
  }

  /**
   * Cerrar sesión y eliminar datos de la misma.
   */
  logout(): void {
    this.authService.logout().subscribe(response => {
      Swal.fire({
        icon: 'success',
        title: 'Sesión Cerrada',
        text: response,
        width: '350px'
      }).then(() => {
        this.router.navigate(['/home']).then(() => window.location.reload());
        // refresh
      });
    });
  }
}
