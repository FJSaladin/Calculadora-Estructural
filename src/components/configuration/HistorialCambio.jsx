import React, { useState } from 'react';
import { Clock, ChevronDown, ChevronRight, RotateCcw } from 'lucide-react';

const NOMBRES_SISTEMAS = {
  mamposteria_formaleta:          'Mampostería / Formaleta',
  porticos_intermedios_hormigon:  'Pórticos Intermedios Hormigón',
  porticos_especiales_hormigon:   'Pórticos Especiales Hormigón',
  sistema_dual_hormigon:          'Sistema Dual Hormigón',
  porticos_intermedios_acero:     'Pórticos Intermedios Acero',
  porticos_especiales_acero:      'Pórticos Especiales Acero',
  sistema_dual_metalico:          'Sistema Dual Metálico',
};

function formatearFecha(iso) {
  const d = new Date(iso);
  return d.toLocaleString('es-DO', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

function EntradaHistorial({ entrada }) {
  const [abierto, setAbierto] = useState(false);
  const esReset = entrada.tipo === 'reset';

  return (
    <div className="border border-gray-100 rounded-lg overflow-hidden">
      <button
        onClick={() => setAbierto(v => !v)}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 text-left"
      >
        <div className="flex items-center gap-3">
          {esReset
            ? <RotateCcw className="w-4 h-4 text-amber-500 flex-shrink-0" />
            : <Clock className="w-4 h-4 text-indigo-400 flex-shrink-0" />
          }
          <div>
            <p className="text-sm font-medium text-gray-800">
              {esReset ? 'Restauración a valores base' : `${entrada.cambios.length} cambio${entrada.cambios.length !== 1 ? 's' : ''}`}
            </p>
            <p className="text-xs text-gray-400">{formatearFecha(entrada.fecha)}</p>
          </div>
        </div>
        {abierto
          ? <ChevronDown className="w-4 h-4 text-gray-400" />
          : <ChevronRight className="w-4 h-4 text-gray-400" />
        }
      </button>

      {abierto && (
        <div className="border-t border-gray-100 px-4 py-3 space-y-2 bg-gray-50">
          {entrada.cambios.map((c, i) => (
            <div key={i} className="flex items-start justify-between gap-4 text-xs">
              <div>
                <span className="font-medium text-gray-700">
                  {NOMBRES_SISTEMAS[c.sistemaId] ?? c.sistemaId}
                </span>
                <span className="text-gray-400 mx-1">·</span>
                <span className="text-gray-500">{c.etiqueta}</span>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className="line-through text-gray-400">
                  {Number(c.valorAnterior).toLocaleString('en-US')}
                </span>
                <span className="text-indigo-600 font-medium">
                  {Number(c.valorNuevo).toLocaleString('en-US')}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function HistorialCambios({ historial }) {
  if (historial.length === 0) {
    return (
      <div className="text-center py-8">
        <Clock className="w-8 h-8 text-gray-200 mx-auto mb-2" />
        <p className="text-sm text-gray-400">Sin cambios registrados aún.</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {historial.map(entrada => (
        <EntradaHistorial key={entrada.id} entrada={entrada} />
      ))}
    </div>
  );
}

export default HistorialCambios;