import React, { useRef } from 'react';
import { Building2, AlertTriangle } from 'lucide-react';
import { calcularAreaTotal } from '../../utils/helpers';
import { sistemas as sistemasBase } from '../../systems';
import CamposNiveles from './CamposNiveles';

function DatosProyecto({
  sistemaSeleccionado,
  datosProyecto,
  setDatosProyecto,
  validacionCampos,
  sistemas: sistemasConOverrides, // ← recibe el objeto con overrides
}) {
  const inputRefs = useRef({});

  // Usa overrides si disponible, si no el base
  const sistemasActivos = sistemasConOverrides || sistemasBase;
  const sistema = sistemasActivos[sistemaSeleccionado];

  const areaTotal = calcularAreaTotal(datosProyecto.areasNiveles);
  const niveles = parseInt(datosProyecto.niveles) || 0;
  const requiereAlturaPorNivel = sistema?.requiereAltura || false;
  const requiereZona = sistema?.requiereZona || false;

  const alturaTotal = React.useMemo(() => {
    return Object.values(datosProyecto.alturasNiveles || {}).reduce((sum, h) => {
      return sum + (parseFloat(h) || 0);
    }, 0);
  }, [datosProyecto.alturasNiveles]);

  const obtenerLimiteNiveles = () => {
    if (!sistema) return null;
    const zona = parseInt(datosProyecto.zona) || 1;
    if (sistema.maxNivelesPorZona) {
      const max = sistema.maxNivelesPorZona[zona] || 4;
      return { max, mensaje: `${sistema.nombre} en zona ${zona} está limitado a ${max} niveles máximo` };
    }
    if (sistema.maxNiveles) {
      return { max: sistema.maxNiveles, mensaje: `${sistema.nombre} está limitado a ${sistema.maxNiveles} niveles máximo` };
    }
    return null;
  };

  const obtenerErrorZona = () => {
    if (!sistema?.zonaPermitida || !datosProyecto.zona) return null;
    const zona = parseInt(datosProyecto.zona);
    if (zona !== sistema.zonaPermitida) {
      return `${sistema.nombre} solo permitido en zona ${sistema.zonaPermitida}`;
    }
    return null;
  };

  const obtenerEstadoAltura = () => {
    const zona = parseInt(datosProyecto.zona) || 1;
    if (sistemaSeleccionado === 'porticos_especiales_acero' && zona === 1) {
      const LIMITE = 50;
      let acum = 0;
      for (let i = 1; i <= niveles; i++) {
        acum += parseFloat(datosProyecto.alturasNiveles?.[i]) || 0;
        if (acum > LIMITE) {
          return { excedido: true, nivelExcedido: i, alturaAcum: acum, tipo: 'total', limite: LIMITE };
        }
      }
    }
    if (sistemaSeleccionado === 'porticos_intermedios_acero') {
      const LIMITE = 3;
      for (let i = 1; i <= niveles; i++) {
        const altura = parseFloat(datosProyecto.alturasNiveles?.[i]);
        if (altura && altura > LIMITE) {
          return { excedido: true, nivelExcedido: i, alturaIndividual: altura, tipo: 'individual', limite: LIMITE };
        }
      }
    }
    return { excedido: false, nivelExcedido: null, tipo: null };
  };

  const debeDeshabilitarAltura = (nivel) => {
    if (!estadoAltura.excedido) return false;
    if (nivel > estadoAltura.nivelExcedido) {
      const tieneValor = datosProyecto.alturasNiveles?.[nivel];
      return !tieneValor || tieneValor === '';
    }
    return false;
  };

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

  const generarSecuenciaCampos = () => {
    const secuencia = ['niveles'];
    if (niveles > 0 && !excedeLimite) {
      for (let i = 1; i <= niveles; i++) {
        secuencia.push(`area-${i}`);
        if (requiereAlturaPorNivel) secuencia.push(`altura-${i}`);
      }
    }
    secuencia.push('irregularidad', 'numPlanchas');
    if (requiereZona) secuencia.push('zona');
    if (sistemaSeleccionado === 'sistema_dual_hormigon') secuencia.push('tipoDual');
    if (sistemaSeleccionado === 'sistema_dual_metalico') secuencia.push('tipoMetalico');
    return secuencia;
  };

  const obtenerSiguienteCampo = (currentKey) => {
    const secuencia = generarSecuenciaCampos();
    const idx = secuencia.indexOf(currentKey);
    return idx >= 0 && idx < secuencia.length - 1 ? secuencia[idx + 1] : null;
  };

  const handleKeyDown = (e, currentKey) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const next = obtenerSiguienteCampo(currentKey);
      if (next && inputRefs.current[next]) inputRefs.current[next].focus();
    }
  };

  const handleNivelesChange = (valor) => {
    const valorValidado = validarNumeroPositivo(valor);
    const nivelesNum = parseInt(valorValidado) || 0;
    setDatosProyecto(prev => {
      const nuevasAreas = {};
      const nuevasAlturas = {};
      if (!limiteNiveles || nivelesNum <= limiteNiveles.max) {
        for (let i = 1; i <= nivelesNum; i++) {
          nuevasAreas[i] = prev.areasNiveles[i] || '';
          nuevasAlturas[i] = prev.alturasNiveles?.[i] || '';
        }
      }
      return { ...prev, niveles: valorValidado, areasNiveles: nuevasAreas, alturasNiveles: nuevasAlturas };
    });
  };

  const handleAreaNivelChange = (nivel, valor) => {
    const valorValidado = validarNumeroPositivo(valor);
    setDatosProyecto(prev => ({
      ...prev,
      areasNiveles: { ...prev.areasNiveles, [nivel]: valorValidado }
    }));
  };

  const handleAlturaNivelChange = (nivel, valor) => {
    const valorValidado = validarNumeroPositivo(valor);
    setDatosProyecto(prev => ({
      ...prev,
      alturasNiveles: { ...prev.alturasNiveles, [nivel]: valorValidado }
    }));
  };

  const handleDatosChange = (campo, valor) => {
    if (campo === 'numPlanchas') valor = validarNumeroPositivo(valor);
    setDatosProyecto(prev => ({ ...prev, [campo]: valor }));
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <Building2 className="w-5 h-5" />
        Datos del Proyecto
      </h3>

      <div className="space-y-4">
        {/* Número de niveles */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Número de niveles
          </label>
          <input
            type="number"
            ref={(el) => inputRefs.current['niveles'] = el}
            value={datosProyecto.niveles}
            onChange={(e) => handleNivelesChange(e.target.value)}
            onKeyDown={(e) => handleKeyDown(e, 'niveles')}
            className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 ${
              excedeLimite ? 'border-red-500 bg-red-50' : 'border-gray-300'
            }`}
            placeholder="Ej: 3"
            min="1"
          />
          {validacionCampos?.camposVacios.niveles && (
            <p className="text-xs text-red-600 mt-1">{validacionCampos.camposVacios.niveles}</p>
          )}
          {limiteNiveles && (
            <p className="text-xs text-gray-500 mt-1">Máximo permitido: {limiteNiveles.max} niveles</p>
          )}
        </div>

        {excedeLimite && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-red-700">Límite de niveles excedido</p>
                <p className="text-sm text-red-600 mt-1">{limiteNiveles.mensaje}</p>
              </div>
            </div>
          </div>
        )}

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

        {/* Irregularidad */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Irregularidad
          </label>
          <select
            ref={(el) => inputRefs.current['irregularidad'] = el}
            value={datosProyecto.irregularidad}
            onChange={(e) => handleDatosChange('irregularidad', e.target.value)}
            onKeyDown={(e) => handleKeyDown(e, 'irregularidad')}
            className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 ${
              validacionCampos?.camposVacios.irregularidad ? 'border-red-400 bg-red-50' : 'border-gray-300'
            }`}
          >
            <option value="">Seleccione...</option>
            {sistemaSeleccionado === 'mamposteria_formaleta' ? (
              <>
                <option value="0">0% - Sin irregularidad</option>
                <option value="40">1% - 40% - Irregularidad baja a moderada</option>
                <option value="100">Mayor a 40% - Irregularidad alta</option>
              </>
            ) : (
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
            <p className="text-xs text-red-600 mt-1">{validacionCampos.camposVacios.irregularidad}</p>
          )}
          {datosProyecto.irregularidad >= 40 && !validacionCampos?.camposVacios.irregularidad && (
            <p className="text-sm text-amber-600 mt-1">
              ⚠️ Irregularidad ≥40% eleva el tamaño del proyecto en la gestión del MIVED
            </p>
          )}
        </div>

        {/* Número de planchas */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Número de planchas estimadas
          </label>
          <input
            type="number"
            ref={(el) => inputRefs.current['numPlanchas'] = el}
            value={datosProyecto.numPlanchas}
            onChange={(e) => handleDatosChange('numPlanchas', e.target.value)}
            onKeyDown={(e) => handleKeyDown(e, 'numPlanchas')}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            placeholder="Ej: 8"
            min="0"
          />
          {validacionCampos?.camposVacios.numPlanchas && (
            <p className="text-xs text-red-600 mt-1">{validacionCampos.camposVacios.numPlanchas}</p>
          )}
        </div>

        {/* Zona sísmica */}
        {requiereZona && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Zona sísmica
            </label>
            <select
              ref={(el) => inputRefs.current['zona'] = el}
              value={datosProyecto.zona}
              onChange={(e) => handleDatosChange('zona', e.target.value)}
              onKeyDown={(e) => handleKeyDown(e, 'zona')}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Seleccione...</option>
              <option value="1">Zona 1</option>
              <option value="2">Zona 2</option>
            </select>
            {validacionCampos?.camposVacios.zona && (
              <p className="text-xs text-red-600 mt-1">{validacionCampos.camposVacios.zona}</p>
            )}
            {errorZona && (
              <div className="mt-2 text-sm text-red-600 flex items-start gap-1">
                <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>{errorZona}</span>
              </div>
            )}
          </div>
        )}

        {/* Tipo sistema dual hormigón */}
        {sistemaSeleccionado === 'sistema_dual_hormigon' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tipo de sistema dual
            </label>
            <select
              ref={(el) => inputRefs.current['tipoDual'] = el}
              value={datosProyecto.tipoDual}
              onChange={(e) => handleDatosChange('tipoDual', e.target.value)}
              onKeyDown={(e) => handleKeyDown(e, 'tipoDual')}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            >
              <option value="intermedia">Intermedia</option>
              <option value="especial">Especial</option>
            </select>
          </div>
        )}

        {/* Tipo sistema dual metálico */}
        {sistemaSeleccionado === 'sistema_dual_metalico' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tipo de sistema dual metálico
            </label>
            <select
              ref={(el) => inputRefs.current['tipoMetalico'] = el}
              value={datosProyecto.tipoMetalico}
              onChange={(e) => handleDatosChange('tipoMetalico', e.target.value)}
              onKeyDown={(e) => handleKeyDown(e, 'tipoMetalico')}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            >
              <option value="porticos_arriostramiento">Pórticos de Acero con Arriostramiento</option>
              <option value="muros_ordinarios">Muros Ordinarios de Hormigón Armado</option>
              <option value="muros_especiales">Muros Especiales de Hormigón Armado</option>
            </select>
          </div>
        )}
      </div>
    </div>
  );
}

export default DatosProyecto;