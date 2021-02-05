import { Component, Input, OnInit } from '@angular/core';
import { Banner } from '../../clases/banner';

@Component({
  selector: 'app-banner-individual',
  templateUrl: './banner-individual.component.html',
  styleUrls: ['./banner-individual.component.scss']
})
export class BannerIndividualComponent implements OnInit {

  @Input() banner: Banner;

  constructor() { }

  ngOnInit(): void {

  }
  

}
