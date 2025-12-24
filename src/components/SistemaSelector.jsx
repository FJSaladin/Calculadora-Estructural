import React from 'react';

function SistemaSelector({ sistemaSeleccionado, setSistemaSeleccionado }) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        Sistema Estructural
      </label>
      <select
        value={sistemaSeleccionado}
        onChange={(e) => setSistemaSeleccionado(e.target.value)}
        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
      >
        <option value="">Seleccione un sistema...</option>
        <option value="mamposteria_formaleta">Mampostería / Formaleta</option>
        <option value="porticos_intermedios_hormigon">Pórticos Intermedios de Hormigón</option>
        <option value="porticos_especiales_hormigon">Pórticos Especiales de Hormigón</option>
        <option value="sistema_dual_hormigon">Sistema Dual de Hormigón</option>
        <option value="porticos_intermedios_acero">Pórticos Intermedios de Acero</option>
        <option value="porticos_especiales_acero">Pórticos Especiales de Acero</option>
        <option value="sistema_dual_metalico">Sistema Dual Metálico</option>
      </select>
    </div>
  );
}

export default SistemaSelector;