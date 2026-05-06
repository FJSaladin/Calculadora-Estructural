const tarifasIntermedio = {
  0:   { planos: 8000, modelo_m2: 80 },
  20:  { planos: 9000, modelo_m2: 90 },
  40:  { planos: 10000, modelo_m2: 100 },
  60:  { planos: 10000, modelo_m2: 110 },
  80:  { planos: 10000, modelo_m2: 120 },
  100: { planos: 10000, modelo_m2: 130 },
};

const tarifasEspecial = {
  0:   { planos: 8000, modelo_m2: 90 },
  20:  { planos: 9000, modelo_m2: 100 },
  40:  { planos: 10000, modelo_m2: 110 },
  60:  { planos: 10000, modelo_m2: 120 },
  80:  { planos: 10000, modelo_m2: 130 },
  100: { planos: 10000, modelo_m2: 140 },
};

export const porticosIntermediosAcero = {
  id: 'porticos_intermedios_acero',
  nombre: 'Pórticos Intermedios de Acero',
  maxNiveles: 4,
  zonaPermitida: 2,
  requiereAltura: true,
  requiereZona: true,
  alturaMaxPorNivel: 3,
  tarifas: tarifasIntermedio,

  validar(datos) {
    const errores = [];
    const niveles = parseInt(datos.niveles) || 0;
    const zona = parseInt(datos.zona) || 1;

    if (zona !== this.zonaPermitida) {
      errores.push(`Pórticos intermedios de acero solo permitidos en zona ${this.zonaPermitida}`);
    }
    if (niveles > this.maxNiveles) {
      errores.push(`Pórticos intermedios de acero limitados a ${this.maxNiveles} niveles. Actual: ${niveles}`);
    }
    return errores;
  },

  advertencias() {
    return [];
  },

  calcular(datos, areaTotal) {
    const irregularidad = parseInt(datos.irregularidad) || 0;
    const numPlanchas = parseInt(datos.numPlanchas) || 1;
    const tarifa = this.tarifas[irregularidad];

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

export const porticosEspecialesAcero = {
  id: 'porticos_especiales_acero',
  nombre: 'Pórticos Especiales de Acero',
  maxNiveles: null,
  zonasPermitidas: null,
  requiereAltura: true,
  requiereZona: true,
  maxAlturaZona1: 50,
  tarifas: tarifasEspecial,

  validar(datos) {
    const errores = [];
    const zona = parseInt(datos.zona) || 1;

    if (zona === 1) {
      const alturaTotal = Object.values(datos.alturasNiveles || {}).reduce((sum, h) => {
        return sum + (parseFloat(h) || 0);
      }, 0);
      if (alturaTotal > this.maxAlturaZona1) {
        errores.push(`En zona 1, altura total máxima es ${this.maxAlturaZona1}m. Altura actual: ${alturaTotal.toFixed(2)}m`);
      }
    }
    return errores;
  },

  advertencias() {
    return [];
  },

  calcular(datos, areaTotal) {
    const irregularidad = parseInt(datos.irregularidad) || 0;
    const numPlanchas = parseInt(datos.numPlanchas) || 1;
    const tarifa = this.tarifas[irregularidad];

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