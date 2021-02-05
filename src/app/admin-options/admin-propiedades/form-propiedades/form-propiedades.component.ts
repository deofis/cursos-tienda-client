import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PropiedadProducto } from 'src/app/products/clases/propiedad-producto';
import { Subcategoria } from 'src/app/products/clases/subcategoria';
import { ValorPropiedadProducto } from 'src/app/products/clases/valor-propiedad-producto';
import { CatalogoService } from 'src/app/products/services/catalogo.service';
import { PropiedadesService } from '../../propiedades.service';
import Swal from "sweetalert2";

import { DataPromoSubService } from '../data-promo-sub.service';
import { Subscription } from 'rxjs';
import { Producto } from 'src/app/products/clases/producto';

@Component({
  selector: 'app-form-propiedades',
  templateUrl: './form-propiedades.component.html',
  styleUrls: ['./form-propiedades.component.scss']
})
export class FormPropiedadesComponent implements OnInit, AfterViewInit, OnDestroy {

  accion:string; //Despendiendo el valor de la acción, el formulario puede realizar disintas tareas
                 //Acciones --> "nuevaProp", "editProp", "nuevaPropProd"


  subSeleccionada:Subcategoria;

  prodSeleccionado: Producto;

  formPropiedad: FormGroup;

  propiedad: PropiedadProducto;
  valoresPropiedad: ValorPropiedadProducto;

  infoNombre = "Ingrese el nombre que tendrá la nueva propiedad.";
  infoValores = "Puede crear una propiedad sin asignarle uno a más valores.";

  tablaValores: boolean;

  suscripcionSub: Subscription;
  suscripcionProm: Subscription;
  suscripcionProd: Subscription;

  constructor( private fb:FormBuilder,
               private dataPromoSubService: DataPromoSubService,
               private propiedadesService: PropiedadesService) { }

  ngOnInit(): void {

    
    this.accion = "nuevaProp";
    this.prodSeleccionado = new Producto();
    this.subSeleccionada = new Subcategoria();
    this.propiedad = new PropiedadProducto();
    this.valoresPropiedad = new ValorPropiedadProducto();
    this.crearFormNuevaPromocion();
    this.tablaValores = false;

  };

  ngAfterViewInit(): void {
    
    this.suscripcionSub = this.dataPromoSubService.subSelect$.subscribe(sub => {
      this.subSeleccionada = sub;
    });

    this.suscripcionProm = this.dataPromoSubService.editPropiedad$.subscribe(prop => {
      this.tablaValores = true;
      this.propiedad = prop;
      this.cargarPropAEditar(this.propiedad);
      this.accion = "editProp"
    });

    this.suscripcionProm = this.dataPromoSubService.prodSelect$.subscribe(prod => {
      this.prodSeleccionado = prod;
      this.accion = "nuevaPropProd";
    })

  }

  ngOnDestroy(): void {
    
    this.suscripcionSub.unsubscribe();
    this.suscripcionProm.unsubscribe();
    
  }


  crearFormNuevaPromocion(){
    
    this.formPropiedad = this.fb.group({
      nombre: ['', Validators.required],
      valores: this.fb.array([])
    })

  };

  get nombreInvalido(){
    return this.formPropiedad.get('nombre').invalid && this.formPropiedad.get('nombre').touched;
  };

  get valoresInvalidos(){
    return this.formPropiedad.get('valores').invalid && this.formPropiedad.get('valores').touched;
  }

  get valores(){
    return this.formPropiedad.get('valores') as FormArray;
  };


  crearPropiedad(){


    //Validador formulario.
    if (this.formPropiedad.invalid) {

      return Object.values( this.formPropiedad.controls ).forEach(control => {

       if (control instanceof FormGroup) {
         Object.values( control.controls ).forEach(control => control.markAsTouched());
       }else{
         control.markAsTouched();
       }
     });
   };
    
    
    //Creación objeto propiedad y sus valores.
    this.propiedad.nombre =  this.formPropiedad.controls.nombre.value;
    this.propiedad.valores = [];
    this.propiedad.variable = true; /* Propenso a cambiar */
    if (this.valores.length) {
      
      for (let i = 0; i < this.valores.length; i++) {
        

        let valorPropiedad: ValorPropiedadProducto;
        valorPropiedad = new ValorPropiedadProducto;
        valorPropiedad.valor = this.formPropiedad.controls.valores.value[i];
        this.propiedad.valores.push(valorPropiedad);
          
      };

    };


    //Creacion de una nueva propiedad de una subcateogría (con o sin valores). Accion debe ser "nuevaProp".
    if (this.accion === "nuevaProp") {
      this.propiedadesService.crearNuevaPropiedadSubcategoria(this.propiedad, this.subSeleccionada.id).subscribe((resp:any) => {
        console.log(resp);
        this.alertaExito("¡Nueva propiedad creada con éxito!");
        return;
      });
    }
    

    //Modificación de una propiedad y sus valores. Acción debe ser "editProp".
    if (this.accion ==="editProp") {
      this.propiedadesService.modificarPropiedad(this.propiedad, this.propiedad.id).subscribe((resp:any) => {
        console.log(resp);
        this.alertaExito("¡Propiedad actualizada con éxito!");
        return;
      })
    }

    if (this.accion === "nuevaPropProd") {
      this.propiedadesService.crearNuevaPropiedadProducto(this.propiedad, this.prodSeleccionado.id).subscribe((resp:any) => {
        console.log(resp);
        this.alertaExito("¡Nueva propiedad creada con éxito!")
        return;
        
      })
    }
    
    
  };

  agregarValor(){
    this.valores.push(this.fb.control('', Validators.required))
  };

  borrarValor(i:number){
    this.valores.removeAt(i);
  };

  mostrarTabla(){
    this.tablaValores = true;
  };

  ocultarTabla(){
    this.tablaValores = false;
    this.valores.clear();
  };

  cargarPropAEditar(prop: PropiedadProducto){

    let valors = prop.valores

    for (let i = 0; i < valors.length; i++) {
      
      this.valores.push(this.fb.control(valors[i].valor, Validators.required))
      
    }
  
    this.formPropiedad.patchValue({
      nombre: prop.nombre
    })
    
  }


  alertaExito(msj: string){

    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-primary',
        
        
      },
      buttonsStyling: true
    });
    
    swalWithBootstrapButtons.fire({
      text: msj,
      icon: 'success',
      confirmButtonText: 'Aceptar',
      confirmButtonColor: '#1f4e84'
    });
    this.dataPromoSubService.cerrarModal$.emit();

  }
  
  habilitarEdicion(i:string){
    /* let input = document.getElementById(`input${i}`) */
    (<FormArray>this.formPropiedad.get('valores'))
      .controls
      .forEach(control => {
        control.enable()
      })
    
  }


}
