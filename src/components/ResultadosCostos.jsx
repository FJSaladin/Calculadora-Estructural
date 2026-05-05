import React from 'react';
import { CheckCircle2, Calculator, AlertCircle, XCircle } from 'lucide-react';

function ResultadosCostos({ sistemaSeleccionado, calculos, validaciones }) {
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

  // Error de validación de negocio (límites excedidos, zona incorrecta)
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

  // Campos incompletos
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
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
        <CheckCircle2 className="w-6 h-6 text-green-500" />
        Desglose de Costos
      </h3>

      <div className="space-y-3 mb-6">
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

      <div className="border-t-2 border-gray-300 pt-4">
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
    </div>
  );
}

export default ResultadosCostos;