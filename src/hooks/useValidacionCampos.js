import { useMemo } from 'react';
import { sistemas as sistemasBase } from '../systems';

export function useValidacionCampos(sistemaSeleccionado, datosProyecto, sistemasConOverrides) {
  return useMemo(() => {
    const camposVacios = {};

    if (!sistemaSeleccionado) {
      return { todosCompletos: false, camposVacios };
    }

    const sistemasActivos = sistemasConOverrides || sistemasBase;
    const sistema = sistemasActivos[sistemaSeleccionado];
    if (!sistema) {
      return { todosCompletos: false, camposVacios };
    }

    const niveles = parseInt(datosProyecto.niveles) || 0;

    if (!datosProyecto.niveles || niveles === 0) {
      camposVacios.niveles = 'Debe ingresar el número de niveles';
    }

    if (niveles > 0) {
      for (let i = 1; i <= niveles; i++) {
        const area = datosProyecto.areasNiveles[i];
        if (!area || parseFloat(area) === 0) {
          camposVacios[`area-${i}`] = 'Requerido';
        }
      }
    }

    if (sistema.requiereAltura && niveles > 0) {
      for (let i = 1; i <= niveles; i++) {
        const altura = datosProyecto.alturasNiveles?.[i];
        if (!altura || parseFloat(altura) === 0) {
          camposVacios[`altura-${i}`] = 'Requerido';
        }
      }
    }

    if (!datosProyecto.irregularidad && datosProyecto.irregularidad !== '0') {
      camposVacios.irregularidad = 'Debe seleccionar la irregularidad';
    }

    if (!datosProyecto.numPlanchas || parseInt(datosProyecto.numPlanchas) === 0) {
      camposVacios.numPlanchas = 'Debe ingresar el número de planchas';
    }

    if (sistema.requiereZona && !datosProyecto.zona) {
      camposVacios.zona = 'Debe seleccionar la zona sísmica';
    }

    const todosCompletos = Object.keys(camposVacios).length === 0;

    return { todosCompletos, camposVacios };
  }, [sistemaSeleccionado, datosProyecto, sistemasConOverrides]);
}