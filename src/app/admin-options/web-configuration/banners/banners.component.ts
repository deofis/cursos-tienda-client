import { Component, OnInit } from '@angular/core';
import { WebConfigurationService } from '../../web-configuration.service';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { Banner } from '../clases/banner';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-banners',
  templateUrl: './banners.component.html',
  styleUrls: ['./banners.component.scss']
})
export class BannersComponent implements OnInit {

  banners: Banner[] = [];

  formNuevoBanner: FormGroup;

  imageSrc: string;

  urlPrincipal: string = 'wantfrom-tienda.web.app/';

  constructor( private webConfigurationService: WebConfigurationService,
               private modalService: NgbModal,
               private fb: FormBuilder,
               private snackBar: MatSnackBar ) { }

  ngOnInit(): void {

    this.obtenerBanners();

    this.crearFormNuevoBanner();

  }

  obtenerBanners(){

    this.webConfigurationService.getBanners().subscribe((resp:any) => {
      console.log(resp);
      this.banners = resp.banners;
      
    })

  };


  open(contenido){
    
    this.modalService.open(contenido, { size: 'lg', scrollable: true});

  };

  crearFormNuevoBanner(){

    this.formNuevoBanner = this.fb.group({
      file: [''],
      fileSource: [''],
      actionUrl: ['', Validators.required],
      
    })

  };

  get actionInvalida(){
    return this.formNuevoBanner.get('actionUrl').touched && this.formNuevoBanner.get('actionUrl').invalid;
  };

  onFileChange(event) {
    const reader = new FileReader();
    
    
    
    if(event.target.files && event.target.files.length) {
      const [file] = event.target.files;
      reader.readAsDataURL(file);
    
      reader.onload = () => {
        
   
        this.imageSrc = reader.result as string;
     
        this.formNuevoBanner.patchValue({
          fileSource: event.target.files[0]
        });

       
        
   
      };
   
    }
  };

  crearBanner(){

    //Validador del formulario
    if (this.formNuevoBanner.invalid) {

      return Object.values(this.formNuevoBanner.controls).forEach(control => {

        if (control instanceof FormGroup) {
          Object.values(control.controls).forEach(control => control.markAsTouched());
        } else {
          control.markAsTouched();
        }
      });
    };

    const bannerDto = {
      actionUrl: this.formNuevoBanner.controls.actionUrl.value
    }

    const bannerDtoStr = JSON.stringify(bannerDto);

    console.log(bannerDtoStr, this.formNuevoBanner.controls.fileSource.value);

    this.webConfigurationService.crearNuevoBanner(bannerDtoStr, this.formNuevoBanner.controls.fileSource.value).subscribe((resp:any) => {
      console.log(resp);
      this.openSnackBar("Nuevo banner creado con éxito", null)
      this.obtenerBanners();
      this.formNuevoBanner.reset();
      this.imageSrc = null;
      this.modalService.dismissAll();
    }, err => {
      console.log(err);
    });
    

    
    

  }

  openSnackBar(message: string, action:string){
    this.snackBar.open(message, action, {duration: 2500, panelClass: ['snackPerfil']})
  };

}
