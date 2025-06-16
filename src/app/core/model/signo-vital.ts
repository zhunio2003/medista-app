export class SignoVital {
  presionArterial: string = "";         // PA
  peso: string = "";
  talla: string = "";
  imc: string = "";
  frecuenciaCardiaca: string = "";      // FC
  frecuenciaRespiratoria: string = "";  // FR
  temperatura: string = "";             // T°
  saturacionOxigeno: string = "";       // Sat.O2
  llenadoCapilar: string = "";
  reaccionPupilar: string = "";

  // Glasgow
  glasgowOcular: number = 0;
  glasgowVerbal: number = 0;
  glasgowMotora: number = 0;
  glasgowTotal: number = 0;
}
