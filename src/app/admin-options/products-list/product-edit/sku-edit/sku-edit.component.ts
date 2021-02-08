import { Component, Input, OnInit } from '@angular/core';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductoService } from 'src/app/admin-options/producto.service';
import { Sku } from 'src/app/products/clases/sku';

import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-sku-edit',
  templateUrl: './sku-edit.component.html',
  styleUrls: ['./sku-edit.component.scss']
})
export class SkuEditComponent implements OnInit {

  @Input () skus: Sku[]; //Skus de producto a editar

  skuEditar: Sku; //Sku a editar

  flagEdicionSku: boolean = false;

  formEdicionSku: FormGroup;
  formEdicionPrecioSku: FormGroup;
  formEdicionDisponibilidad: FormGroup;
  formEditarImagenSku: FormGroup;

  imageSrc:string;

  constructor( private productoService: ProductoService,
               private fb: FormBuilder,
               private snackBar: MatSnackBar ) { }

  ngOnInit(): void {

    

  }

  seleccionSku(){
    console.log(this.skuEditar);

    this.crearformEdicionSku();
    this.cargarDatosFormularioEdicion();

    this.crearFormEditarPrecioSlu();
    this.caragarPrecioSku();

    this.crearFormEditarDisponibilidadSku();
    this.cargarDisponibilidadSku();

    this.crearFormImagenSku();
    if (this.skuEditar.foto) {
      this.imageSrc = this.skuEditar.foto.imageUrl
    }
    
  }

  crearformEdicionSku(){
    
    this.formEdicionSku = this.fb.group({
      nombre: [{value: '', disabled: true}, Validators.required],
      descripcion: ['']
    });

  };

  get nombreInvalido(){
    return this.formEdicionSku.get('nombre').invalid && this.formEdicionSku.get('nombre').touched
  };

  cargarDatosFormularioEdicion(){

    this.formEdicionSku.setValue({
      nombre: this.skuEditar.nombre,
      descripcion: this.skuEditar.descripcion
    });

  };

  editarSkuSeleccionado(){

    //Validador del formulario
    if (this.formEdicionSku.invalid) {

      return Object.values(this.formEdicionSku.controls).forEach(control => {

        if (control instanceof FormGroup) {
          Object.values(control.controls).forEach(control => control.markAsTouched());
        } else {
          control.markAsTouched();
        }
      });
    };

    this.skuEditar.nombre = this.formEdicionSku.controls.nombre.value;
    this.skuEditar.descripcion = this.formEdicionSku.controls.descripcion.value;


    this.productoService.actualizarDatosSku(this.skuEditar).subscribe(resp => {
      console.log(resp);
      this.openSnackBar('Los datos del producto fueron actualizados con éxito', null)
      
    })

  }

  crearFormEditarPrecioSlu(){

    this.formEdicionPrecioSku = this.fb.group({
      precio: ['', [Validators.required, Validators.min(0)]]
    })

  }

  caragarPrecioSku(){
    
    this.formEdicionPrecioSku.setValue({
      precio: this.skuEditar.precio
    })

  };

  get precioInvalido(){
    return this.formEdicionPrecioSku.get('precio').invalid && this.formEdicionPrecioSku.get('precio').touched;
  };

  editarPrecioSku(){

    if (this.formEdicionPrecioSku.invalid) {

      return Object.values(this.formEdicionPrecioSku.controls).forEach(control => {

        if (control instanceof FormGroup) {
          Object.values(control.controls).forEach(control => control.markAsTouched());
        } else {
          control.markAsTouched();
        }
      });
    };

    this.skuEditar.precio = this.formEdicionPrecioSku.controls.precio.value;

    this.productoService.editarPrecioSku(this.skuEditar.id, this.skuEditar.precio).subscribe(resp => {
      console.log(resp);
      this.openSnackBar('El precio del producto fue actualizado con éxito', null)
      
    })

  };

  crearFormEditarDisponibilidadSku(){

    this.formEdicionDisponibilidad = this.fb.group({
      disponibilidad: ['', [Validators.required, Validators.min(0)]]
    });

  };

  get disponibilidadInvalida(){
    return this.formEdicionDisponibilidad.get('disponibilidad').touched && this.formEdicionDisponibilidad.get('disponibilidad').invalid; 
  };

  cargarDisponibilidadSku(){
    this.formEdicionDisponibilidad.setValue({
      disponibilidad: this.skuEditar.disponibilidad
    })
  };

  editarDisponibilidadSku(){

    if (this.formEdicionDisponibilidad.invalid) {

      return Object.values(this.formEdicionDisponibilidad.controls).forEach(control => {

        if (control instanceof FormGroup) {
          Object.values(control.controls).forEach(control => control.markAsTouched());
        } else {
          control.markAsTouched();
        }
      });
    };

    this.skuEditar.disponibilidad = this.formEdicionDisponibilidad.controls.disponibilidad.value;

    this.productoService.editarDisponibilidadSku(this.skuEditar.id, this.skuEditar.disponibilidad).subscribe(resp => {
      console.log(resp);
      this.openSnackBar('El stock del producto fue actualizado con éxito', null)
      
    });

  };

  crearFormImagenSku(){
    this.formEditarImagenSku = this.fb.group({
      file: [''],
      fileSource: ['']
    })
  };

  onFileChange(event) {
    const reader = new FileReader();

    if (event.target.files && event.target.files.length) {
      const [file] = event.target.files;
      reader.readAsDataURL(file);

      reader.onload = () => {

        this.imageSrc = reader.result as string;

        this.formEditarImagenSku.patchValue({
          fileSource: event.target.files[0]
        })

      }
    }

  };

  editarImagenSku(){
    this.productoService.uploadFotoSku(this.formEditarImagenSku.controls.fileSource.value, this.skuEditar.id).subscribe(resp => {
      console.log(resp);
      this.skuEditar.foto = resp.foto;
      this.openSnackBar('La imagen del producto fue actualizada con éxito', null)
      
    })
  };


  //Avisos de un correcto update
  openSnackBar(message: string, action:string){
    this.snackBar.open(message, action, {duration: 3500, panelClass: ['snackPerfil']})
  };

  

}
