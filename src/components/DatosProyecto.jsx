import React from 'react';
import { Building2 } from 'lucide-react';
import { calcularAreaTotal } from '../utils/helpers';

function DatosProyecto({ sistemaSeleccionado, datosProyecto, setDatosProyecto }) {
  const areaTotal = calcularAreaTotal(datosProyecto.areasNiveles);
  const niveles = parseInt(datosProyecto.niveles) || 0;

  // Calcular altura total para sistemas de acero
  const alturaTotal = React.useMemo(() => {
    if (!datosProyecto.alturasNiveles) return 0;
    return Object.values(datosProyecto.alturasNiveles).reduce((sum, altura) => {
      return sum + (parseFloat(altura) || 0);
    }, 0);
  }, [datosProyecto.alturasNiveles]);

  const handleNivelesChange = (valor) => {
    const nivelesNum = parseInt(valor) || 0;
    setDatosProyecto(prev => {
      const nuevasAreas = {};
      const nuevasAlturas = {};
      for (let i = 1; i <= nivelesNum; i++) {
        nuevasAreas[i] = prev.areasNiveles[i] || '';
        nuevasAlturas[i] = prev.alturasNiveles?.[i] || '';
      }
      return {
        ...prev,
        niveles: valor,
        areasNiveles: nuevasAreas,
        alturasNiveles: nuevasAlturas
      };
    });
  };

  const handleAreaNivelChange = (nivel, valor) => {
    setDatosProyecto(prev => ({
      ...prev,
      areasNiveles: {
        ...prev.areasNiveles,
        [nivel]: valor
      }
    }));
  };

  const handleAlturaNivelChange = (nivel, valor) => {
    setDatosProyecto(prev => ({
      ...prev,
      alturasNiveles: {
        ...prev.alturasNiveles,
        [nivel]: valor
      }
    }));
  };

  const handleDatosChange = (campo, valor) => {
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
            value={datosProyecto.niveles}
            onChange={(e) => handleNivelesChange(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            placeholder="Ej: 3"
            min="1"
          />
        </div>

        {niveles > 0 && (
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">
              {requiereAlturaPorNivel ? 'Área y Altura por nivel' : 'Área por nivel (m²)'}
            </label>
            {Array.from({ length: niveles }, (_, i) => i + 1).map(nivel => (
              <div key={nivel}>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm text-gray-600 w-20 font-medium">Nivel {nivel}:</span>
                </div>
                <div className={`flex gap-2 ${requiereAlturaPorNivel ? 'grid grid-cols-2' : ''}`}>
                  <div className="flex-1">
                    <input
                      type="number"
                      value={datosProyecto.areasNiveles[nivel] || ''}
                      onChange={(e) => handleAreaNivelChange(nivel, e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                      placeholder="Área (m²)"
                      step="0.01"
                    />
                  </div>
                  {requiereAlturaPorNivel && (
                    <div className="flex-1">
                      <input
                        type="number"
                        value={datosProyecto.alturasNiveles?.[nivel] || ''}
                        onChange={(e) => handleAlturaNivelChange(nivel, e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                        placeholder="Altura (m)"
                        step="0.1"
                      />
                    </div>
                  )}
                </div>
              </div>
            ))}
            <div className="pt-2 border-t border-gray-200 space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-700">Área total:</span>
                <span className="font-bold text-indigo-600 text-lg">
                  {areaTotal.toFixed(2)} m²
                </span>
              </div>
              {requiereAlturaPorNivel && (
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-700">Altura total:</span>
                  <span className="font-bold text-indigo-600 text-lg">
                    {alturaTotal.toFixed(2)} m
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Irregularidad
          </label>
          <select
            value={datosProyecto.irregularidad}
            onChange={(e) => handleDatosChange('irregularidad', e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">Seleccione...</option>
            <option value="0">0% - Regular</option>
            <option value="20">20% - Irregularidad baja</option>
            <option value="40">40% - Irregularidad moderada</option>
            <option value="60">60% - Irregularidad alta</option>
            <option value="80">80% - Irregularidad muy alta</option>
            <option value="100">100% - Irregularidad máxima</option>
          </select>
          {datosProyecto.irregularidad >= 40 && (
            <p className="text-sm text-amber-600 mt-1">
              ⚠️ Irregularidad ≥40% eleva el tamaño del proyecto en la gestión del MIBE
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Número de planchas estimadas
          </label>
          <input
            type="number"
            value={datosProyecto.numPlanchas}
            onChange={(e) => handleDatosChange('numPlanchas', e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            placeholder="Ej: 8"
            min="1"
          />
        </div>

 {(sistemaSeleccionado === 'sistema_dual_hormigon' || 
  sistemaSeleccionado === 'sistema_dual_metalico' || // ← AGREGAR ESTO
  sistemaSeleccionado === 'porticos_intermedios_acero' ||
  sistemaSeleccionado === 'porticos_especiales_acero') && (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      Zona sísmica
    </label>
    <select
      value={datosProyecto.zona}
      onChange={(e) => handleDatosChange('zona', e.target.value)}
      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
    >
      <option value="1">Zona 1</option>
      <option value="2">Zona 2</option>
    </select>
  </div>
)}

{sistemaSeleccionado === 'sistema_dual_hormigon' && (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      Tipo de sistema dual
    </label>
    <select
      value={datosProyecto.tipoDual}
      onChange={(e) => handleDatosChange('tipoDual', e.target.value)}
      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
    >
      <option value="intermedia">Intermedia</option>
      <option value="especial">Especial</option>
    </select>
  </div>
)}

{/* AGREGAR ESTE BLOQUE NUEVO */}
{sistemaSeleccionado === 'sistema_dual_metalico' && (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      Tipo de sistema dual metálico
    </label>
    <select
      value={datosProyecto.tipoMetalico}
      onChange={(e) => handleDatosChange('tipoMetalico', e.target.value)}
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