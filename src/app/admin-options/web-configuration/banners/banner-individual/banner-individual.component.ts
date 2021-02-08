import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { WebConfigurationService } from 'src/app/admin-options/web-configuration.service';
import { Banner } from '../../clases/banner';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-banner-individual',
  templateUrl: './banner-individual.component.html',
  styleUrls: ['./banner-individual.component.scss']
})
export class BannerIndividualComponent implements OnInit {

  @Input() banner: Banner;
  @Output() propagar = new EventEmitter();

  imageSrc: string;

  formEditarBanner: FormGroup;
  formEditarUrl: FormGroup;

  urlPrincipal: string = 'wantfrom-tienda.web.app/';

  constructor( private webConfigurationService: WebConfigurationService,
               private modalService: NgbModal,
               private fb: FormBuilder,
               private snackBar: MatSnackBar ) { }

  ngOnInit(): void {

    this.crearFormEditarBanner()
    this.imageSrc = this.banner.imagen.imageUrl;

    this.crearFormEditarUrl();

  }

  eliminarBanner(){
    this.webConfigurationService.eliminarBanner(this.banner.id).subscribe((resp:any) => {
      console.log(resp);
      this.propagar.emit();
      this.openSnackBar("Banner eliminado con éxito", null);
      
    })
  };

  open(contenido){
    
    this.modalService.open(contenido, { size: 'lg', scrollable: true});

  };

  crearFormEditarBanner(){
    this.formEditarBanner = this.fb.group({
      file: [''],
      fileSource: [''],
    })
  };

  crearFormEditarUrl(){
    this.formEditarUrl = this.fb.group({
      actionUrl: [this.banner.actionUrl, Validators.required]
    })
  };
  

  get urlInvalida(){

    return this.formEditarUrl.get('actionUrl').touched && this.formEditarUrl.get('actionUrl').invalid;

  };

  onFileChange(event) {
    const reader = new FileReader();
    
    
    
    if(event.target.files && event.target.files.length) {
      const [file] = event.target.files;
      reader.readAsDataURL(file);
    
      reader.onload = () => {
        
   
        this.imageSrc = reader.result as string;
     
        this.formEditarBanner.patchValue({
          fileSource: event.target.files[0]
        });
 
   
      };
   
    }
  };

  editarImagenBanner(){

    //Validador del formulario
    if (this.formEditarBanner.invalid) {

      return Object.values(this.formEditarBanner.controls).forEach(control => {

        if (control instanceof FormGroup) {
          Object.values(control.controls).forEach(control => control.markAsTouched());
        } else {
          control.markAsTouched();
        }
      });
    };

    this.webConfigurationService.editarImagenBanner(this.banner.id, this.formEditarBanner.controls.fileSource.value).subscribe((resp: any) => {
      console.log(resp);
      this.banner.imagen = resp.banner.imagen;
      this.openSnackBar("Imagen editada con éxito", null);
      
    })



  };


  editarUrlBanner(){

    if (this.formEditarUrl.invalid) {

      return Object.values(this.formEditarUrl.controls).forEach(control => {

        if (control instanceof FormGroup) {
          Object.values(control.controls).forEach(control => control.markAsTouched());
        } else {
          control.markAsTouched();
        }
      });
    };

    this.banner.actionUrl = this.formEditarUrl.controls.actionUrl.value;

    this.webConfigurationService.editarBannerUrl(this.banner.id, this.banner.actionUrl).subscribe((resp:any) => {
      console.log(resp);
      this.banner.actionUrl = resp.banner.actionUrl;
      this.openSnackBar("Url del banner editada con éxito", null);
      
    });

  

  };

  openSnackBar(message: string, action:string){
    this.snackBar.open(message, action, {duration: 2500, panelClass: ['snackPerfil']})
  };


  

}
