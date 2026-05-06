import React from 'react';

const COLORES = {
  'Planos': '#6366f1',
  'Planos estructurales': '#6366f1',
  'Modelo computacional': '#0ea5e9',
  'Memoria de cálculo': '#10b981',
  'Gestión por dictamen': '#f59e0b',
};

function GraficoCostos({ detalles, subtotal }) {
  const [hover, setHover] = React.useState(null);

  return (
    <div className="mt-6 print-avoid-break">
      <p className="text-sm font-medium text-gray-600 mb-3">
        Proporción de costos
      </p>

      <div className="flex rounded-lg overflow-hidden h-8 w-full">
        {detalles.map((item, idx) => {
          const porcentaje = (item.monto / subtotal) * 100;
          const color = COLORES[item.concepto] || '#94a3b8';
          return (
            <div
              key={idx}
              style={{
                width: `${porcentaje}%`,
                backgroundColor: color,
                transition: 'opacity 0.2s',
                opacity: hover !== null && hover !== idx ? 0.5 : 1,
              }}
              onMouseEnter={() => setHover(idx)}
              onMouseLeave={() => setHover(null)}
              title={`${item.concepto}: DOP ${item.monto.toLocaleString('en-US')}`}
            />
          );
        })}
      </div>

      <div className="flex flex-wrap gap-x-4 gap-y-2 mt-3">
        {detalles.map((item, idx) => {
          const porcentaje = ((item.monto / subtotal) * 100).toFixed(1);
          const color = COLORES[item.concepto] || '#94a3b8';
          return (
            <div
              key={idx}
              className="flex items-center gap-1.5 cursor-default"
              style={{
                opacity: hover !== null && hover !== idx ? 0.4 : 1,
                transition: 'opacity 0.2s'
              }}
              onMouseEnter={() => setHover(idx)}
              onMouseLeave={() => setHover(null)}
            >
              <span
                style={{ backgroundColor: color }}
                className="w-2.5 h-2.5 rounded-sm flex-shrink-0"
              />
              <span className="text-xs text-gray-600">
                {item.concepto}
              </span>
              <span className="text-xs font-medium text-gray-800">
                {porcentaje}%
              </span>
            </div>
          );
        })}
      </div>

      {hover !== null && (
        <div className="mt-2 text-xs text-gray-500 text-center">
          {detalles[hover].concepto}: DOP {detalles[hover].monto.toLocaleString('en-US')}
        </div>
      )}
    </div>
  );
}

export default GraficoCostos;