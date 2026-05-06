const tipos = {
  porticos_arriostramiento: {
    nombre: 'Pórticos de Acero con Arriostramiento',
    tarifas: {
      0:   { modelo_m2: 100 },
      20:  { modelo_m2: 110 },
      40:  { modelo_m2: 120 },
      60:  { modelo_m2: 130 },
      80:  { modelo_m2: 140 },
      100: { modelo_m2: 150 },
    }
  },
  muros_ordinarios: {
    nombre: 'Muros Ordinarios de Hormigón Armado',
    tarifas: {
      0:   { modelo_m2: 110 },
      20:  { modelo_m2: 120 },
      40:  { modelo_m2: 130 },
      60:  { modelo_m2: 140 },
      80:  { modelo_m2: 150 },
      100: { modelo_m2: 160 },
    }
  },
  muros_especiales: {
    nombre: 'Muros Especiales de Hormigón Armado',
    tarifas: {
      0:   { modelo_m2: 120 },
      20:  { modelo_m2: 130 },
      40:  { modelo_m2: 140 },
      60:  { modelo_m2: 150 },
      80:  { modelo_m2: 160 },
      100: { modelo_m2: 170 },
    }
  }
};

const planosBase = {
  0:   8000,
  20:  9000,
  40:  10000,
  60:  10000,
  80:  10000,
  100: 10000,
};

export const sistemaDualMetalico = {
  id: 'sistema_dual_metalico',
  nombre: 'Sistema Dual Metálico',
  maxNivelesPorZona: { 1: 4, 2: 6 },
  zonasPermitidas: null,
  requiereAltura: false,
  requiereZona: true,
  memoriaCalculo: 20000,
  tipos,
  planosBase,

  getMaxNiveles(zona) {
    return this.maxNivelesPorZona[parseInt(zona)] || 4;
  },

  validar(datos) {
    const errores = [];
    const niveles = parseInt(datos.niveles) || 0;
    const zona = parseInt(datos.zona) || 1;
    const max = this.getMaxNiveles(zona);
    if (niveles > max) {
      errores.push(`Sistema dual metálico en zona ${zona} limitado a ${max} niveles. Actual: ${niveles}`);
    }
    return errores;
  },

  advertencias() {
    return [];
  },

  calcular(datos, areaTotal) {
    const irregularidad = parseInt(datos.irregularidad) || 0;
    const numPlanchas = parseInt(datos.numPlanchas) || 1;
    const tipo = tipos[datos.tipoMetalico] || tipos.porticos_arriostramiento;
    const planos = planosBase[irregularidad];
    const tarifa = tipo.tarifas[irregularidad];

    return [
      {
        concepto: 'Planos estructurales',
        detalle: `${planos} × ${numPlanchas} planchas (Irregularidad: ${irregularidad}%)`,
        monto: planos * numPlanchas
      },
      {
        concepto: 'Modelo computacional',
        detalle: `${areaTotal.toFixed(2)}m² × ${tarifa.modelo_m2} (${tipo.nombre})`,
        monto: areaTotal * tarifa.modelo_m2
      }
    ];
  }
};