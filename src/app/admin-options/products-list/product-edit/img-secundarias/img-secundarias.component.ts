import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators} from '@angular/forms';

import { ProductoService } from 'src/app/admin-options/producto.service';
import { Foto } from 'src/app/products/clases/foto';
import { Producto } from 'src/app/products/clases/producto';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-img-secundarias',
  templateUrl: './img-secundarias.component.html',
  styleUrls: ['./img-secundarias.component.scss']
})
export class ImgSecundariasComponent implements OnInit {

  @Input () producto: Producto;
  @Input () imagen: Foto;
  @Output() propagar = new EventEmitter();

  imgSrc: string;
  formEditarImgSecundaria: FormGroup;


  constructor( private ProductoService: ProductoService,
               private fb: FormBuilder,
               private modalService: NgbModal,
               private snackBar: MatSnackBar ) { }

  ngOnInit(): void {

    this.crearFormEditarImgSec();
    this.imgSrc = this.imagen.imageUrl;
    console.log(this.producto, this.imagen);
    

  }


  eliminarImagenSecundaria(modal){
    this.ProductoService.eliminarFotoSecundaria(this.producto.id, this.imagen.id).subscribe(resp => {
      console.log(resp);
      this.propagar.emit();
      modal.dismiss();
      this.openSnackBar('Imagen secundaria eliminada con éxito', null);
      
    })
  };


  crearFormEditarImgSec(){
    this.formEditarImgSecundaria = this.fb.group({
      file: [''],
      fileSource: ['']
    })
  };


  onFileChange(event) {
    const reader = new FileReader();
    
    
    
    if(event.target.files && event.target.files.length) {
      const [file] = event.target.files;
      reader.readAsDataURL(file);
    
      reader.onload = () => {
        
   
        this.imgSrc = reader.result as string;
     
        this.formEditarImgSecundaria.patchValue({
          fileSource: event.target.files[0]
        });
 
   
      };
   
    }
  };

  open(contenido){
    
    this.modalService.open(contenido, { centered: true, scrollable: true});

  };


  editarImgSecundaria(contenido){

    if (this.formEditarImgSecundaria.invalid) {

      return Object.values(this.formEditarImgSecundaria.controls).forEach(control => {

        if (control instanceof FormGroup) {
          Object.values(control.controls).forEach(control => control.markAsTouched());
        } else {
          control.markAsTouched();
        }
      });
    };

    this.ProductoService.editarFotosSecundaria(this.producto.id, this.imagen.id, this.formEditarImgSecundaria.controls.fileSource.value)
      .subscribe((resp: any) => {
        console.log(resp);
        this.propagar.emit();
        this.formEditarImgSecundaria.reset();
        this.imgSrc = null;
        contenido.dismiss();
        this.openSnackBar('Imagen secundaria editada con éxito', null);
        
      });

  };

  //Avisos de un correcto update
  openSnackBar(message: string, action:string){
    this.snackBar.open(message, action, {duration: 3500, panelClass: ['snackPerfil']})
  };

  

}
