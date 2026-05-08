import { useMemo } from 'react';
import { sistemas as sistemasBase } from '../systems';
import { calcularAreaTotal } from '../utils/helpers';

function determinarTamanoProyecto(area, irregularidad) {
  let tamanoBase;

  if (area < 300)        tamanoBase = 'PEQUEÑO';
  else if (area < 500)   tamanoBase = 'PEQUEÑO MEDIANO';
  else if (area < 1000)  tamanoBase = 'MEDIANO';
  else if (area < 1500)  tamanoBase = 'MEDIANO GRANDE';
  else if (area < 2500)  tamanoBase = 'GRANDE';
  else                   tamanoBase = 'MEGA';

  if (irregularidad >= 40) {
    const elevaciones = {
      'PEQUEÑO':         'PEQUEÑO MEDIANO',
      'PEQUEÑO MEDIANO': 'MEDIANO',
      'MEDIANO':         'MEDIANO GRANDE',
      'MEDIANO GRANDE':  'GRANDE',
      'GRANDE':          'MEGA',
      'MEGA':            'MEGA',
    };
    return elevaciones[tamanoBase];
  }

  return tamanoBase;
}

function calcularGestionDictamen(tamano) {
  const costos = {
    'PEQUEÑO':         20000,
    'PEQUEÑO MEDIANO': 30000,
    'MEDIANO':         40000,
    'MEDIANO GRANDE':  50000,
    'GRANDE':          60000,
    'MEGA':            100000,
  };
  return costos[tamano] || 20000;
}

/**
 * @param sistemasConOverrides - objeto sistemas con tarifas ya aplicadas.
 *   Si no se pasa, cae al objeto estático original (compatibilidad hacia atrás).
 */
export function useCalculos(sistemaSeleccionado, datosProyecto, gestionMIVED, esValido, sistemasConOverrides) {
  return useMemo(() => {
    if (!sistemaSeleccionado || !esValido) return null;

    // Usa overrides si se pasan, si no el objeto base (compatibilidad)
    const sistemasActivos = sistemasConOverrides || sistemasBase;
    const sistema = sistemasActivos[sistemaSeleccionado];
    if (!sistema) return null;

    const areaTotal = calcularAreaTotal(datosProyecto.areasNiveles);
    if (areaTotal === 0) return null;

    const irregularidad = parseInt(datosProyecto.irregularidad) || 0;
    const tamanoProyecto = determinarTamanoProyecto(areaTotal, irregularidad);

    // Cálculo delegado al sistema (con tarifas modificadas)
    const detalles = sistema.calcular(datosProyecto, areaTotal);

    // Servicios MIVED
    if (gestionMIVED) {
      // memoriaCalculo también puede ser override
      const costoMemoria = sistema.memoriaCalculo || 15000;
      detalles.push({
        concepto: 'Memoria de cálculo',
        detalle: 'Servicio MIVED',
        monto: costoMemoria
      });

      const costoGestion = calcularGestionDictamen(tamanoProyecto);
      detalles.push({
        concepto: 'Gestión por dictamen',
        detalle: `Proyecto ${tamanoProyecto} (${areaTotal.toFixed(2)}m², Irreg: ${irregularidad}%)`,
        monto: costoGestion
      });
    }

    const subtotal = detalles.reduce((sum, item) => sum + item.monto, 0);

    return {
      detalles,
      subtotal,
      tamanoProyecto,
    };
  }, [sistemaSeleccionado, datosProyecto, gestionMIVED, esValido, sistemasConOverrides]);
}