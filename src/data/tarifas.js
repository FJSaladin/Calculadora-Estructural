export const tarifas = {
  mamposteria_formaleta: {
    nombre: "Mampostería con Formaleta",
    max_niveles: 5,
    irregularidad: {
      0: { planos: 5000, modelo_m2: 45 },
      20: { planos: 5000, modelo_m2: 45 },
      40: { planos: 6000, modelo_m2: 55 },
      60: { planos: 6000, modelo_m2: 55 },
      80: { planos: 8000, modelo_m2: 75 },
      100: { planos: 8000, modelo_m2: 75 }
    }
  },
  porticos_intermedios_hormigon: {
    nombre: "Pórticos Intermedios de Hormigón",
    max_niveles: 12,
    irregularidad: {
      0: { planos: 6000, modelo_m2: 55 },
      20: { planos: 7000, modelo_m2: 65 },
      40: { planos: 8000, modelo_m2: 75 },
      60: { planos: 9000, modelo_m2: 85 },
      80: { planos: 10000, modelo_m2: 95 },
      100: { planos: 11000, modelo_m2: 105 }
    }
  },
  porticos_especiales_hormigon: {
    nombre: "Pórticos Especiales de Hormigón",
    max_niveles: Infinity,
    irregularidad: {
      0: { planos: 6000, modelo_m2: 65 },
      20: { planos: 7000, modelo_m2: 75 },
      40: { planos: 8000, modelo_m2: 85 },
      60: { planos: 9000, modelo_m2: 95 },
      80: { planos: 10000, modelo_m2: 105 },
      100: { planos: 11000, modelo_m2: 115 }
    }
  },
  sistema_dual_hormigon: {
    nombre: "Sistema Dual de Hormigón",
    max_niveles_zona1: 4,
    max_niveles_zona2: 6,
    tipos: {
      intermedia: {
        nombre: "Intermedia",
        irregularidad: {
          0: { planos_mamp: 6000, modelo_mamp_m2: 60, planos_portico: 0, modelo_portico_m2: 0 },
          20: { planos_mamp: 7000, modelo_mamp_m2: 70, planos_portico: 0, modelo_portico_m2: 0 },
          40: { planos_mamp: 8000, modelo_mamp_m2: 80, planos_portico: 0, modelo_portico_m2: 0 },
          60: { planos_mamp: 9000, modelo_mamp_m2: 90, planos_portico: 0, modelo_portico_m2: 0 },
          80: { planos_mamp: 10000, modelo_mamp_m2: 100, planos_portico: 0, modelo_portico_m2: 0 },
          100: { planos_mamp: 11000, modelo_mamp_m2: 110, planos_portico: 0, modelo_portico_m2: 0 }
        }
      },
      especial: {
        nombre: "Especial",
        irregularidad: {
          0: { planos_mamp: 6000, modelo_mamp_m2: 70, planos_portico: 0, modelo_portico_m2: 0 },
          20: { planos_mamp: 7000, modelo_mamp_m2: 80, planos_portico: 0, modelo_portico_m2: 0 },
          40: { planos_mamp: 8000, modelo_mamp_m2: 90, planos_portico: 0, modelo_portico_m2: 0 },
          60: { planos_mamp: 9000, modelo_mamp_m2: 100, planos_portico: 0, modelo_portico_m2: 0 },
          80: { planos_mamp: 10000, modelo_mamp_m2: 110, planos_portico: 0, modelo_portico_m2: 0 },
          100: { planos_mamp: 11000, modelo_mamp_m2: 120, planos_portico: 0, modelo_portico_m2: 0 }
        }
      }
    }
  },
  porticos_intermedios_acero: {
    nombre: "Pórticos Intermedios de Acero",
    zona_permitida: 2,
    max_niveles: 4,
    altura_max: 3,
    irregularidad: {
      0: { planos: 8000, modelo_m2: 80 },
      20: { planos: 9000, modelo_m2: 90 },
      40: { planos: 10000, modelo_m2: 100 },
      60: { planos: 10000, modelo_m2: 110 },
      80: { planos: 10000, modelo_m2: 120 },
      100: { planos: 10000, modelo_m2: 130 }
    }
  },
  porticos_especiales_acero: {
    nombre: "Pórticos Especiales de Acero",
    max_altura_zona1: 50,
    zona2_sin_limite: true,
    irregularidad: {
      0: { planos: 8000, modelo_m2: 90 },
      20: { planos: 9000, modelo_m2: 100 },
      40: { planos: 10000, modelo_m2: 110 },
      60: { planos: 10000, modelo_m2: 120 },
      80: { planos: 10000, modelo_m2: 130 },
      100: { planos: 10000, modelo_m2: 140 }
    }
  },
  sistema_dual_metalico: {
  nombre: "Sistema Dual Metálico",
  max_niveles_zona1: 4,
  max_niveles_zona2: 6,
  memoria_calculo: 20000, // Memoria de cálculo específica para este sistema
  planos_base: {
    0: 8000,
    20: 9000,
    40: 10000,
    60: 10000,
    80: 10000,
    100: 10000
  },
  tipos: {
    porticos_arriostramiento: {
      nombre: "Pórticos de Acero con Arriostramiento Excéntrico/Concéntrico",
      irregularidad: {
        0: { modelo_m2: 100 },
        20: { modelo_m2: 110 },
        40: { modelo_m2: 120 },
        60: { modelo_m2: 130 },
        80: { modelo_m2: 140 },
        100: { modelo_m2: 150 }
      }
    },
    muros_ordinarios: {
      nombre: "Muros Ordinarios de Hormigón Armado",
      irregularidad: {
        0: { modelo_m2: 110 },
        20: { modelo_m2: 120 },
        40: { modelo_m2: 130 },
        60: { modelo_m2: 140 },
        80: { modelo_m2: 150 },
        100: { modelo_m2: 160 }
      }
    },
    muros_especiales: {
      nombre: "Muros Especiales de Hormigón Armado",
      irregularidad: {
        0: { modelo_m2: 120 },
        20: { modelo_m2: 130 },
        40: { modelo_m2: 140 },
        60: { modelo_m2: 150 },
        80: { modelo_m2: 160 },
        100: { modelo_m2: 170 }
      }
    }
  }
}
};