import React from 'react';
import { Calculator } from 'lucide-react';

function Header({ accionesExtra }) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6 no-print">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Calculator className="w-8 h-8 text-indigo-600" />
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Calculadora de Diseño Estructural
            </h1>
            <p className="text-gray-600 text-sm mt-0.5">
              Planilla SHIZZO 2025 — República Dominicana (DOP)
            </p>
          </div>
        </div>
        {accionesExtra && (
          <div className="flex items-center gap-2">
            {accionesExtra}
          </div>
        )}
      </div>
    </div>
  );
}

export default Header;