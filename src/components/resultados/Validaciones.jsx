import React from 'react';
import { AlertCircle } from 'lucide-react';

function Validaciones({ sistemaSeleccionado, validaciones }) {
  if (!sistemaSeleccionado || (validaciones.errores.length === 0 && validaciones.advertencias.length === 0)) {
    return null;
  }

  return (
    <div className="space-y-3">
      {validaciones.errores.map((error, idx) => (
        <div key={idx} className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      ))}
      {validaciones.advertencias.map((adv, idx) => (
        <div key={idx} className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-yellow-700">{adv}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Validaciones;