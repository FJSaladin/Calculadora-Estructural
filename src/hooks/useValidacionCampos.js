import { useMemo } from 'react';

export function useValidacionCampos(sistemaSeleccionado, datosProyecto) {
  return useMemo(() => {
    const camposVacios = {};
    
    if (!sistemaSeleccionado) {
      return { todosCompletos: false, camposVacios };
    }

    const niveles = parseInt(datosProyecto.niveles) || 0;
    
    // Validar número de niveles
    if (!datosProyecto.niveles || niveles === 0) {
      camposVacios.niveles = 'Debe ingresar el número de niveles';
    }
    
    // Validar áreas por nivel
    if (niveles > 0) {
      for (let i = 1; i <= niveles; i++) {
        const area = datosProyecto.areasNiveles[i];
        if (!area || parseFloat(area) === 0) {
          camposVacios[`area-${i}`] = 'Requerido';
        }
      }
    }
    
    // Validar alturas por nivel (si aplica)
    const requiereAltura = sistemaSeleccionado === 'porticos_intermedios_acero' || 
                           sistemaSeleccionado === 'porticos_especiales_acero';
    
    if (requiereAltura && niveles > 0) {
      for (let i = 1; i <= niveles; i++) {
        const altura = datosProyecto.alturasNiveles?.[i];
        if (!altura || parseFloat(altura) === 0) {
          camposVacios[`altura-${i}`] = 'Requerido';
        }
      }
    }
    
    // Validar irregularidad
    if (!datosProyecto.irregularidad && datosProyecto.irregularidad !== '0') {
      camposVacios.irregularidad = 'Debe seleccionar la irregularidad';
    }
    
    // Validar número de planchas
    if (!datosProyecto.numPlanchas || parseInt(datosProyecto.numPlanchas) === 0) {
      camposVacios.numPlanchas = 'Debe ingresar el número de planchas';
    }
    
    // Validar zona sísmica (si aplica)
    const requiereZona = sistemaSeleccionado === 'sistema_dual_hormigon' || 
                         sistemaSeleccionado === 'sistema_dual_metalico' ||
                         sistemaSeleccionado === 'porticos_intermedios_acero' ||
                         sistemaSeleccionado === 'porticos_especiales_acero';
    
    if (requiereZona && !datosProyecto.zona) {
      camposVacios.zona = 'Debe seleccionar la zona sísmica';
    }
    
    const todosCompletos = Object.keys(camposVacios).length === 0;
    
    return { todosCompletos, camposVacios };
  }, [sistemaSeleccionado, datosProyecto]);
}