import React, { useRef } from 'react';
import { Building2, AlertTriangle } from 'lucide-react';
import { calcularAreaTotal } from '../../utils/helpers';
import { tarifas } from '../../data/tarifas';
import CamposNiveles from './CamposNiveles';

function DatosProyecto({ 
  sistemaSeleccionado, 
  datosProyecto, 
  setDatosProyecto, 
  validacionCampos  
}) {
  const inputRefs = useRef({});

  const areaTotal = calcularAreaTotal(datosProyecto.areasNiveles);
  const niveles = parseInt(datosProyecto.niveles) || 0;

  // Calcular altura total para sistemas de acero
  const alturaTotal = React.useMemo(() => {
    if (!datosProyecto.alturasNiveles) return 0;
    return Object.values(datosProyecto.alturasNiveles).reduce((sum, altura) => {
      return sum + (parseFloat(altura) || 0);
    }, 0);
  }, [datosProyecto.alturasNiveles]);

  // Función para manejar Enter y avanzar al siguiente campo
  const handleKeyDown = (e, currentKey, nextKey) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (nextKey && inputRefs.current[nextKey]) {
        inputRefs.current[nextKey].focus();
      }
    }
  };

  // Determinar límite de niveles según sistema y zona
  const obtenerLimiteNiveles = () => {
    if (!sistemaSeleccionado) return null;
    
    const zona = parseInt(datosProyecto.zona) || 1;
    
    switch(sistemaSeleccionado) {
      case 'mamposteria_formaleta':
        return { max: 5, mensaje: 'Mampostería con formaleta está limitada a 5 niveles máximo' };
      
      case 'porticos_intermedios_hormigon':
        return { max: 12, mensaje: 'Pórticos intermedios de hormigón están limitados a 12 niveles máximo' };
      
      case 'porticos_especiales_hormigon':
        return null; // Sin límite
      
      case 'sistema_dual_hormigon':
        const maxDualHormigon = zona === 1 ? 4 : 6;
        return { 
          max: maxDualHormigon, 
          mensaje: `Sistema dual de hormigón en zona ${zona} está limitado a ${maxDualHormigon} niveles máximo` 
        };
      
      case 'porticos_intermedios_acero':
        return { max: 4, mensaje: 'Pórticos intermedios de acero están limitados a 4 niveles máximo' };
      
      case 'porticos_especiales_acero':
        return null; // Sin límite de niveles en ambas zonas 
      
      case 'sistema_dual_metalico':
        const maxDualMetalico = zona === 1 ? 4 : 6;
        return { 
          max: maxDualMetalico, 
          mensaje: `Sistema dual metálico en zona ${zona} está limitado a ${maxDualMetalico} niveles máximo` 
        };
      
      default:
        return null;
    }
  };

  // Validación de zona sísmica
  const obtenerErrorZona = () => {
    if (!datosProyecto.zona || !sistemaSeleccionado) return null;
    
    const zona = parseInt(datosProyecto.zona);
    
    if (sistemaSeleccionado === 'porticos_intermedios_acero' && zona !== 2) {
      return 'Pórticos intermedios de acero solo permitidos en zona 2';
    }

    // Especiales de acero se permiten en AMBAS zonas
    // zona 1 tiene límite de 50m (se valida por altura, no por zona)
    // zona 2 no tiene límite
    
    return null;
  };

  // Calcular altura acumulada hasta un nivel específico
  const calcularAlturaAcumulada = (hastaNivel) => {
    let suma = 0;
    for (let i = 1; i <= hastaNivel; i++) {
      const altura = parseFloat(datosProyecto.alturasNiveles?.[i]);
      if (altura) {
        suma += altura;
      }
    }
    return suma;
  };

  // Determinar si se excedió el límite de altura y en qué nivel
  const obtenerEstadoAltura = () => {
    const zona = parseInt(datosProyecto.zona) || 1;
    
    // Caso 1: Pórticos especiales de acero - límite de altura total (50m en zona 1)
    if (sistemaSeleccionado === 'porticos_especiales_acero' && zona === 1) {
      const LIMITE_TOTAL = 50;
      
      for (let i = 1; i <= niveles; i++) {
        const alturaAcum = calcularAlturaAcumulada(i);
        if (alturaAcum > LIMITE_TOTAL) {
          return { 
            excedido: true, 
            nivelExcedido: i, 
            alturaAcum,
            tipo: 'total',
            limite: LIMITE_TOTAL
          };
        }
      }
    }
    
    // Caso 2: Pórticos intermedios de acero - límite por nivel individual (3m cada uno)
    if (sistemaSeleccionado === 'porticos_intermedios_acero') {
      const LIMITE_INDIVIDUAL = 3;
      
      for (let i = 1; i <= niveles; i++) {
        const altura = parseFloat(datosProyecto.alturasNiveles?.[i]);
        if (altura && altura > LIMITE_INDIVIDUAL) {
          return { 
            excedido: true, 
            nivelExcedido: i, 
            alturaIndividual: altura,
            tipo: 'individual',
            limite: LIMITE_INDIVIDUAL
          };
        }
      }
    }
    
    return { excedido: false, nivelExcedido: null, tipo: null };
  };

  // Determinar si un campo de altura debe estar deshabilitado
  const debeDeshabilitarAltura = (nivel) => {
    if (!estadoAltura.excedido) return false;
    
    // Deshabilitar niveles posteriores al que excedió el límite
    // y que aún no tienen valor
    if (nivel > estadoAltura.nivelExcedido) {
      const tieneValor = datosProyecto.alturasNiveles?.[nivel];
      return !tieneValor || tieneValor === '';
    }
    
    return false;
  };

  // Validar que el valor sea un número positivo válido
  const validarNumeroPositivo = (valor) => {
    if (valor === '') return '';
    const num = parseFloat(valor);
    if (isNaN(num) || num < 0) return '';
    return valor;
  };

  const limiteNiveles = obtenerLimiteNiveles();
  const excedeLimite = limiteNiveles && niveles > limiteNiveles.max;
  const errorZona = obtenerErrorZona();
  const estadoAltura = obtenerEstadoAltura();

  // Generar la secuencia de campos para navegación
  const generarSecuenciaCampos = () => {
    const secuencia = ['niveles'];
    
    if (niveles > 0 && !excedeLimite) {
      for (let i = 1; i <= niveles; i++) {
        secuencia.push(`area-${i}`);
        if (requiereAlturaPorNivel) {
          secuencia.push(`altura-${i}`);
        }
      }
    }
    
    secuencia.push('irregularidad', 'numPlanchas');
    
    if (sistemaSeleccionado === 'sistema_dual_hormigon' || 
        sistemaSeleccionado === 'sistema_dual_metalico' ||
        sistemaSeleccionado === 'porticos_intermedios_acero' ||
        sistemaSeleccionado === 'porticos_especiales_acero') {
      secuencia.push('zona');
    }
    
    if (sistemaSeleccionado === 'sistema_dual_hormigon') {
      secuencia.push('tipoDual');
    }
    
    if (sistemaSeleccionado === 'sistema_dual_metalico') {
      secuencia.push('tipoMetalico');
    }
    
    return secuencia;
  };

  const obtenerSiguienteCampo = (currentKey) => {
    const secuencia = generarSecuenciaCampos();
    const currentIndex = secuencia.indexOf(currentKey);
    if (currentIndex >= 0 && currentIndex < secuencia.length - 1) {
      return secuencia[currentIndex + 1];
    }
    return null;
  };

  const handleNivelesChange = (valor) => {
    const valorValidado = validarNumeroPositivo(valor);
    const nivelesNum = parseInt(valorValidado) || 0;
    
    setDatosProyecto(prev => {
      const nuevasAreas = {};
      const nuevasAlturas = {};
      
      // Solo crear campos si no excede el límite
      if (!limiteNiveles || nivelesNum <= limiteNiveles.max) {
        for (let i = 1; i <= nivelesNum; i++) {
          nuevasAreas[i] = prev.areasNiveles[i] || '';
          nuevasAlturas[i] = prev.alturasNiveles?.[i] || '';
        }
      }
      
      return {
        ...prev,
        niveles: valorValidado,
        areasNiveles: nuevasAreas,
        alturasNiveles: nuevasAlturas
      };
    });
  };

  const handleAreaNivelChange = (nivel, valor) => {
    const valorValidado = validarNumeroPositivo(valor);
    setDatosProyecto(prev => ({
      ...prev,
      areasNiveles: {
        ...prev.areasNiveles,
        [nivel]: valorValidado
      }
    }));
  };

  const handleAlturaNivelChange = (nivel, valor) => {
    const valorValidado = validarNumeroPositivo(valor);
    setDatosProyecto(prev => ({
      ...prev,
      alturasNiveles: {
        ...prev.alturasNiveles,
        [nivel]: valorValidado
      }
    }));
  };

  const handleDatosChange = (campo, valor) => {
    // Validar solo campos numéricos
    if (campo === 'numPlanchas') {
      valor = validarNumeroPositivo(valor);
    }
    setDatosProyecto(prev => ({ ...prev, [campo]: valor }));
  };

  // Verificar si el sistema requiere altura por nivel
  const requiereAlturaPorNivel = sistemaSeleccionado === 'porticos_intermedios_acero' || 
                                  sistemaSeleccionado === 'porticos_especiales_acero';

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <Building2 className="w-5 h-5" />
        Datos del Proyecto
      </h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Número de niveles
          </label>
          <input
            type="number"
            ref={(el) => inputRefs.current['niveles'] = el}
            value={datosProyecto.niveles}
            onChange={(e) => handleNivelesChange(e.target.value)}
            onKeyDown={(e) => handleKeyDown(e, 'niveles', obtenerSiguienteCampo('niveles'))}
            className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 ${
              excedeLimite ? 'border-red-500 bg-red-50' : 'border-gray-300'
            }`}
            placeholder="Ej: 3"
            min="1"
          />
          {validacionCampos?.camposVacios.niveles && (
  <p className="text-xs text-red-600 mt-1">
    {validacionCampos.camposVacios.niveles}
  </p>
)}
          {limiteNiveles && (
            <p className="text-xs text-gray-500 mt-1">
              Máximo permitido: {limiteNiveles.max} niveles
            </p>
          )}
        </div>

        {/* Alerta si excede el límite */}
        {excedeLimite && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-red-700">
                  Límite de niveles excedido
                </p>
                <p className="text-sm text-red-600 mt-1">
                  {limiteNiveles.mensaje}
                </p>
                
              </div>
            </div>
          </div>
        )}

        {/* Solo mostrar campos si no excede el límite */}
        {niveles > 0 && !excedeLimite && (
          <CamposNiveles
            niveles={niveles}
            sistemaSeleccionado={sistemaSeleccionado}
            datosProyecto={datosProyecto}
            validacionCampos={validacionCampos}
            estadoAltura={estadoAltura}
            requiereAlturaPorNivel={requiereAlturaPorNivel}
            areaTotal={areaTotal}
            alturaTotal={alturaTotal}
            inputRefs={inputRefs}
            obtenerSiguienteCampo={obtenerSiguienteCampo}
            handleAreaNivelChange={handleAreaNivelChange}
            handleAlturaNivelChange={handleAlturaNivelChange}
            debeDeshabilitarAltura={debeDeshabilitarAltura}
          />
        )}

        
<div>
  <label className="block text-sm font-medium text-gray-700 mb-1">
    Irregularidad
  </label>
  <select
    ref={(el) => inputRefs.current['irregularidad'] = el}
    value={datosProyecto.irregularidad}
    onChange={(e) => handleDatosChange('irregularidad', e.target.value)}
    onKeyDown={(e) => handleKeyDown(e, 'irregularidad', obtenerSiguienteCampo('irregularidad'))}
    className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 ${
      validacionCampos?.camposVacios.irregularidad
        ? 'border-red-400 bg-red-50'
        : 'border-gray-300'
    }`}
  >
    <option value="">Seleccione...</option>
    
    {/* Opciones específicas para Mampostería */}
    {sistemaSeleccionado === 'mamposteria_formaleta' ? (
  <>
    <option value="0">0% - Sin irregularidad</option>
    <option value="40">1% - 40% - Irregularidad baja a moderada</option>
    <option value="100">Mayor a 40% - Irregularidad alta</option>
  </>
    ) : (
      /* Opciones para otros sistemas */
      <>
        <option value="0">0% - Regular</option>
        <option value="20">20% - Irregularidad baja</option>
        <option value="40">40% - Irregularidad moderada</option>
        <option value="60">60% - Irregularidad alta</option>
        <option value="80">80% - Irregularidad muy alta</option>
        <option value="100">100% - Irregularidad máxima</option>
      </>
    )}
  </select>
  
  {validacionCampos?.camposVacios.irregularidad && (
    <p className="text-xs text-red-600 mt-1">
      {validacionCampos.camposVacios.irregularidad}
    </p>
  )}
  {datosProyecto.irregularidad >= 40 && !validacionCampos?.camposVacios.irregularidad && (
    <p className="text-sm text-amber-600 mt-1">
      ⚠️ Irregularidad ≥40% eleva el tamaño del proyecto en la gestión del MIVED
    </p>
  )}
