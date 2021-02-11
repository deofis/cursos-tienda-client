import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Cliente } from 'src/app/log-in/clases/cliente/cliente';
import { PerfilClienteService } from './services/perfil-cliente.service';

import {MatSnackBar} from '@angular/material/snack-bar';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ValidadoresService } from 'src/app/log-in/services/validadores.service';
import { stringify } from '@angular/compiler/src/util';
import { Pais } from 'src/app/log-in/clases/cliente/pais';
import { CatalogoService } from 'src/app/products/services/catalogo.service';
import { Estado } from 'src/app/log-in/clases/cliente/estado';
import { Ciudad } from 'src/app/log-in/clases/cliente/ciudad';


@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {

  cliente: Cliente;

  formCliente: FormGroup;

  formPassword: FormGroup;
  fieldTextType1: boolean;
  fieldTextType2: boolean;

  formDireccion: FormGroup;

  flagNombre: boolean = true;
  flagApellido: boolean = true;
  flagNacimiento: boolean = true;
  flagDni: boolean = true;
  flagTel: boolean = true;

  flagBoton: boolean = false;

  paisSeleccionado: Pais;
  paises:Pais[] = [];
  estados: Estado[];
  ciudades: Ciudad[];

  flagDireccion: boolean = false;
  radioDireccion = 1;


  constructor( private prefilClienteService: PerfilClienteService,
               private fb: FormBuilder,
               private snackBar: MatSnackBar,
               private modalService: NgbModal,
               private ValidadoresService: ValidadoresService,
               private catalogoService: CatalogoService ) { 
                
   }

  ngOnInit(): void {

    this.cliente = new Cliente();

    this.getPerfilCliente();

    this.getPaises();

    this.paisSeleccionado = new Pais();

    this.crearFormDatosCliente();

    this.crearFormNuevaPass();

    this.createFormEditDireccion();
    

    /* console.log(this.formCliente); */
    
  }


  getPerfilCliente(){

    this.prefilClienteService.getInfoPerfilCliente().subscribe((resp: any) => {
      this.cliente = resp
      this.cargarDatosFormCliente();
    })

  }

  getPaises(){
    this.catalogoService.getPaises().subscribe((resp: any) => {
      this.paises = resp      
    })
  };

  getEstados(){

    this.paisSeleccionado = this.formDireccion.controls.pais.value;      
    
    this.catalogoService.getEstados(this.paisSeleccionado?.id).subscribe((resp:any) => {
      this.estados = resp;
      console.log(this.estados);
      
    })

  }

  getCiudades(){
    let estado: Estado;
    estado = this.formDireccion.controls.estado.value;

    this.catalogoService.getCiudades(estado.id, this.paisSeleccionado.id).subscribe((resp:any) => {
      this.ciudades = resp;
      console.log(this.ciudades);
      
    })
  }


  crearFormDatosCliente(){

    this.formCliente = this.fb.group({
      nombre: new FormControl({value: '', disabled: true}, Validators.required),
      apellido: new FormControl({value: '', disabled: true}, Validators.required),
      dni: new FormControl({value: '', disabled: true}),
      tel: new FormControl({value: '', disabled: true}),
      fechaNacimiento: new FormControl({value: '', disabled: true})
    })

  }

  cargarDatosFormCliente(){

    this.formCliente.setValue({
      nombre: this.cliente.nombre,
      apellido: this.cliente.apellido,
      dni: this.cliente.dni,
      tel: this.cliente.telefono,
      fechaNacimiento: this.cliente.fechaNacimiento
    })

  }

  get nombreInvalido(){
    return this.formCliente.get('nombre').invalid && this.formCliente.get('nombre').touched;
  };

  get apellidoInvalido(){
    return this.formCliente.get('apellido').invalid && this.formCliente.get('apellido').touched;
  }

  

  editarAtributoCliente(control:string){
    this.flagBoton = true;
    this.formCliente.get(control).enable(); 
  }


  updateCliente(){


    if (this.formCliente.invalid) {

        return Object.values( this.formCliente.controls ).forEach(control => {

        if (control instanceof FormGroup) {
          Object.values( control.controls ).forEach(control => control.markAsTouched());
        } else{
          control.markAsTouched();
        }
      });  
    }

    this.cliente.nombre = this.formCliente.controls.nombre.value;
    this.cliente.apellido = this.formCliente.controls.apellido.value;
    this.cliente.dni = this.formCliente.controls.dni.value;
    this.cliente.telefono = this.formCliente.controls.tel.value;
    this.cliente.fechaNacimiento = this.formCliente.controls.fechaNacimiento.value;

    console.log(this.formCliente, this.cliente);
    

    this.prefilClienteService.editarDatosCliente(this.cliente).subscribe(resp => {
      console.log(resp);
      this.formCliente.disable();
      this.prefilClienteService.getInfoPerfilCliente();
      this.flagNombre = true;
      this.flagApellido = true;
      this.flagNacimiento = true;
      this.flagDni = true;
      this.flagTel = true;
      this.flagBoton = false;
      this.openSnackBar(resp.mensaje, null)
      
    })

  };

  openSnackBar(message: string, action:string){
    this.snackBar.open(message, action, {duration: 2500, panelClass: ['snackPerfil']})
  };


  //Inicio lógica cambio de Password//

  openModalEditPass(contenido){
    this.modalService.open(contenido, { scrollable: true, keyboard: false, backdrop:'static', centered: true});
  };

  //Método mostrar/ocultar contraseña
  toggleFieldTextType1() {
    this.fieldTextType1 = !this.fieldTextType1;
  }

  toggleFieldTextType2() {
    this.fieldTextType2 = !this.fieldTextType2;
  }

  

  crearFormNuevaPass(){
    this.formPassword = this.fb.group({
      /* passActual: ['',[ Validators.required, Validators.minLength(8)]], */
      passNueva: ['', [ Validators.required, Validators.minLength(8)]],
      passNuevaValidada: ['', Validators.required]
    }, {
      validators: this.ValidadoresService.passwordIguales('passNueva', 'passNuevaValidada')
    })
  };

  /* get passActualInvalida(){
    return this.formPassword.get('passActual').invalid && this.formPassword.get('passActual').touched;
  } */

  get passNuevaInvalida(){
    return this.formPassword.get('passNueva').invalid && this.formPassword.get('passNueva').touched;
  }

  get passRepInvalida(){
    return this.formPassword.get('passNuevaValidada').invalid && this.formPassword.get('passNuevaValidada').touched;
  }

  get passwordNoIguales(){
    const pass1 = this.formPassword.get('passNueva').value;
    const pass2 = this.formPassword.get('passNuevaValidada').value;

    if (pass2 !== "") {
      return (pass1 === pass2) ? false : true;
    }

  }

  cambiarPassword(){
    
    if (this.formPassword.invalid) {

      return Object.values( this.formPassword.controls ).forEach(control => {

      if (control instanceof FormGroup) {
        Object.values( control.controls ).forEach(control => control.markAsTouched());
      } else{
        control.markAsTouched();
      }
    });  
    }
    
   let CambiarPasswordRequest = {}
   let nuevaPass = this.formPassword.get('passNuevaValidada').value

   CambiarPasswordRequest = {password: nuevaPass}
   
   this.prefilClienteService.changePass(CambiarPasswordRequest).subscribe(resp => {
     console.log(resp);
     this.openSnackBar("Su contraseña fué modificada con éxito", null);
     this.modalService.dismissAll();
     this.formPassword.reset();
   });

  }



  //Fin lógica cambio de Password//



  //Inicio lógica cambio de Dirección//
  openModalEditDireccion(contenido){
    this.modalService.open(contenido, { size: 'lg', scrollable: true, keyboard: false, backdrop:'static' });
  };

  createFormEditDireccion(){
    this.formDireccion = this.fb.group({
      pais: [''],
      estado: [''],
      ciudad: [''],
      calle: ['', Validators.required],
      nro: ['', Validators.required],
      piso: [''],
      cp: ['', Validators.required]
    })
  };

  get paisInvalido(){
    return this.formDireccion.get('pais').invalid && this.formDireccion.get('pais').touched;
  }
  
  get estadoInvalido(){
    return this.formDireccion.get('estado').invalid && this.formDireccion.get('estado').touched;
  }

  get ciudadInvalida(){
    return this.formDireccion.get('ciudad').invalid && this.formDireccion.get('ciudad').touched;
  }

  get calleInvalida(){
    return this.formDireccion.get('calle').invalid && this.formDireccion.get('calle').touched;
  }

  get nroInvalido(){
    return this.formDireccion.get('nro').invalid && this.formDireccion.get('nro').touched;
  }

  get cpInvalido(){
    return this.formDireccion.get('cp').invalid && this.formDireccion.get('cp').touched;
  }

  cargarFormDireccion(){
    this.formDireccion.setValue({
      pais: '',
      estado: '',
      ciudad: '',
      calle: this.cliente.direccion.calle,
      nro: this.cliente.direccion.numeroCalle,
      piso: this.cliente.direccion.piso,
      cp: this.cliente.direccion.codigoPostal,
    })
  }

  cambiarDireccion(){

    

    if (this.formDireccion.invalid) {

      return Object.values( this.formDireccion.controls ).forEach(control => {

      if (control instanceof FormGroup) {
        Object.values( control.controls ).forEach(control => control.markAsTouched());
      } else{
        control.markAsTouched();
      }
    });  
    }

    if (this.radioDireccion === 2) {
      console.log(this.formDireccion.controls.ciudad.value);
      
      this.cliente.direccion.ciudad = this.formDireccion.controls.ciudad.value
    };
    
    this.cliente.direccion.calle = this.formDireccion.controls.calle.value;
    this.cliente.direccion.numeroCalle = this.formDireccion.controls.nro.value;
    this.cliente.direccion.piso = this.formDireccion.controls.piso.value;
    this.cliente.direccion.codigoPostal = this.formDireccion.controls.cp.value;

    console.log(this.formDireccion);
    

    this.prefilClienteService.editarDireccionCliente(this.cliente.direccion).subscribe(resp => {
      console.log(resp);
      this.openSnackBar("Su dirección fué modificada con éxito", null);
      this.modalService.dismissAll();
      this.formDireccion.reset();
      this.radioDireccion = 1;
      this.createFormEditDireccion();
      
      
    })

  }

  setValidadoresCiudad(){
    if (this.radioDireccion === 1) {
      console.log('si', this.radioDireccion);
      
      this.formDireccion.controls.pais.setValidators(Validators.required);
      this.formDireccion.controls.estado.setValidators(Validators.required);
      this.formDireccion.controls.ciudad.setValidators(Validators.required);

    }else{
      console.log('no', this.radioDireccion);
      
      this.formDireccion.controls.pais.setValidators(null);
      this.formDireccion.controls.estado.setValidators(null);
      this.formDireccion.controls.ciudad.setValidators(null);
    }
  }
  


  //Fin lógica cambio de Dirección//





}
