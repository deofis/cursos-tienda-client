import { Component, OnInit } from '@angular/core';
import { WebConfigurationService } from '../../web-configuration.service';
import { WebConfigurationComponent } from '../web-configuration/web-configuration.component';

@Component({
  selector: 'app-banners',
  templateUrl: './banners.component.html',
  styleUrls: ['./banners.component.scss']
})
export class BannersComponent implements OnInit {

  banners: any[];

  constructor( private webConfigurationService: WebConfigurationService ) { }

  ngOnInit(): void {

    this.obtenerBanners();

  }

  obtenerBanners(){

    this.webConfigurationService.getBanners().subscribe((resp:any) => {
      console.log(resp);
      
    })

  };

}
