import React from 'react';
import { Calculator } from 'lucide-react';

function Header() {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
      <div className="flex items-center gap-3 mb-2">
        <Calculator className="w-8 h-8 text-indigo-600" />
        <h1 className="text-3xl font-bold text-gray-800">
          Calculadora de Diseño Estructural
        </h1>
      </div>
      <p className="text-gray-600">Planilla SHIZZO 2025 - República Dominicana (DOP)</p>
    </div>
  );
}

export default Header;