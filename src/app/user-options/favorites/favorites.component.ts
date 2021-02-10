import { Component, OnInit } from '@angular/core';
import { FavoritosService } from '../favoritos.service';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.scss']
})
export class FavoritesComponent implements OnInit {
  favoritos:[]=[];
  tieneValores:boolean=true
  cantidadSeleccionada:number
  constructor( private favoritosService:FavoritosService,) {

    }

  ngOnInit(): void {
    this.getFavoritos();
  }
  getFavoritos(){
    this.favoritosService.getFavoritos().subscribe(resp=>{
      this.favoritos=resp
      console.log(this.favoritos)
    })
  }
  
}
