import { useMemo } from 'react';
import { sistemas as sistemasBase } from '../systems';

export function useValidaciones(sistemaSeleccionado, datosProyecto, sistemasConOverrides) {
  return useMemo(() => {
    if (!sistemaSeleccionado) {
      return { errores: [], advertencias: [], valido: true };
    }

    const sistemasActivos = sistemasConOverrides || sistemasBase;
    const sistema = sistemasActivos[sistemaSeleccionado];
    if (!sistema) {
      return { errores: [], advertencias: [], valido: true };
    }

    const errores     = sistema.validar(datosProyecto);
    const advertencias = sistema.advertencias(datosProyecto);

    return {
      errores,
      advertencias,
      valido: errores.length === 0
    };
  }, [sistemaSeleccionado, datosProyecto, sistemasConOverrides]);
}