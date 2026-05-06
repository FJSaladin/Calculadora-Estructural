export const mamposteria = {
  id: 'mamposteria_formaleta',
  nombre: 'Mampostería / Formaleta',
  maxNiveles: 5,
  zonasPermitidas: null,
  requiereAltura: false,
  requiereZona: false,

  tarifas: {
    0:   { planos: 5000, modelo_m2: 45 },
    40:  { planos: 6000, modelo_m2: 55 },
    100: { planos: 8000, modelo_m2: 75 },
  },

  obtenerTarifa(irregularidad) {
    if (irregularidad === 0) return this.tarifas[0];
    if (irregularidad <= 40) return this.tarifas[40];
    return this.tarifas[100];
  },

  validar(datos) {
    const errores = [];
    const niveles = parseInt(datos.niveles) || 0;
    if (niveles > this.maxNiveles) {
      errores.push(`Mampostería con formaleta limitada a ${this.maxNiveles} niveles máximo. Actual: ${niveles}`);
    }
    return errores;
  },

  advertencias(datos) {
    const advertencias = [];
    const irregularidad = parseInt(datos.irregularidad) || 0;
    if (irregularidad >= 40) {
      advertencias.push('Irregularidad ≥40% incrementa categoría de tamaño del proyecto');
    }
    return advertencias;
  },

  calcular(datos, areaTotal) {
    const irregularidad = parseInt(datos.irregularidad) || 0;
    const numPlanchas = parseInt(datos.numPlanchas) || 1;
    const tarifa = this.obtenerTarifa(irregularidad);

    return [
      {
        concepto: 'Planos',
        detalle: `${tarifa.planos} × ${numPlanchas} planchas (Irregularidad: ${irregularidad}%)`,
        monto: tarifa.planos * numPlanchas
      },
      {
        concepto: 'Modelo computacional',
        detalle: `${areaTotal.toFixed(2)}m² × ${tarifa.modelo_m2}`,
        monto: areaTotal * tarifa.modelo_m2
      }
    ];
  }
};