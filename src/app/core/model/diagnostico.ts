export class Enfermedad {
  codigo: string = "";
  nombre: string = "";
}

export class Diagnostico {
  enfermedad: Enfermedad = new Enfermedad();
  descripcion: string = "";
  estado: string = "";
}
