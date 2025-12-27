import { useMemo } from 'react';
import { tarifas } from '../data/tarifas';
import { calcularAreaTotal, encontrarIrregularidad } from '../utils/helpers';

// Función para determinar tamaño del proyecto según área y irregularidad
// Función para determinar tamaño del proyecto según área y irregularidad
function determinarTamanoProyecto(area, irregularidad) {
  let tamanoBase;
  
  // Determinar tamaño base según área
  if (area < 300) tamanoBase = "PEQUEÑO";
  else if (area < 500) tamanoBase = "PEQUEÑO MEDIANO";
  else if (area < 1000) tamanoBase = "MEDIANO";
  else if (area < 1500) tamanoBase = "MEDIANO GRANDE";
  else if (area < 2500) tamanoBase = "GRANDE";
  else tamanoBase = "MEGA";

  // Aplicar regla de elevación si irregularidad >= 40%
  if (irregularidad >= 40) {
    const elevaciones = {
      "PEQUEÑO": "PEQUEÑO MEDIANO",
      "PEQUEÑO MEDIANO": "MEDIANO",
      "MEDIANO": "MEDIANO GRANDE",
      "MEDIANO GRANDE": "GRANDE",
      "GRANDE": "MEGA",
      "MEGA": "MEGA"
    };
    const tamanoElevado = elevaciones[tamanoBase];
    console.log(`Elevación aplicada: ${tamanoBase} → ${tamanoElevado} (Área: ${area}m², Irregularidad: ${irregularidad}%)`);
    return tamanoElevado;
  }
  
  console.log(`Sin elevación: ${tamanoBase} (Área: ${area}m², Irregularidad: ${irregularidad}%)`);
  return tamanoBase;
}

// Función para calcular costo de gestión por dictamen
function calcularGestionDictamen(tamanoProyecto) {
  const costos = {
    "PEQUEÑO": 20000,
    "PEQUEÑO MEDIANO": 30000,
    "MEDIANO": 40000,
    "MEDIANO GRANDE": 50000,
    "GRANDE": 60000,
    "MEGA": 100000
  };
  
  return costos[tamanoProyecto] || 20000;
}

