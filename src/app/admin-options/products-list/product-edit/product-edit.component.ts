import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Producto } from 'src/app/products/clases/producto';
import { ProductoService } from '../../producto.service';

import {MatSnackBar} from '@angular/material/snack-bar';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-product-edit',
  templateUrl: './product-edit.component.html',
  styleUrls: ['./product-edit.component.scss']
})
export class ProductEditComponent implements OnInit {

  @Input () producto: Producto; //Producto a editar

  formEdicionProducto: FormGroup;
  formEditarPrecio: FormGroup;
  formEditarDisponibilidad: FormGroup;
  formEditarImagenPrincipal: FormGroup;
  formNuevaImagenSecundaria: FormGroup;

  imageSrc: string;
  imageSrcSecundaria: string;

  numeroDeRepeticionesPlus:number; 

  constructor( private productoService: ProductoService,
               private fb: FormBuilder,
               private snackBar: MatSnackBar,
               private modalService: NgbModal ) { }

  ngOnInit(): void {

    this.numeroDeRepeticionesPlus = 5 - this.producto.imagenes.length 

    console.log(this.producto);
    
    this.crearFormEdicionProducto();
    this.cargarDatosFormularioEdicion();

    this.crearFormEditarPrecio();
    this.cargarPrecio();

    this.crearFormEditarDispo();
    this.cargarDisponibilidad();

    this.crearFormImagenPrincipal();
    if (this.producto.foto) {
      this.imageSrc = this.producto.foto.imageUrl;
    };

    this.crearFormImgSecundaria();

  };


  //Creación formulario reactivo para editar datos básicos del producto base
  crearFormEdicionProducto(){
    
    this.formEdicionProducto = this.fb.group({
      nombre: ['', Validators.required],
      activo: ['', Validators.required],
      destacado: ['', Validators.required],
      descripcion: ['']
    });

  };

  //Geters del formulario de edición de datos básicos del producto base
  get nombreInvalido(){
    return this.formEdicionProducto.get('nombre').invalid && this.formEdicionProducto.get('nombre').touched
  };

  get activoInvalido(){
    return this.formEdicionProducto.get('activo').invalid && this.formEdicionProducto.get('activo').touched
  };

  get destacadoInvalido(){
    return this.formEdicionProducto.get('destacado').invalid && this.formEdicionProducto.get('destacado').touched
  };


  //Método para cargar en el formulario los datos del producto base
  cargarDatosFormularioEdicion(){

    this.formEdicionProducto.setValue({
      nombre: this.producto.nombre,
      activo: this.producto.activo,
      destacado: this.producto.destacado,
      descripcion: this.producto.descripcion
    });

  };

  //Método para editar un producto base
  editarProducto() {

    console.log(this.formEdicionProducto);
    
    //Validador del formulario
    if (this.formEdicionProducto.invalid) {

      return Object.values(this.formEdicionProducto.controls).forEach(control => {

        if (control instanceof FormGroup) {
          Object.values(control.controls).forEach(control => control.markAsTouched());
        } else {
          control.markAsTouched();
        }
      });
    };

    this.producto.nombre = this.formEdicionProducto.controls.nombre.value;
    this.producto.activo = this.formEdicionProducto.controls.activo.value;
    
    this.producto.descripcion = this.formEdicionProducto.controls.descripcion.value;

    console.log(this.producto);
    
    //Llamada al endpoint para editar atributos básicos del producto base
    this.productoService.actualizarDatosProducto(this.producto).subscribe(resp => {
      console.log(resp);
      this.openSnackBar('El curso fue actualizado con éxito', null)
      
    });

    //Si se cambió el producto a destacado/no destacado, se llama al endpoint para destacar o quitar de destacado el producto base
    if (this.formEdicionProducto.controls.destacado.touched) {
      this.productoService.destacarProducto(this.producto).subscribe(resp => {
        console.log(resp);
        this.producto.destacado = this.formEdicionProducto.controls.destacado.value;
        
        
      })
    };

    //Si se cambió el producto a activo/inactivo, se llama al endpoint para activar/descativar un producto base
    if (this.formEdicionProducto.controls.activo.touched) {
      
      if (this.producto.activo) {
        this.productoService.altaProducto(this.producto).subscribe(resp => {
          console.log(resp);
          
        })

      } else {
        this.productoService.bajaProducto(this.producto).subscribe(resp => {
          console.log(resp);
          
        })
      }

    };

    this.formEdicionProducto.markAsUntouched();


  };


  //Lógica editar precio -----> 

  //Creación de formulario reactivo para editar el precio de un producto base
  crearFormEditarPrecio(){

    this.formEditarPrecio = this.fb.group({
      precio: [{value: '', disabled: this.producto.skus.length > 0 ? true : false}, 
               [Validators.required, Validators.min(0)]]
    })

  };

  //get del fomulario de edición del precio de un producto base
  get precioInvalido(){
    return this.formEditarPrecio.get('precio').invalid && this.formEditarPrecio.get('precio').touched
  };

  //Método para cargar el precio a editar de un producto base en el formulario reactivo
  cargarPrecio(){
    this.formEditarPrecio.setValue({
      precio: this.producto.precio
    })
  };

