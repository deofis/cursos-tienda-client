import { DataService } from './../../admin-promos/data.service';
import { MarcasService } from './../../marcas.service';
import { PropiedadesService } from './../../propiedades.service';
import { PropiedadProducto } from './../../../products/clases/propiedad-producto';
import { ValidadoresService } from 'src/app/log-in/services/validadores.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CatalogoService } from 'src/app/products/services/catalogo.service';
import { Categoria } from 'src/app/products/clases/categoria';
import { Router } from '@angular/router';
import { Subcategoria } from 'src/app/products/clases/subcategoria';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import { Marca } from 'src/app/products/clases/marca';
import { UnidadMedida } from 'src/app/products/clases/unidad-medida';
import {FormControl} from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { flatMap, map, startWith } from 'rxjs/operators';
import { Producto } from 'src/app/products/clases/producto';
import { ProductoService } from '../../producto.service';
import Swal from "sweetalert2";
import {HttpClient} from '@angular/common/http';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { Output,EventEmitter } from '@angular/core';
import { EnviarProductoService } from '../../enviar-producto.service';

@Component({
  selector: 'app-step1',
  templateUrl: './step1.component.html',
  styleUrls: ['./step1.component.scss']
})
export class Step1Component implements OnInit, OnDestroy {
  @Output() enviar= new EventEmitter();
  showForm2:boolean = false;
  showFormPromo:boolean=false;
  categorias:Categoria[];
  subcategorias: Subcategoria[];
  categoriaSeleccionada: Categoria;
  unidadSeleccionada:UnidadMedida;
  form:FormGroup;
  oferta:boolean=false;
  unidadesMedida:UnidadMedida[];
  step2:boolean=false;
  formPromo:boolean=false;
  //nombres para los select
  marca:string="-Marca-";
  categoria:string="-Categoría-";
  subcategoria:string="-Subcategoría-";
  unidad:string="-Unidad de Medida-";
 
// autocomplete
  autoControl = new FormControl();
  marcas:Marca[];
  newBrand:Marca;
  filteredBrands:Observable<Marca[]>;
  newProduct:Producto;

  // propiedades
  formPropiedades: FormGroup;
  propiedadesProducto:PropiedadProducto[];  
  estaSubcatSeleccionada: boolean;
  propiedadSeleccionada: PropiedadProducto;
  propiedadesSeleccionadas: any[];
  
 /// boton
 habilitarBoton:boolean=false
  constructor(private router:Router,
              private catalogoservice:CatalogoService,
              private fb:FormBuilder,
              public modal: NgbModal,
              private productoService:ProductoService,
              private validadores: ValidadoresService,
              private dataService:DataService,
              private marcaService:MarcasService,
              private propiedadesService:PropiedadesService,
              private enviarNewProduct:EnviarProductoService,
              ) { 

    this.marcas = [];
    this.newProduct= new Producto();
    this.newBrand=new Marca();
    this.propiedadesSeleccionadas = [];
    
  }

  ngOnInit(): void {
         ///inicializar el fomulario
         this.crearForm();
         this.getUnidades();
         // get category list 
        this.getListaCategorias();
        // get brands
        this.getBrands();
        
    
        this.filteredBrands = this.form.controls.marca.valueChanges.pipe(
        startWith(''),
         map(value => {
           return this._filter(value)
          })
        )

        
    
      
  }


  ngOnDestroy():void{
    
  }

  mostrarNombre(marca?: Marca): string | undefined {
    return marca? marca.nombre: undefined;
  }

  enviarProducto(){
    setTimeout(() => {
      this.dataService.productoSelec$.emit(this.newProduct);
      this.enviarNewProduct.enviarProducto$.emit(this.newProduct);
    }, 100);
   
  }



crearProducto(){

  if (this.form.invalid){
    return this.form.markAllAsTouched();
  }
    this.newProduct.nombre=this.form.controls.nombre.value;
    this.newProduct.descripcion=this.form.controls.descripcion.value;
    this.newProduct.precio=this.form.controls.precio.value;
    this.newProduct.disponibilidadGeneral=this.form.controls.disponibilidadGeneral.value;
    this.newProduct.destacado=this.form.controls.destacado.value;
    this.newProduct.marca=this.form.controls.marca.value;
    this.newProduct.subcategoria=this.form.controls.subcategoria.value;
    this.newProduct.unidadMedida=this.form.controls.unidadMedida.value;
    this.newProduct.propiedades = this.propiedadesSeleccionadas;
    
    this.productoService.createNewProduct(this.newProduct).subscribe( response => {
      console.log(response);
      this.newProduct.id=response.id;
      this.form.disable();
 
    }, err => {
      console.log(err);
  });
  this.enviarProducto()
}

crearForm(){
  this.form=this.fb.group({
    id:[""],
    nombre:["", Validators.required],
    descripcion:[""],
    precio:["", Validators.required],
    disponibilidadGeneral:[null, Validators.required],
    destacado:[false],
    marca: ["", Validators.required],
    subcategoria:["", Validators.required],
    categoria:["",Validators.required],
    unidadMedida:["", Validators.required],
  }, {
    validators: this.validadores.existeMarca('marca')
  });

  this.formPropiedades = this.fb.group({
    propiedad: [""]
  });
}

