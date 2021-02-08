import { Component, OnInit } from '@angular/core';
import { NgbCarouselConfig } from "@ng-bootstrap/ng-bootstrap";
import { WebConfigurationService } from 'src/app/admin-options/web-configuration.service';
import { Banner } from 'src/app/admin-options/web-configuration/clases/banner';

@Component({
  selector: 'app-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.scss']
})

export class BannerComponent implements OnInit {
  images: any[] = [

    {
      name:'imagen 1',
      img:'../../../../assets/imagenes/bannerCalzado3.png',
    },
    {
      name:'imagen 2',
      img:'../../../../assets/imagenes/bannerCalzado1.png',
    },
    {
      name:'imagen 3',
      img:'../../../../assets/imagenes/bannerCalzado2.png',
    },
    {
      name:'imagen 3',
      img:'../../../../assets/imagenes/bannerCalzado3.png',
    },
    {
      name:'imagen 3',
      img:'../../../../assets/imagenes/bannerCalzado2.png',
    }
  ];

  banners: Banner[] = [];

  constructor(private _caruselconfig:NgbCarouselConfig,
              private webconfigurationService: WebConfigurationService) {

    _caruselconfig.interval=3000;
    _caruselconfig.pauseOnHover= true;
    _caruselconfig.showNavigationArrows= true
    _caruselconfig.wrap=true

   }

  ngOnInit(): void {

    this.obtenerBanners();
   
  }

  hideSlide(){
    let slider= document.getElementById("slider");
    console.log(slider);
    
  }
 


  hideBanner(){
    
    let banner = document.getElementById("banner");
    banner.style.display="none";
  }

  obtenerBanners(){

    this.webconfigurationService.getBanners().subscribe((resp: any ) => {
      
      this.banners = resp.banners;
      
    })

  };

}
