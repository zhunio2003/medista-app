export class EmbarazoActual {
    isEmbarazada: boolean = false; // Si está embarazada actualmente
    fum: Date | null = null; // Fecha de Última Menstruación
    fpp: Date | null = null; // Fecha Probable de Parto
    semanasGestacion: number | null = null;
    controles: number | null = null; // Controles prenatales (número)
    inmunizaciones: string = "";
    descripcion: string = ""; // Observaciones generales
    fechaRegistro: Date = new Date();

    constructor() {
        this.isEmbarazada = false;
        this.fechaRegistro = new Date();
    }

    // ✅ MÉTODOS ÚTILES para el frontend

    /**
     * Calcula automáticamente las semanas de gestación basado en FUM
     */
    calcularSemanasGestacion(): void {
        if (this.fum) {
            const ahora = new Date();
            const diferenciaMilis = ahora.getTime() - this.fum.getTime();
            const dias = diferenciaMilis / (1000 * 60 * 60 * 24);
            this.semanasGestacion = Math.floor(dias / 7);
        }
    }

    /**
     * Calcula automáticamente FPP basado en FUM (280 días después)
     */
    calcularFpp(): void {
        if (this.fum) {
            const fppTime = this.fum.getTime() + (280 * 24 * 60 * 60 * 1000);
            this.fpp = new Date(fppTime);
        }
    }

    /**
     * Formatea la fecha FUM para mostrar en inputs de fecha (YYYY-MM-DD)
     */
    getFumFormatted(): string {
        if (this.fum) {
            return this.fum.toISOString().split('T')[0];
        }
        return '';
    }

    /**
     * Formatea la fecha FPP para mostrar en inputs de fecha (YYYY-MM-DD)
     */
    getFppFormatted(): string {
        if (this.fpp) {
            return this.fpp.toISOString().split('T')[0];
        }
        return '';
    }

    /**
     * Establece FUM desde string de input de fecha y calcula automáticamente FPP
     */
    setFumFromString(fechaString: string): void {
        if (fechaString) {
            this.fum = new Date(fechaString);
            this.calcularFpp(); // Calcula automáticamente FPP
            this.calcularSemanasGestacion(); // Calcula semanas
        } else {
            this.fum = null;
            this.fpp = null;
            this.semanasGestacion = null;
        }
    }

    /**
     * Establece FPP desde string de input de fecha
     */
    setFppFromString(fechaString: string): void {
        if (fechaString) {
            this.fpp = new Date(fechaString);
        } else {
            this.fpp = null;
        }
    }

    /**
     * Resetea todos los datos del embarazo
     */
    reset(): void {
        this.isEmbarazada = false;
        this.fum = null;
        this.fpp = null;
        this.semanasGestacion = null;
        this.controles = null;
        this.inmunizaciones = "";
        this.descripcion = "";
        this.fechaRegistro = new Date();
    }

    /**
     * Verifica si tiene datos de embarazo válidos
     */
    tieneDataValida(): boolean {
        return this.isEmbarazada && this.fum !== null;
    }
}