  // Getters para campos invalidos formulario 
  get nombreInvalido() {
    return this.form.get('nombre').invalid && this.form.get('nombre').touched;
  }
    get marcaInvalida() {
      return this.form.get('marca').invalid && this.form.get('marca').touched;
    }
    get disponibilidadGeneralInvalida() {
      return this.form.get('disponibilidadGeneral').invalid && this.form.get('disponibilidadGeneral').touched;
    }
    get subcategoriaInvalida() {
      return this.form.get('subcategoria').touched  && (this.form.controls.subcategoria.value == this.subcategoria);
    }
    get categoriaInvalida() {
      return this.form.get('categoria').touched && (this.form.controls.categoria.value == this.categoria);
    }
    get unidadInvalida() {
      return this.form.get('unidadMedida').touched && this.form.get('unidadMedida').value==this.unidad;
    }
    get precioInvalido() {
      return this.form.get('precio').invalid && this.form.get('precio').touched;
    }
  
  
  private _filter(value:any) {
    const filterValue = value;
    return this.marcas.filter(marca => marca.nombre.toLowerCase().indexOf(filterValue) === 0);
  }
  
     /***** GET CATEGORIES *****/
     getListaCategorias():void{
      this.catalogoservice.getListaCategorias().subscribe( response =>{
       this.categorias=response;
      }
       )
    }

    getUnidades(){
      this.catalogoservice.getUnidades().subscribe(response => {
        this.unidadesMedida=response;
      })
    }
    getBrands(){
      this.marcaService.getBrands().subscribe((response: any) => {
        this.marcas=response;
        
        
      });
    }

    showSubcategories(){
      this.categoriaSeleccionada = this.form.controls.categoria.value;

      this.catalogoservice.getSubcategoriasPorCategoria(this.categoriaSeleccionada.id)
      .subscribe(response => {
        console.log(response);
        
        this.subcategorias=response.subcategorias;
      });

      this.formPropiedades.reset();
      this.estaSubcatSeleccionada = false;

      let comboBoxSubcateories= document.getElementById("subcategories");
      comboBoxSubcateories.style.display="block";
    }

    showProperties(): void {
      let subcategoria: Subcategoria;
      subcategoria = this.form.controls.subcategoria.value;
      this.estaSubcatSeleccionada = true;

      this.propiedadesProducto = subcategoria.propiedades;
      this.propiedadesSeleccionadas = [];
      this.formPropiedades.reset();
    }

    guardarPropiedades(propiedad: PropiedadProducto) {
      let checked = this.formPropiedades.controls.propiedad.value;

      if (checked) {
        this.propiedadesSeleccionadas.push(propiedad);

      
      } else {
        this.propiedadesSeleccionadas = this.propiedadesSeleccionadas.filter(item => item !== propiedad);
        
      }
      if(this.propiedadesSeleccionadas.length == 0){
         
      }

    
    }

    showUnit(){
       this.unidadSeleccionada = this.form.controls.unidadMedida.value;
     
      let unidad = document.getElementById("unidadElegida");
      
      if(this.unidadSeleccionada.nombre=="Unidad"){
        unidad.innerText="unidades";
      }
      if(this.unidadSeleccionada.nombre=="Kilo"){
        unidad.innerText="kilos"
      }
      if(this.unidadSeleccionada.nombre=="Litro"){
        unidad.innerText="litros"
      }
           
    }
    changeUnit(){
      let inputDisponibilidad= document.getElementById("availability") as HTMLInputElement;
      let unidad = document.getElementById("unidadElegida");
      this.unidadSeleccionada = this.form.controls.unidadMedida.value;
      if(inputDisponibilidad.value== "1"){
       unidad.innerText=this.unidadSeleccionada.nombre
      }else{
        this.showUnit();
      }
    }

      ///// MODAL  NUEVA MARCA////
  openModal(marca){
    this.modal.open(marca,{centered:true})
  }
  addBrand(){
   let input = document.getElementById("marca")as HTMLInputElement;
    //lleno el objeto marca
    if(input.value !== ""){
   this.newBrand.id=1;
   this.newBrand.nombre=input.value.toLowerCase().replace(/(?:(^.)|(\s+.))/g, function(match) {
    return match.charAt(match.length-1).toUpperCase()});
   //lo envio
   this.marcaService.createNewBrand(this.newBrand)
   .subscribe( response => {
     this.getBrands();
     console.log(response)});
  
     //msj listo 
  let modal = document.getElementById("listo");
  modal.style.display="block";
  let form =document.getElementById("form-add-brand");
  form.style.display="none"
  let btn =document.getElementById("btn-brand");
  btn.style.display="none"
   }
  }

  ///// MODAL PROPIEDAD ////
  openCentrado(agregarprop){
    this.modal.open(agregarprop,{size: 'lg', centered:true})
  }





/// si no sirve eliminar 



  mensajeProductoCreado(){
    if (this.form.invalid){
      return this.form.markAllAsTouched();
    }else{
      Swal.fire({
        icon: 'success',
        title: 'El producto ha sido creado con éxito',
      });
      // deshabilito los checkbox de propiedades
      document.getElementById("btn-end").style.display="none"
      let checkbox = document.getElementsByClassName("checkbox-prop") as HTMLCollectionOf<HTMLInputElement>;
      for (let i = 0; i < checkbox.length; i++) {
        checkbox[i].disabled=true;
      }
      //coloreo el boton q se habilita
      this.habilitarBoton=true
      document.getElementById("btn-end2").style.color="#fff";
      document.getElementById("btn-end2").style.backgroundColor="#223e66"
      // elimino el boton de agregar propieaddes para q no se puedan crear nuevas
      document.getElementById("add-p-b").style.display="none"
    }
   
  }
}