export function useCalculos(sistemaSeleccionado, datosProyecto, gestionMIVE, esValido) {
  return useMemo(() => {
    const areaTotal = calcularAreaTotal(datosProyecto.areasNiveles);
    
    if (!sistemaSeleccionado || !esValido || areaTotal === 0) {
      return null;
    }

    // Ahora irregularidad siempre será un valor exacto (0, 20, 40, 60, 80, 100)
    const irregularidad = parseInt(datosProyecto.irregularidad) || 0;
    const numPlanchas = parseInt(datosProyecto.numPlanchas) || 1;
    
    // Determinar tamaño del proyecto
    const tamanoProyecto = determinarTamanoProyecto(areaTotal, irregularidad);
    
    let resultado = {
      precioBase: 0,
      planosPorPlancha: 0,
      totalPlanos: 0,
      modeloComputacional: 0,
      memoria: 0,
      gestionDictamen: 0,
      subtotal: 0,
      detalles: [],
      tamanoProyecto: tamanoProyecto
    };

    // Cálculo según sistema
    if (sistemaSeleccionado === 'mamposteria_formaleta') {
      const config = tarifas.mamposteria_formaleta.irregularidad[irregularidad];
      
      // Planos
      resultado.totalPlanos = config.planos * numPlanchas;
      resultado.detalles.push({
        concepto: 'Planos',
        detalle: `${config.planos} × ${numPlanchas} planchas (Irregularidad: ${irregularidad}%)`,
        monto: resultado.totalPlanos
      });

      // Modelo computacional
      resultado.modeloComputacional = areaTotal * config.modelo_m2;
      resultado.detalles.push({
        concepto: 'Modelo computacional',
        detalle: `${areaTotal.toFixed(2)}m² × ${config.modelo_m2}`,
        monto: resultado.modeloComputacional
      });
    }

    else if (sistemaSeleccionado === 'porticos_intermedios_hormigon' || 
             sistemaSeleccionado === 'porticos_especiales_hormigon') {
      const config = tarifas[sistemaSeleccionado].irregularidad[irregularidad];
      
      resultado.totalPlanos = config.planos * numPlanchas;
      resultado.detalles.push({
        concepto: 'Planos',
        detalle: `${config.planos} × ${numPlanchas} planchas (Irregularidad: ${irregularidad}%)`,
        monto: resultado.totalPlanos
      });

      resultado.modeloComputacional = areaTotal * config.modelo_m2;
      resultado.detalles.push({
        concepto: 'Modelo computacional',
        detalle: `${areaTotal.toFixed(2)}m² × ${config.modelo_m2}`,
        monto: resultado.modeloComputacional
      });
    }

    else if (sistemaSeleccionado === 'sistema_dual_hormigon') {
      const tipoDual = datosProyecto.tipoDual || 'intermedia';
      const config = tarifas.sistema_dual_hormigon.tipos[tipoDual].irregularidad[irregularidad];
      
      // Solo planos de mampostería (según la tabla, pórtico es 0)
      const planosMamp = config.planos_mamp * numPlanchas;
      resultado.totalPlanos = planosMamp;
      
      resultado.detalles.push({
        concepto: 'Planos estructurales',
        detalle: `${config.planos_mamp} × ${numPlanchas} planchas (${tarifas.sistema_dual_hormigon.tipos[tipoDual].nombre})`,
        monto: planosMamp
      });

      // Modelo computacional mampostería
      const modeloMamp = areaTotal * config.modelo_mamp_m2;
      resultado.modeloComputacional = modeloMamp;
      
      resultado.detalles.push({
        concepto: 'Modelo computacional',
        detalle: `${areaTotal.toFixed(2)}m² × ${config.modelo_mamp_m2} (${tarifas.sistema_dual_hormigon.tipos[tipoDual].nombre})`,
        monto: modeloMamp
      });
    }

    else if (sistemaSeleccionado === 'porticos_intermedios_acero' || 
             sistemaSeleccionado === 'porticos_especiales_acero') {
      const config = tarifas[sistemaSeleccionado].irregularidad[irregularidad];
      
      resultado.totalPlanos = config.planos * numPlanchas;
      resultado.detalles.push({
        concepto: 'Planos',
        detalle: `${config.planos} × ${numPlanchas} planchas (Irregularidad: ${irregularidad}%)`,
        monto: resultado.totalPlanos
      });

      resultado.modeloComputacional = areaTotal * config.modelo_m2;
      resultado.detalles.push({
        concepto: 'Modelo computacional',
        detalle: `${areaTotal.toFixed(2)}m² × ${config.modelo_m2}`,
        monto: resultado.modeloComputacional
      });
    }

    else if (sistemaSeleccionado === 'sistema_dual_metalico') {
      const tipoMetalico = datosProyecto.tipoMetalico || 'porticos_arriostramiento';
      const config = tarifas.sistema_dual_metalico.tipos[tipoMetalico].irregularidad[irregularidad];
      
      // Planos según irregularidad
      const planosBase = tarifas.sistema_dual_metalico.planos_base[irregularidad];
      resultado.totalPlanos = planosBase * numPlanchas;
      resultado.detalles.push({
        concepto: 'Planos estructurales',
        detalle: `${planosBase} × ${numPlanchas} planchas (Irregularidad: ${irregularidad}%)`,
        monto: resultado.totalPlanos
      });
      
      // Modelo computacional según tipo
      resultado.modeloComputacional = areaTotal * config.modelo_m2;
      resultado.detalles.push({
        concepto: 'Modelo computacional',
        detalle: `${areaTotal.toFixed(2)}m² × ${config.modelo_m2} (${tarifas.sistema_dual_metalico.tipos[tipoMetalico].nombre})`,
        monto: resultado.modeloComputacional
      });
    }

    // Gestión del MIVE
    if (gestionMIVE) {
      // Memoria de cálculo (20,000 para sistema dual metálico, 15,000 para el resto)
      const costoMemoria = sistemaSeleccionado === 'sistema_dual_metalico' ? 20000 : 15000;
      resultado.memoria = costoMemoria;
      resultado.detalles.push({
        concepto: 'Memoria de cálculo',
        detalle: '',
        monto: costoMemoria
      });

      // Gestión por dictamen (según tamaño del proyecto)
      resultado.gestionDictamen = calcularGestionDictamen(tamanoProyecto);
      resultado.detalles.push({
        concepto: 'Gestión por dictamen',
        detalle: `Proyecto ${tamanoProyecto} (${areaTotal.toFixed(2)}m², Irreg: ${irregularidad}%)`,
        monto: resultado.gestionDictamen
      });
    }

    // Total
    resultado.subtotal = resultado.precioBase + resultado.totalPlanos + 
                        resultado.modeloComputacional + resultado.memoria + 
                        resultado.gestionDictamen;

    return resultado;
  }, [sistemaSeleccionado, datosProyecto, gestionMIVE, esValido]);
}