const tarifasIntermedio = {
  0:   { planos: 6000, modelo_m2: 55 },
  20:  { planos: 7000, modelo_m2: 65 },
  40:  { planos: 8000, modelo_m2: 75 },
  60:  { planos: 9000, modelo_m2: 85 },
  80:  { planos: 10000, modelo_m2: 95 },
  100: { planos: 11000, modelo_m2: 105 },
};

const tarifasEspecial = {
  0:   { planos: 6000, modelo_m2: 65 },
  20:  { planos: 7000, modelo_m2: 75 },
  40:  { planos: 8000, modelo_m2: 85 },
  60:  { planos: 9000, modelo_m2: 95 },
  80:  { planos: 10000, modelo_m2: 105 },
  100: { planos: 11000, modelo_m2: 115 },
};

function crearSistema(id, nombre, maxNiveles, tarifas) {
  return {
    id,
    nombre,
    maxNiveles,
    zonasPermitidas: null,
    requiereAltura: false,
    requiereZona: false,
    tarifas,

    validar(datos) {
      const errores = [];
      const niveles = parseInt(datos.niveles) || 0;
      if (maxNiveles && niveles > maxNiveles) {
        errores.push(`${nombre} limitado a ${maxNiveles} niveles máximo. Actual: ${niveles}`);
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
}

export const porticosIntermediosHormigon = crearSistema(
  'porticos_intermedios_hormigon',
  'Pórticos Intermedios de Hormigón',
  12,
  tarifasIntermedio
);

export const porticosEspecialesHormigon = crearSistema(
  'porticos_especiales_hormigon',
  'Pórticos Especiales de Hormigón',
  null,
  tarifasEspecial
);