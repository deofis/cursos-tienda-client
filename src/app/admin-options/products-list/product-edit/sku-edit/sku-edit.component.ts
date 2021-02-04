import { Component, Input, OnInit } from '@angular/core';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductoService } from 'src/app/admin-options/producto.service';
import { Sku } from 'src/app/products/clases/sku';

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

  constructor( private productoService: ProductoService,
               private fb: FormBuilder ) { }

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
    
  }

  crearformEdicionSku(){
    
    this.formEdicionSku = this.fb.group({
      nombre: ['', Validators.required],
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
      
    })

  }

  crearFormEditarPrecioSlu(){

    this.formEdicionPrecioSku = this.fb.group({
      precio: ['', Validators.required]
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
      
    })

  };

  crearFormEditarDisponibilidadSku(){

    this.formEdicionDisponibilidad = this.fb.group({
      disponibilidad: ['', Validators.required]
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
      
    });

  }

  

}
