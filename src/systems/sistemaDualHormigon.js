const tipos = {
  intermedia: {
    nombre: 'Intermedia',
    tarifas: {
      0:   { planos: 6000, modelo_m2: 60 },
      20:  { planos: 7000, modelo_m2: 70 },
      40:  { planos: 8000, modelo_m2: 80 },
      60:  { planos: 9000, modelo_m2: 90 },
      80:  { planos: 10000, modelo_m2: 100 },
      100: { planos: 11000, modelo_m2: 110 },
    }
  },
  especial: {
    nombre: 'Especial',
    tarifas: {
      0:   { planos: 6000, modelo_m2: 70 },
      20:  { planos: 7000, modelo_m2: 80 },
      40:  { planos: 8000, modelo_m2: 90 },
      60:  { planos: 9000, modelo_m2: 100 },
      80:  { planos: 10000, modelo_m2: 110 },
      100: { planos: 11000, modelo_m2: 120 },
    }
  }
};

export const sistemaDualHormigon = {
  id: 'sistema_dual_hormigon',
  nombre: 'Sistema Dual de Hormigón',
  maxNivelesPorZona: { 1: 4, 2: 6 },
  zonasPermitidas: null,
  requiereAltura: false,
  requiereZona: true,
  tipos,

  getMaxNiveles(zona) {
    return this.maxNivelesPorZona[parseInt(zona)] || 4;
  },

  validar(datos) {
    const errores = [];
    const niveles = parseInt(datos.niveles) || 0;
    const zona = parseInt(datos.zona) || 1;
    const max = this.getMaxNiveles(zona);
    if (niveles > max) {
      errores.push(`Sistema dual en zona ${zona} limitado a ${max} niveles. Actual: ${niveles}`);
    }
    return errores;
  },

  advertencias() {
    return [];
  },

  calcular(datos, areaTotal) {
    const irregularidad = parseInt(datos.irregularidad) || 0;
    const numPlanchas = parseInt(datos.numPlanchas) || 1;
    const tipo = tipos[datos.tipoDual] || tipos.intermedia;
    const tarifa = tipo.tarifas[irregularidad];

    return [
      {
        concepto: 'Planos estructurales',
        detalle: `${tarifa.planos} × ${numPlanchas} planchas (${tipo.nombre})`,
        monto: tarifa.planos * numPlanchas
      },
      {
        concepto: 'Modelo computacional',
        detalle: `${areaTotal.toFixed(2)}m² × ${tarifa.modelo_m2} (${tipo.nombre})`,
        monto: areaTotal * tarifa.modelo_m2
      }
    ];
  }
};