  //Método para editar el precio de un producto base
  editarPrecio(){

    //Validador del formulario reactivo
    if (this.formEditarPrecio.invalid) {

      return Object.values(this.formEditarPrecio.controls).forEach(control => {

        if (control instanceof FormGroup) {
          Object.values(control.controls).forEach(control => control.markAsTouched());
        } else {
          control.markAsTouched();
        }
      });
    };

    this.producto.precio = this.formEditarPrecio.controls.precio.value;

    //Llamada al endpoint para realizar la edición del precio de un producto base
    this.productoService.actualizarPrecioBaseProducto(this.producto.id, this.producto.precio).subscribe(resp => {
      console.log(resp);
      this.openSnackBar('El precio del curso fue actualizado con éxito', null)
      
    })
    
  };



  //Lógica editar disponibilidad ----->

  //Creación del formulario reactivo para editar la disponibilidad de un producto base
  crearFormEditarDispo(){

    this.formEditarDisponibilidad = this.fb.group({
      disponibilidad: [{value: '', disabled: this.producto.skus.length > 0 ? true : false},
                       [Validators.required, Validators.min(0)] ]
    })

  };

  get disponibilidadInvalida(){
    return this.formEditarDisponibilidad.get('disponibilidad').invalid && this.formEditarDisponibilidad.get('disponibilidad').touched
  };
  
  //Método para cargar la disponibilidad de un producto base
  cargarDisponibilidad(){
    this.formEditarDisponibilidad.setValue({
      disponibilidad: this.producto.disponibilidadGeneral
    })
  };

  //Método que realiza la llamada al endpoint para editar la disponibilidad de un producto base
  editarDisponibilidad(){

    //Validador del formulario reactivo
    if (this.formEdicionProducto.invalid) {

      return Object.values(this.formEdicionProducto.controls).forEach(control => {

        if (control instanceof FormGroup) {
          Object.values(control.controls).forEach(control => control.markAsTouched());
        } else {
          control.markAsTouched();
        }
      });
    };

    this.producto.disponibilidadGeneral = this.formEditarDisponibilidad.controls.disponibilidad.value;

    //Llamada al endpoint para realiazar la edición de la disponibilidad de un producto base
    this.productoService.actualizarDisponibilidadProducto(this.producto.id, this.producto.disponibilidadGeneral).subscribe(resp => {
      console.log(resp);
      this.openSnackBar('Los cupos del curso fueron actualizados con éxito', null)
      
    })

  };


  //Lógica editar imagen principal

  //Creación del formulario reactivo para la edicion/carga de una imagen principal a un producto base
  crearFormImagenPrincipal(){
    this.formEditarImagenPrincipal = this.fb.group({
      file: [''],
      fileSource:['']
    })
  };

  //Método que carga la imagen principal de un producto base en caso de que este la tuviera
  cargarImagenPrincipal(){
    
    if (this.producto.foto) {
      this.formEditarImagenPrincipal.setValue({
        imgPrincipal: this.producto.foto.imageUrl
      })
    }

  };


  //Método de previsualizacion de la imagen cargada como imagen principal de un producto base
  onFileChange(event) {
    const reader = new FileReader();
    
    
    
    if(event.target.files && event.target.files.length) {
      const [file] = event.target.files;
      reader.readAsDataURL(file);
    
      reader.onload = () => {
        
   
        this.imageSrc = reader.result as string;
     
        this.formEditarImagenPrincipal.patchValue({
          fileSource: event.target.files[0]
        });

       
        
   
      };
   
    }
  };

  //LLamada al endpoint para editar/cargar una imagen como imagen pricipal de un producto base
  editarImagenPrincipal(){
    this.productoService.uploadPhoto(this.formEditarImagenPrincipal.controls.fileSource.value, this.producto.id).subscribe(resp => {
      console.log(resp);
      this.producto.foto = resp.foto;
      this.openSnackBar('La imagen principal fue actualizada con éxito', null)
      
    })
  };

  //Avisos de un correcto update
  openSnackBar(message: string, action:string){
    this.snackBar.open(message, action, {duration: 3500, panelClass: ['snackPerfil']})
  };

  
  //Lógica agregar img secundaria a producto base

  crearFormImgSecundaria(){
    this.formNuevaImagenSecundaria = this.fb.group({
      file: [''],
      fileSource:['']
    })
  };

  onSecundariaChange(event) {
    const reader = new FileReader();
    
    
    
    if(event.target.files && event.target.files.length) {
      const [file] = event.target.files;
      reader.readAsDataURL(file);
    
      reader.onload = () => {
        
   
        this.imageSrcSecundaria = reader.result as string;
     
        this.formNuevaImagenSecundaria.patchValue({
          fileSource: event.target.files[0]
        });

       
        
   
      };
   
    }
  };

  agregarImgSecundaria(){

    if (this.formNuevaImagenSecundaria.invalid) {

      return Object.values(this.formNuevaImagenSecundaria.controls).forEach(control => {

        if (control instanceof FormGroup) {
          Object.values(control.controls).forEach(control => control.markAsTouched());
        } else {
          control.markAsTouched();
        }
      });
    };


    this.productoService.subirFotoSecundariaProducto(this.formNuevaImagenSecundaria.controls.fileSource.value, this.producto.id).subscribe( resp => {
      console.log(resp);
      this.producto.imagenes.push(resp.foto);
      this.formNuevaImagenSecundaria.reset();
      this.imageSrcSecundaria = null;
      
    });



  };

  open(contenido){
    
    this.modalService.open(contenido, { centered: true, scrollable: true});

  };

  actualizarProductoAEditar(){
    this.productoService.getProducto(this.producto.id).subscribe(resp => {
      this.producto = resp.producto;
      this.numeroDeRepeticionesPlus = 5 - this.producto.imagenes.length;
    })
  };

  counter(i: number) {
    return new Array(i);
  };




}
