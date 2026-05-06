import { useMemo } from 'react';
import { sistemas } from '../systems';

export function useValidaciones(sistemaSeleccionado, datosProyecto) {
  return useMemo(() => {
    if (!sistemaSeleccionado) {
      return { errores: [], advertencias: [], valido: true };
    }

    const sistema = sistemas[sistemaSeleccionado];
    if (!sistema) {
      return { errores: [], advertencias: [], valido: true };
    }

    const errores = sistema.validar(datosProyecto);
    const advertencias = sistema.advertencias(datosProyecto);

    return {
      errores,
      advertencias,
      valido: errores.length === 0
    };
  }, [sistemaSeleccionado, datosProyecto]);
}