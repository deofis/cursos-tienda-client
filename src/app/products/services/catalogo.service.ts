import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { API_BASE_URL } from 'src/app/config/config';
import { Categoria } from '../clases/categoria';
import { Marca } from '../clases/marca';
import { Producto } from '../clases/producto';
import { Subcategoria } from '../clases/subcategoria';

@Injectable({
  providedIn: 'root'
})
export class CatalogoService {
url:string;
id:number;
  constructor(private http:HttpClient) { 
     this.url = `${API_BASE_URL}/api`

  }
  getProductosDestacados():Observable<Producto[]>{
    return this.http.get(`${this.url}/catalogo/destacados`).pipe( map( response => response as Producto[]));
  }

  getProductos(){
    return this.http.get(`${this.url}/productos`).pipe(map((resp:any) => {
      return resp.productos
    }))
  }

  getProductsPromocionados(){
    return this.http.get(`${this.url}/productos`).pipe(map ((resp:any) => {
      let productosProm = []

      for (let i = 0; i < resp.length; i++) {
        if (resp[i].promocion && resp[i].promocion.estaVigente) {
          productosProm.push(resp[i])
        }
        
      }
      
      return productosProm;
    }))
  }

  getListaCategorias():Observable<Categoria[]>{
    return this.http.get(`${this.url}/categorias`).pipe( map( (response:any) => response.categorias as Categoria[]));
  }

  getCategoriaPorSubcategoria(idSubcategoria:number):Observable<Categoria>{
    return this.http.get(`${this.url}/categorias/por-subcategoria/${idSubcategoria}`).pipe( map( (response:any) =>
     response.categoria as Categoria))
  }
  getSubcategoriasPorCategoria(categoriaId:number):Observable<any>{
    return this.http.get(`${this.url}/categorias/${categoriaId}/subcategorias`)
  }
  getSubcategoriasPorId(subcategoriaId:number):Observable<any>{
    return this.http.get(`${this.url}/subcategorias/${subcategoriaId}`)
  }
  getRdoBusqueda(termino:string):Observable<any>{
    let parametros=new HttpParams();
    parametros=parametros.append("termino",termino);
    return this.http.get(`${this.url}/catalogo/buscar`,{params:parametros}).pipe( 
      map( (response:any) => response)) 
    
    
  }
  getUnidades():Observable<any>{
    return this.http.get(`${this.url}/productos/unidades-medida`);
  }
 
  


  getInfoProducto(id:number):Observable<Producto>{
    
    return this.http.get(`${this.url}/catalogo/productos/${id}`).pipe( map( (response:any) => response.producto as Producto));
  }

  getSubcategorias(){
    return this.http.get(`${this.url}/subcategorias`).pipe(map((resp:any) => {
      return resp.subcategorias
    }));
  }

  ///// mover a otro servicio!
  getPaises(){
    return this.http.get(`${this.url}/paises`).pipe(map((resp:any) => {
      return resp.paises
    }));
  }
  getEstados(paisId:number){
    return this.http.get(`${this.url}/paises/${paisId}/estados`).pipe(map((resp:any) => {
      return resp.estados
    }));
  }
  getCiudades(estadoId:number,paisId:number){
    return this.http.get(`${this.url}/paises/${paisId}/estados/${estadoId}/ciudades`).pipe(map((resp:any) => {
      return resp.ciudades
    }));
  }

  //Obtener propiedades según la ID del producto | obtener-productos-controller /api/productos/{productoId}/propiedades
  getPropiedadesProducto(idProducto:number){
    
    return this.http.get(`${this.url}/productos/${idProducto}/propiedades`).pipe(map((resp:any) => {
      return resp.propiedades;
    } ));

  };

}
