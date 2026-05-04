import React from 'react';

function ServiciosMIVED({ gestionMIVED, setGestionMIVED }) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        Servicios Adicionales
      </h3>
      <label className="flex items-center gap-3 cursor-pointer">
        <input
          type="checkbox"
          checked={gestionMIVED}
          onChange={(e) => setGestionMIVED(e.target.checked)}
          className="w-5 h-5 text-indigo-600 rounded focus:ring-2 focus:ring-indigo-500"
        />
        <span className="text-gray-700">
          Gestión del MIVED (Memoria de cálculo + Gestión de dictamen)
        </span>
      </label>
    </div>
  );
}

export default ServiciosMIVED;