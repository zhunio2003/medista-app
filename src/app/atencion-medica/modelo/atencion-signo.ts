import { AtencionMedica } from "../../core/model/atencion-medica";
import { SignoVital } from "../../core/model/signo-vital";

export class AtencionSigno {
    idAts: number = 0;
    valorAts: number = 0.0;
    signoVital: SignoVital = new SignoVital();
}
