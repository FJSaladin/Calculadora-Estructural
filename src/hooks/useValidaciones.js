import { useMemo } from 'react';

export function useValidaciones(sistemaSeleccionado, datosProyecto) {
  return useMemo(() => {
    const errores = [];
    const advertencias = [];

    if (!sistemaSeleccionado) return { errores, advertencias, valido: true };

    const niveles = parseInt(datosProyecto.niveles);
    const irregularidad = parseFloat(datosProyecto.irregularidad);
    const zona = parseInt(datosProyecto.zona);

    // Validación de mampostería
    if (sistemaSeleccionado === 'mamposteria_formaleta') {
      if (niveles > 5) {
        errores.push(`Mampostería con formaleta limitada a 5 niveles máximo. Actual: ${niveles}`);
      }
      if (irregularidad >= 40) {
        advertencias.push('Irregularidad ≥40% incrementa categoría de tamaño del proyecto');
      }
    }

    // Validación pórticos intermedios hormigón
    if (sistemaSeleccionado === 'porticos_intermedios_hormigon') {
      if (niveles > 12) {
        errores.push(`Pórticos intermedios de hormigón limitados a 12 niveles. Actual: ${niveles}`);
      }
    }

    // Validación sistema dual hormigón
// Validación sistema dual hormigón
    if (sistemaSeleccionado === 'sistema_dual_hormigon') {
      const maxNiveles = zona === 1 ? 4 : 6;
      if (niveles > maxNiveles) {
        errores.push(`Sistema dual en zona ${zona} limitado a ${maxNiveles} niveles. Actual: ${niveles}`);
      }
    }

    // AGREGAR ESTE BLOQUE NUEVO
    // Validación sistema dual metálico
    if (sistemaSeleccionado === 'sistema_dual_metalico') {
      const maxNiveles = zona === 1 ? 4 : 6;
      if (niveles > maxNiveles) {
        errores.push(`Sistema dual metálico en zona ${zona} limitado a ${maxNiveles} niveles. Actual: ${niveles}`);
      }
    }

    // Validación pórticos intermedios acero
    if (sistemaSeleccionado === 'porticos_intermedios_acero') {
      if (zona !== 2) {
        errores.push('Pórticos intermedios de acero solo permitidos en zona 2');
      }
      if (niveles > 4) {
        errores.push(`Pórticos intermedios de acero limitados a 4 niveles. Actual: ${niveles}`);
      }
      
      // Validar altura por nivel (máximo 3m cada uno)
      if (datosProyecto.alturasNiveles) {
        Object.entries(datosProyecto.alturasNiveles).forEach(([nivel, altura]) => {
          const alturaNum = parseFloat(altura);
          if (alturaNum > 3) {
            errores.push(`Nivel ${nivel}: altura máxima es 3m. Actual: ${alturaNum}m`);
          }
        });
      }
    }

    // Validación pórticos especiales acero
    if (sistemaSeleccionado === 'porticos_especiales_acero') {
      // Calcular altura total
      let alturaTotal = 0;
      if (datosProyecto.alturasNiveles) {
        alturaTotal = Object.values(datosProyecto.alturasNiveles).reduce((sum, altura) => {
          return sum + (parseFloat(altura) || 0);
        }, 0);
      }

      if (zona === 1 && alturaTotal > 50) {
        errores.push(`En zona 1, altura total máxima es 50m. Altura actual: ${alturaTotal.toFixed(2)}m`);
      }
    }

    // Validación de irregularidad
    if (irregularidad < 0 || irregularidad > 100) {
      errores.push('Irregularidad debe estar entre 0% y 100%');
    }

    return {
      errores,
      advertencias,
      valido: errores.length === 0
    };
  }, [sistemaSeleccionado, datosProyecto]);
}