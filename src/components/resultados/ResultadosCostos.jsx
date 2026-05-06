import React from 'react';
import { CheckCircle2, Calculator, AlertCircle, XCircle } from 'lucide-react';

// Colores para cada concepto
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

      {/* Barra segmentada */}
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

      {/* Leyenda */}
      <div className="flex flex-wrap gap-x-4 gap-y-2 mt-3">
        {detalles.map((item, idx) => {
          const porcentaje = ((item.monto / subtotal) * 100).toFixed(1);
          const color = COLORES[item.concepto] || '#94a3b8';
          return (
            <div
              key={idx}
              className="flex items-center gap-1.5 cursor-default"
              style={{ opacity: hover !== null && hover !== idx ? 0.4 : 1, transition: 'opacity 0.2s' }}
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

      {/* Monto en hover */}
      {hover !== null && (
        <div className="mt-2 text-xs text-gray-500 text-center">
          {detalles[hover].concepto}: DOP {detalles[hover].monto.toLocaleString('en-US')}
        </div>
      )}
    </div>
  );
}

function ResultadosCostos({ sistemaSeleccionado, calculos, validaciones }) {

  const handleExportar = () => {
    window.print();
  };

  if (!sistemaSeleccionado) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-12 text-center">
        <Calculator className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500 text-lg">
          Seleccione un sistema estructural para comenzar
        </p>
      </div>
    );
  }

  if (!validaciones.valido) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-12 text-center">
        <XCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
        <p className="text-red-700 text-lg font-semibold mb-2">
          El diseño tiene errores que impiden el cálculo
        </p>
        <p className="text-gray-500 text-sm">
          Revise los errores marcados en rojo antes de continuar
        </p>
      </div>
    );
  }

  if (!calculos) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-12 text-center">
        <AlertCircle className="w-16 h-16 text-amber-500 mx-auto mb-4" />
        <p className="text-gray-700 text-lg font-semibold mb-2">
          Complete todos los campos requeridos
        </p>
        <p className="text-gray-500 text-sm">
          Asegúrese de llenar todos los datos del proyecto para ver el presupuesto
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 print-panel print-avoid-break">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          <CheckCircle2 className="w-6 h-6 text-green-500" />
          Desglose de Costos
        </h3>
        <button
          onClick={handleExportar}
          className="no-print flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
        >
          Exportar PDF
        </button>
      </div>

      <div className="space-y-3 mb-6 print-avoid-break">
        {calculos.detalles.map((item, idx) => (
          <div key={idx} className="flex justify-between items-start py-2 border-b border-gray-200">
            <div>
              <p className="font-medium text-gray-800">{item.concepto}</p>
              <p className="text-sm text-gray-500">{item.detalle}</p>
            </div>
            <p className="font-semibold text-gray-800">
              DOP {item.monto.toLocaleString('en-US')}
            </p>
          </div>
        ))}
      </div>

      <div className="border-t-2 border-gray-300 pt-4 print-avoid-break">
        <div className="flex justify-between items-center">
          <p className="text-2xl font-bold text-gray-800">TOTAL NETO</p>
          <p className="text-3xl font-bold text-indigo-600">
            DOP {calculos.subtotal.toLocaleString('en-US')}
          </p>
        </div>
        <p className="text-sm text-gray-500 mt-2">
          * Precio neto sin ITBIS
        </p>
      </div>

      {/* Gráfico de proporción */}
      <GraficoCostos
        detalles={calculos.detalles}
        subtotal={calculos.subtotal}
      />
    </div>
  );
}

export default ResultadosCostos;