</div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Número de planchas estimadas
          </label>
          <input
            type="number"
            ref={(el) => inputRefs.current['numPlanchas'] = el}
            value={datosProyecto.numPlanchas}
            onChange={(e) => handleDatosChange('numPlanchas', e.target.value)}
            onKeyDown={(e) => handleKeyDown(e, 'numPlanchas', obtenerSiguienteCampo('numPlanchas'))}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            placeholder="Ej: 8"
            min="0"
          />
          {validacionCampos?.camposVacios.numPlanchas && (
  <p className="text-xs text-red-600 mt-1">
    {validacionCampos.camposVacios.numPlanchas}
  </p>
)}
        </div>

        {(sistemaSeleccionado === 'sistema_dual_hormigon' || 
          sistemaSeleccionado === 'sistema_dual_metalico' ||
          sistemaSeleccionado === 'porticos_intermedios_acero' ||
          sistemaSeleccionado === 'porticos_especiales_acero') && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Zona sísmica
            </label>
            <select
              ref={(el) => inputRefs.current['zona'] = el}
              value={datosProyecto.zona}
              onChange={(e) => handleDatosChange('zona', e.target.value)}
              onKeyDown={(e) => handleKeyDown(e, 'zona', obtenerSiguienteCampo('zona'))}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            >
              <option value="1">Zona 1</option>
              <option value="2">Zona 2</option>
            </select>
            {validacionCampos?.camposVacios.zona && (
  <p className="text-xs text-red-600 mt-1">
    {validacionCampos.camposVacios.zona}
  </p>
)}
            {errorZona && (
              <div className="mt-2 text-sm text-red-600 flex items-start gap-1">
                <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>{errorZona}</span>
              </div>
            )}
          </div>
        )}

        {sistemaSeleccionado === 'sistema_dual_hormigon' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tipo de sistema dual
            </label>
            <select
              ref={(el) => inputRefs.current['tipoDual'] = el}
              value={datosProyecto.tipoDual}
              onChange={(e) => handleDatosChange('tipoDual', e.target.value)}
              onKeyDown={(e) => handleKeyDown(e, 'tipoDual', obtenerSiguienteCampo('tipoDual'))}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            >
              <option value="intermedia">Intermedia</option>
              <option value="especial">Especial</option>
            </select>
          </div>
        )}

        {sistemaSeleccionado === 'sistema_dual_metalico' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tipo de sistema dual metálico
            </label>
            <select
              ref={(el) => inputRefs.current['tipoMetalico'] = el}
              value={datosProyecto.tipoMetalico}
              onChange={(e) => handleDatosChange('tipoMetalico', e.target.value)}
              onKeyDown={(e) => handleKeyDown(e, 'tipoMetalico', obtenerSiguienteCampo('tipoMetalico'))}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            >
              <option value="porticos_arriostramiento">
                Pórticos de Acero con Arriostramiento
              </option>
              <option value="muros_ordinarios">
                Muros Ordinarios de Hormigón Armado
              </option>
              <option value="muros_especiales">
                Muros Especiales de Hormigón Armado
              </option>
            </select>
          </div>
        )}
      </div>
    </div>
  );
}

export default DatosProyecto;