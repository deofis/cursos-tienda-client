import { Carrito } from './../../../cart/clases/carrito';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { IniciarSesionRequest } from '../../clases/login-request';
import { AuthService } from '../../services/auth.service';
import { Router, RouterStateSnapshot } from '@angular/router';
import { GOOGLE_AUTH_URL, FACEBOOK_AUTH_URL } from '../../../config/config';
import Swal from 'sweetalert2';
import { CarritoService } from 'src/app/cart/services/carrito.service';
import { EnviarInfoCompraService } from 'src/app/user-options/user-profile/services/enviar-info-compra.service';

@Component({
  selector: 'app-form-log-in',
  templateUrl: './form-log-in.component.html',
  styleUrls: ['./form-log-in.component.scss']
})
export class FormLogInComponent implements OnInit {

  GOOGLE_AUTH_URL = GOOGLE_AUTH_URL;
  FACEBOOK_AUTH_URL = FACEBOOK_AUTH_URL;

  formLogin: FormGroup;
  formOlvidePass: FormGroup;

  usuario: IniciarSesionRequest;

  carritoLocalStorage:Carrito;
  totalItemsCarrito:number;
  constructor(private authService: AuthService, 
              private fb: FormBuilder,
              private carritoService: CarritoService,
              private enviarInfoCompra:EnviarInfoCompraService,
              private router: Router,) {
    this.usuario = new IniciarSesionRequest();
    this.carritoLocalStorage= new Carrito();
  }

  ngOnInit(): void {

    this.crearForms();
     //// OLVIDE MI CONTRASENA
     let recuperar= document.getElementById("recuperar");
     recuperar.addEventListener("click",()=> {
       // ocultar form inicio de sesion
       this.hiddeForm();
       //mostrar contenedor recuperar contrasena
       let uno=document.getElementById("contenedor-forgot-psw");
       uno.style.display="flex";
       uno.style.flexDirection="column";
       uno.style.justifyContent="space-around";
       uno.style.alignItems="center";
       
     })
  
     ///VOLVER ATRAS
     let arrow1=document.getElementById("back");
     arrow1.addEventListener("click",this.return) ;  
 
  }

  crearForms(): void {
    this.formLogin = this.fb.group({
      email: ["", [Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')]],
      password: ["", Validators.required]
    });

    this.formOlvidePass = this.fb.group({
      email: ["", [Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')]]
    });
  }

  /**
   * Inicia una petición a la API para iniciar sesión, si las credenciales son válidas, nos devuelve los datos de 
   * inicio de sesión: JWT, email y rol del usuario, refresh token para iniciar sesion automaticamente y timestamp 
   * de expiración del JWT.
   */
  iniciarSesion(): void {
    if (this.formLogin.invalid) {
      return Object.values(this.formLogin.controls)
      .forEach(control => control.markAsTouched());
    }
   
    this.usuario.email = this.formLogin.controls.email.value;
    this.usuario.password = this.formLogin.controls.password.value;

    this.authService.login(this.usuario).subscribe(response => {
      /// si estoy iniciando sesion desde el carrito , me devuelve al carrito 
      if (this.router.url== "/pre-checkout") {
        this.router.navigate(['shopping-cart']).then(() => window.location.reload());
        this.unirCarritos()
      }else{ // sino al home
        this.router.navigate(['home'])
      }
      
    }, err => {
      Swal.fire({
        icon: 'error',
        title: 'Error al iniciar sesión',
        text: err.error.error
      });
      console.log(err);
    });
  }
  /// Unir carritos de local storage con el de la api
  unirCarritos(){
    //traigo el carrito del local storage
     const getlocal = localStorage.getItem("miCarrito");
     this.carritoLocalStorage = JSON.parse(getlocal); 
    
     // si existe el carrito , recorro sus items
     if (this.carritoLocalStorage!== null) {
      for (let i = 0; i < this.carritoLocalStorage.items.length; i++) {
        let skuId= this.carritoLocalStorage.items[i].sku.id;
        let cantidad = this.carritoLocalStorage.items[i].cantidad;
          /// envio el sku al carrito
        this.carritoService.agregarSkuAlCarrito(skuId.toString(),cantidad.toString()).subscribe(response => {
          ///seteo la cantidad de items para compartirla por el event emmiter
          this.totalItemsCarrito = response.carrito.items.length;
          setTimeout(() => {
            this.enviarInfoCompra.enviarCantidadProductosCarrito$.emit(this.totalItemsCarrito); 
          }, 100);
        });
      }
     }
    
     /// elimino el local storage 
     localStorage.removeItem('miCarrito');
  }
  ///
  enviarRecuperarPassword(): void {
    if (this.formOlvidePass.invalid) {
      return Object.values(this.formOlvidePass.controls)
      .forEach(control => control.markAsTouched());
    }

    let userEmail: string;
    userEmail = this.formOlvidePass.controls.email.value;

    this.authService.recuperarContraseña(userEmail).subscribe(response => {
      alert(response);
      window.location.reload();
    }, err => {
      alert(err.error);
    });
  }

  // Getters para campos invalidos formulario login
  get emailInvalido() {
    return this.formLogin.get('email').invalid && this.formLogin.get('email').touched;
  }

  get passwordInvalida() {
    return this.formLogin.get('password').invalid && this.formLogin.get('password').touched;
  }

  // Getters para campos invalidos formulario olvide pass
  get emailInvalidoPass() {
    return this.formOlvidePass.get('email').invalid && this.formOlvidePass.get('email').touched;
  }

  mostrarPsw(){
    let input = document.getElementById("password")as HTMLInputElement ;   
    if(input.type == "password"){
        input.type = "text";
      let icon= document.getElementById("show")
      icon.style.visibility="hidden";
      let iconHide=document.getElementById("hide");
      iconHide.style.visibility="visible"
    }else{
        input.type = "password";
        let icon= document.getElementById("show")
        icon.style.visibility="visible";
        let iconHide=document.getElementById("hide");
        iconHide.style.visibility="hidden"
    }

 
  }
  /// metodo para ocultar el formulario de inicio de sesion
hiddeForm(){
  let uno=document.getElementById("is-uno");
  let dos=document.getElementById("is-dos");
  let tres=document.getElementById("is-tres");
  uno.style.display="none";
  dos.style.display="none";
  tres.style.display="none";
}
//FIN ocultar formulario inicio de sesion

///inicio metodo para ir atras con la flecha
return(){
  //ocultar
  let contForgotPsw=document.getElementById("contenedor-forgot-psw");
  contForgotPsw.style.display="none";
  //mostrar inicio de sesion
  document.getElementById("is-uno").style.display="block";
  let dos=document.getElementById("is-dos");
  document.getElementById("is-tres").style.display="block";
  document.getElementById("btn2").style.marginTop="7px"
  dos.style.display="flex";
  dos.style.justifyContent="space-between";
   dos.style.alignItems="center";
}
 ///FIN metodo para ir atras 

}
