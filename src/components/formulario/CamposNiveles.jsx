import React from 'react';
import { AlertTriangle } from 'lucide-react';

function CamposNiveles({
  niveles,
  sistemaSeleccionado,
  datosProyecto,
  validacionCampos,
  estadoAltura,
  requiereAlturaPorNivel,
  areaTotal,
  alturaTotal,
  inputRefs,
  obtenerSiguienteCampo,
  handleAreaNivelChange,
  handleAlturaNivelChange,
  debeDeshabilitarAltura,
}) {
  if (niveles <= 0) return null;

  return (
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
                ref={(el) => inputRefs.current[`area-${nivel}`] = el}
                value={datosProyecto.areasNiveles[nivel] || ''}
                onChange={(e) => handleAreaNivelChange(nivel, e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    const next = obtenerSiguienteCampo(`area-${nivel}`);
                    if (next && inputRefs.current[next]) inputRefs.current[next].focus();
                  }
                }}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                placeholder="Área (m²)"
                step="0.01"
                min="0"
              />
              {validacionCampos?.camposVacios[`area-${nivel}`] && (
                <p className="text-xs text-red-600 mt-1">
                  {validacionCampos.camposVacios[`area-${nivel}`]}
                </p>
              )}
            </div>

            {requiereAlturaPorNivel && (
              <div className="flex-1">
                <input
                  type="number"
                  ref={(el) => inputRefs.current[`altura-${nivel}`] = el}
                  value={datosProyecto.alturasNiveles?.[nivel] || ''}
                  onChange={(e) => handleAlturaNivelChange(nivel, e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      const next = obtenerSiguienteCampo(`altura-${nivel}`);
                      if (next && inputRefs.current[next]) inputRefs.current[next].focus();
                    }
                  }}
                  disabled={debeDeshabilitarAltura(nivel)}
                  className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 ${
                    debeDeshabilitarAltura(nivel)
                      ? 'bg-gray-100 cursor-not-allowed border-gray-300'
                      : 'border-gray-300'
                  }`}
                  placeholder="Altura (m)"
                  step="0.1"
                  min="0"
                />
                {validacionCampos?.camposVacios[`altura-${nivel}`] && (
                  <p className="text-xs text-red-600 mt-1">
                    {validacionCampos.camposVacios[`altura-${nivel}`]}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      ))}

      {/* Totales */}
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

      {/* Alerta altura excedida */}
      {requiereAlturaPorNivel && estadoAltura.excedido && (
        <div className="mt-3 bg-red-50 border-l-4 border-red-500 p-3 rounded">
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-red-700">
                Límite de altura excedido
              </p>
              {estadoAltura.tipo === 'total' && (
                <>
                  <p className="text-sm text-red-600 mt-1">
                    Altura acumulada al nivel {estadoAltura.nivelExcedido}: {estadoAltura.alturaAcum.toFixed(2)}m
                  </p>
                  <p className="text-xs text-red-500 mt-1">
                    Límite máximo para zona 1: {estadoAltura.limite}m. Los campos posteriores han sido deshabilitados.
                  </p>
                </>
              )}
              {estadoAltura.tipo === 'individual' && (
                <>
                  <p className="text-sm text-red-600 mt-1">
                    Nivel {estadoAltura.nivelExcedido}: {estadoAltura.alturaIndividual.toFixed(2)}m
                  </p>
                  <p className="text-xs text-red-500 mt-1">
                    Límite máximo por nivel: {estadoAltura.limite}m. Los campos posteriores han sido deshabilitados.
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CamposNiveles;