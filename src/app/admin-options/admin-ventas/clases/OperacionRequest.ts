import { Direccion } from "src/app/log-in/clases/cliente/direccion";
import { DetalleOperacion } from "./DetalleOperacion";
import { MedioPago } from "./MedioPago";

export class OperacionRequest {
    id:number;
    item:DetalleOperacion;
    nroOperacion:number;
    direccionEnvio: Direccion;
    medioPago: MedioPago
}