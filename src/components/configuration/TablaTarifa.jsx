import React from 'react';
import TarifaInput from './TarifaInputs';
import { sistemas as sistemasBase } from '../../systems';
import { extraerTarifasBase } from '../../hooks/useTarifasConfig';

const LABELS_IRR = {
  0:   '0% — Regular',
  20:  '20% — Baja',
  40:  '40% — Moderada',
  60:  '60% — Alta',
  80:  '80% — Muy alta',
  100: '100% — Máxima',
};

const LABELS_IRR_MAMPOSTERIA = {
  0:   '0% — Sin irregularidad',
  40:  '1–40% — Irregularidad baja a moderada',
  100: '>40% — Irregularidad alta',
};

/**
 * Tabla de tarifas para un sistema con tarifas planas { irr: { planos, modelo_m2 } }
 */
function TablaSimple({ sistemaId, sistemaActual, sistemaBase, actualizarTarifa, pendientes, setPendientes }) {
  const esMamposteria = sistemaId === 'mamposteria_formaleta';
  const labelsIrr = esMamposteria ? LABELS_IRR_MAMPOSTERIA : LABELS_IRR;
  const irregularidades = Object.keys(sistemaBase.tarifas).map(Number);

  const commit = (irr, campo, valorNuevo) => {
    const path = `tarifas.${irr}.${campo}`;
    const valorAnterior = sistemaBase.tarifas[irr][campo];
    actualizarTarifa(sistemaId, path, valorNuevo);
    setPendientes(prev => {
      const sig = prev.filter(p => !(p.sistemaId === sistemaId && p.path === path));
      sig.push({ sistemaId, path, valorAnterior, valorNuevo, etiqueta: `${labelsIrr[irr]} → ${campo}` });
      return sig;
    });
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left py-2 pr-4 text-xs font-medium text-gray-500 w-48">Irregularidad</th>
            <th className="text-left py-2 pr-4 text-xs font-medium text-gray-500">Planos (× plancha)</th>
            <th className="text-left py-2 text-xs font-medium text-gray-500">Modelo (× m²)</th>
          </tr>
        </thead>
        <tbody>
          {irregularidades.map(irr => (
            <tr key={irr} className="border-b border-gray-100 hover:bg-gray-50">
              <td className="py-2 pr-4">
                <span className="text-xs text-gray-600">{labelsIrr[irr]}</span>
              </td>
              <td className="py-2 pr-4">
                <TarifaInput
                  valorActual={sistemaActual.tarifas[irr]?.planos ?? sistemaBase.tarifas[irr].planos}
                  valorDefault={sistemaBase.tarifas[irr].planos}
                  onCommit={v => commit(irr, 'planos', v)}
                />
              </td>
              <td className="py-2">
                <TarifaInput
                  valorActual={sistemaActual.tarifas[irr]?.modelo_m2 ?? sistemaBase.tarifas[irr].modelo_m2}
                  valorDefault={sistemaBase.tarifas[irr].modelo_m2}
                  onCommit={v => commit(irr, 'modelo_m2', v)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/**
 * Tabla de tarifas para sistemas duales (tienen subtipos)
 */
function TablaDual({ sistemaId, sistemaActual, sistemaBase, actualizarTarifa, setPendientes }) {
  const tiposBase = sistemaBase.tipos;
  const tiposActual = sistemaActual.tipos;

  const commit = (tipoKey, irr, campo, valorNuevo) => {
    const path = `tipos.${tipoKey}.${irr}.${campo}`;
    const valorAnterior = tiposBase[tipoKey].tarifas[irr][campo];
    actualizarTarifa(sistemaId, path, valorNuevo);
    setPendientes(prev => {
      const sig = prev.filter(p => !(p.sistemaId === sistemaId && p.path === path));
      sig.push({ sistemaId, path, valorAnterior, valorNuevo, etiqueta: `${tipoKey} / ${irr}% → ${campo}` });
      return sig;
    });
  };

  const commitPlanosBase = (irr, valorNuevo) => {
    if (!sistemaBase.planosBase) return;
    const path = `_planosBase.${irr}`;
    const valorAnterior = sistemaBase.planosBase[irr];
    actualizarTarifa(sistemaId, path, valorNuevo);
    setPendientes(prev => {
      const sig = prev.filter(p => !(p.sistemaId === sistemaId && p.path === path));
      sig.push({ sistemaId, path, valorAnterior, valorNuevo, etiqueta: `Planos base / ${irr}%` });
      return sig;
    });
  };

  return (
    <div className="space-y-4">
      {/* PlanosBase independiente (sistemaDualMetalico) */}
      {sistemaBase.planosBase && (
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
            Planos base (× plancha) — compartido por todos los tipos
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2 pr-4 text-xs font-medium text-gray-500 w-48">Irregularidad</th>
                  <th className="text-left py-2 text-xs font-medium text-gray-500">Monto planos</th>
                </tr>
              </thead>
              <tbody>
                {Object.keys(sistemaBase.planosBase).map(irr => (
                  <tr key={irr} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-2 pr-4">
                      <span className="text-xs text-gray-600">{LABELS_IRR[irr]}</span>
                    </td>
                    <td className="py-2">
                      <TarifaInput
                        valorActual={sistemaActual.planosBase?.[irr] ?? sistemaBase.planosBase[irr]}
                        valorDefault={sistemaBase.planosBase[irr]}
                        onCommit={v => commitPlanosBase(irr, v)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tarifas por tipo */}
      {Object.entries(tiposBase).map(([tipoKey, tipoBase]) => (
        <div key={tipoKey}>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
            {tipoBase.nombre}
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2 pr-4 text-xs font-medium text-gray-500 w-48">Irregularidad</th>
                  {tipoBase.tarifas[0]?.planos !== undefined && (
                    <th className="text-left py-2 pr-4 text-xs font-medium text-gray-500">Planos (× plancha)</th>
                  )}
                  <th className="text-left py-2 text-xs font-medium text-gray-500">Modelo (× m²)</th>
                </tr>
              </thead>
              <tbody>
                {Object.keys(tipoBase.tarifas).map(irr => (
                  <tr key={irr} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-2 pr-4">
                      <span className="text-xs text-gray-600">{LABELS_IRR[irr]}</span>
                    </td>
                    {tipoBase.tarifas[0]?.planos !== undefined && (
                      <td className="py-2 pr-4">
                        <TarifaInput
                          valorActual={tiposActual[tipoKey]?.tarifas[irr]?.planos ?? tipoBase.tarifas[irr].planos}
                          valorDefault={tipoBase.tarifas[irr].planos}
                          onCommit={v => commit(tipoKey, irr, 'planos', v)}
                        />
                      </td>
                    )}
                    <td className="py-2">
                      <TarifaInput
                        valorActual={tiposActual[tipoKey]?.tarifas[irr]?.modelo_m2 ?? tipoBase.tarifas[irr].modelo_m2}
                        valorDefault={tipoBase.tarifas[irr].modelo_m2}
                        onCommit={v => commit(tipoKey, irr, 'modelo_m2', v)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * Renderiza la tabla correcta según la estructura del sistema.
 */
function TablaTarifas({ sistemaId, sistemaActual, actualizarTarifa, pendientes, setPendientes }) {
  const sistemaBase = sistemasBase[sistemaId];
  if (!sistemaBase) return null;

  if (sistemaBase.tarifas) {
    return (
      <TablaSimple
        sistemaId={sistemaId}
        sistemaActual={sistemaActual}
        sistemaBase={sistemaBase}
        actualizarTarifa={actualizarTarifa}
        pendientes={pendientes}
        setPendientes={setPendientes}
      />
    );
  }

  if (sistemaBase.tipos) {
    return (
      <TablaDual
        sistemaId={sistemaId}
        sistemaActual={sistemaActual}
        sistemaBase={sistemaBase}
        actualizarTarifa={actualizarTarifa}
        setPendientes={setPendientes}
      />
    );
  }

  return <p className="text-sm text-gray-400">Sin tarifas configurables.</p>;
}

export default TablaTarifas;