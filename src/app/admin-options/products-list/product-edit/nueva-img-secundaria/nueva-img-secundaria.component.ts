import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Producto } from 'src/app/products/clases/producto';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ProductoService } from 'src/app/admin-options/producto.service';

import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-nueva-img-secundaria',
  templateUrl: './nueva-img-secundaria.component.html',
  styleUrls: ['./nueva-img-secundaria.component.scss']
})
export class NuevaImgSecundariaComponent implements OnInit {

  @Input () producto: Producto;
  @Output() propagar = new EventEmitter();

  formNuevaImagenSecundaria: FormGroup;

  imageSrcSecundaria: string;

  constructor( private productoService: ProductoService,
               private fb: FormBuilder,
               private modalService: NgbModal,
               private snackBar: MatSnackBar ) { }

  ngOnInit(): void {

    this.crearFormImgSecundaria()
  }

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

  agregarImgSecundaria(contenido){

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
      this.propagar.emit();
      contenido.dismiss();
      this.openSnackBar('Imagen secundaria agragada con éxito', null)
      
    });



  };

  open(contenido){
    
    this.modalService.open(contenido, { centered: true, scrollable: true});

  };

  //Avisos de un correcto update
  openSnackBar(message: string, action:string){
    this.snackBar.open(message, action, {duration: 3500, panelClass: ['snackPerfil']})
  };

  

}
