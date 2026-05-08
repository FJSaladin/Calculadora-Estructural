import React, { useState, useEffect } from 'react';
import { Settings, X, RotateCcw, Save, Clock, AlertTriangle, CheckCircle2 } from 'lucide-react';
import TablaTarifas from './TablaTarifa';

import HistorialCambios from './HistorialCambio';
import { sistemas as sistemasBase } from '../../systems';

const SISTEMAS_ORDEN = [
  { id: 'mamposteria_formaleta',         nombre: 'Mampostería / Formaleta' },
  { id: 'porticos_intermedios_hormigon', nombre: 'Pórticos Intermedios Hormigón' },
  { id: 'porticos_especiales_hormigon',  nombre: 'Pórticos Especiales Hormigón' },
  { id: 'sistema_dual_hormigon',         nombre: 'Sistema Dual Hormigón' },
  { id: 'porticos_intermedios_acero',    nombre: 'Pórticos Interm. Acero' },
  { id: 'porticos_especiales_acero',     nombre: 'Pórticos Esp. Acero' },
  { id: 'sistema_dual_metalico',         nombre: 'Sistema Dual Metálico' },
];

// Extras configurables por sistema (campos escalares)
const EXTRAS_POR_SISTEMA = {
  sistema_dual_metalico: [
    { campo: 'memoriaCalculo', label: 'Memoria de cálculo (MIVED)', default: 20000 },
  ],
};

function CampoExtra({ sistemaId, campo, label, defaultVal, sistemaActual, actualizarTarifa, setPendientes }) {
  const valorActual = sistemaActual[campo] ?? defaultVal;
  const [draft, setDraft] = useState(String(valorActual));
  const [enfocado, setEnfocado] = useState(false);

  const modificado = valorActual !== defaultVal;

  const commit = () => {
    setEnfocado(false);
    const num = parseFloat(draft);
    if (!isNaN(num) && num > 0 && num !== valorActual) {
      actualizarTarifa(sistemaId, campo, num);
      setPendientes(prev => {
        const path = campo;
        const sig = prev.filter(p => !(p.sistemaId === sistemaId && p.path === path));
        sig.push({ sistemaId, path, valorAnterior: valorActual, valorNuevo: num, etiqueta: label });
        return sig;
      });
    } else {
      setDraft(String(valorActual));
    }
  };

  return (
    <div className="flex items-center justify-between py-3 border-b border-gray-100">
      <div>
        <p className="text-sm font-medium text-gray-700">{label}</p>
        {modificado && (
          <p className="text-xs text-gray-400 mt-0.5">Base: DOP {defaultVal.toLocaleString('en-US')}</p>
        )}
      </div>
      <div className={`flex items-center gap-1 rounded-lg border px-2 py-1.5 w-36 transition-colors ${
        modificado ? 'border-indigo-400 bg-indigo-50' : 'border-gray-200 bg-gray-50'
      } ${enfocado ? 'border-indigo-500 bg-white ring-2 ring-indigo-100' : ''}`}>
        <span className="text-xs text-gray-400">DOP</span>
        <input
          type="number"
          value={enfocado ? draft : valorActual}
          onChange={e => setDraft(e.target.value)}
          onFocus={() => { setEnfocado(true); setDraft(String(valorActual)); }}
          onBlur={commit}
          onKeyDown={e => { if (e.key === 'Enter') e.target.blur(); }}
          className="w-full bg-transparent text-sm font-medium text-gray-800 outline-none min-w-0"
          min="0"
          step="500"
        />
      </div>
    </div>
  );
}

function PanelConfiguracion({
  sistemas,
  historial,
  actualizarTarifa,
  confirmarCambios,
  resetearSistema,
  resetearTodo,
  tieneOverrides,
}) {
  const [abierto, setAbierto] = useState(false);
  const [sistemaActivo, setSistemaActivo] = useState(SISTEMAS_ORDEN[0].id);
  const [tab, setTab] = useState('tarifas'); // 'tarifas' | 'historial'
  const [pendientes, setPendientes] = useState([]);
  const [guardado, setGuardado] = useState(false);
  const [confirmarReset, setConfirmarReset] = useState(false);

  // Cerrar con Escape
  useEffect(() => {
    if (!abierto) return;
    const handler = (e) => { if (e.key === 'Escape') setAbierto(false); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [abierto]);

  const hayCambiosPendientes = pendientes.filter(p => p.sistemaId === sistemaActivo).length > 0;
  const totalOverrides = SISTEMAS_ORDEN.filter(s => tieneOverrides(s.id)).length;

  const handleGuardar = () => {
    confirmarCambios(pendientes);
    setPendientes([]);
    setGuardado(true);
    setTimeout(() => setGuardado(false), 2000);
  };

  const handleResetSistema = () => {
    if (!confirmarReset) {
      setConfirmarReset(true);
      return;
    }
    resetearSistema(sistemaActivo);
    setPendientes(prev => prev.filter(p => p.sistemaId !== sistemaActivo));
    setConfirmarReset(false);
  };

  return (
    <>
      {/* Botón de apertura */}
      <button
        onClick={() => setAbierto(true)}
        className="relative flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
        title="Configurar tarifas"
      >
        <Settings className="w-4 h-4" />
        <span className="hidden sm:inline">Tarifas</span>
        {totalOverrides > 0 && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-indigo-600 text-white text-xs rounded-full flex items-center justify-center leading-none">
            {totalOverrides}
          </span>
        )}
      </button>

      {/* Overlay */}
      {abierto && (
        <div
          className="fixed inset-0 bg-black/40 z-40 flex items-center justify-center p-4"
          onClick={e => { if (e.target === e.currentTarget) setAbierto(false); }}
        >
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">

            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Settings className="w-5 h-5 text-indigo-600" />
                  Configuración de tarifas
                </h2>
                <p className="text-sm text-gray-500 mt-0.5">
                  Los cambios se guardan localmente y persisten entre sesiones.
                </p>
              </div>
              <div className="flex items-center gap-3">
                {/* Tabs */}
                <div className="flex rounded-lg border border-gray-200 overflow-hidden">
                  <button
                    onClick={() => setTab('tarifas')}
                    className={`px-3 py-1.5 text-sm transition-colors ${tab === 'tarifas' ? 'bg-indigo-600 text-white' : 'text-gray-600 hover:bg-gray-50'}`}
                  >
                    Tarifas
                  </button>
                  <button
                    onClick={() => setTab('historial')}
                    className={`relative px-3 py-1.5 text-sm transition-colors flex items-center gap-1 ${tab === 'historial' ? 'bg-indigo-600 text-white' : 'text-gray-600 hover:bg-gray-50'}`}
                  >
                    <Clock className="w-3.5 h-3.5" />
                    Historial
                    {historial.length > 0 && (
                      <span className={`text-xs px-1 rounded ${tab === 'historial' ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'}`}>
                        {historial.length}
                      </span>
                    )}
                  </button>
                </div>
                <button
                  onClick={() => setAbierto(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {tab === 'tarifas' ? (
              <div className="flex flex-1 overflow-hidden">
                {/* Sidebar de sistemas */}
                <div className="w-56 border-r border-gray-200 flex-shrink-0 overflow-y-auto">
                  <ul className="py-2">
                    {SISTEMAS_ORDEN.map(s => {
                      const tieneOverride = tieneOverrides(s.id);
                      const activo = s.id === sistemaActivo;
                      return (
                        <li key={s.id}>
                          <button
                            onClick={() => { setSistemaActivo(s.id); setConfirmarReset(false); }}
                            className={`w-full text-left px-4 py-2.5 text-sm transition-colors flex items-center justify-between gap-2 ${
                              activo
                                ? 'bg-indigo-50 text-indigo-700 font-medium'
                                : 'text-gray-600 hover:bg-gray-50'
                            }`}
                          >
                            <span className="leading-tight">{s.nombre}</span>
                            {tieneOverride && (
                              <span className="w-2 h-2 rounded-full bg-indigo-400 flex-shrink-0" title="Tiene cambios activos" />
                            )}
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>

                {/* Área principal */}
                <div className="flex-1 overflow-y-auto">
                  <div className="px-6 py-4">
                    {/* Cabecera del sistema activo */}
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="font-semibold text-gray-800">
                          {SISTEMAS_ORDEN.find(s => s.id === sistemaActivo)?.nombre}
                        </h3>
                        {tieneOverrides(sistemaActivo) && (
                          <p className="text-xs text-indigo-500 mt-0.5 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 inline-block" />
                            Tiene valores modificados
                          </p>
                        )}
                      </div>
                      <button
                        onClick={handleResetSistema}
                        disabled={!tieneOverrides(sistemaActivo)}
                        className={`flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg border transition-colors ${
                          confirmarReset
                            ? 'border-red-300 bg-red-50 text-red-600 hover:bg-red-100'
                            : tieneOverrides(sistemaActivo)
                              ? 'border-gray-200 text-gray-600 hover:border-amber-300 hover:bg-amber-50 hover:text-amber-700'
                              : 'border-gray-100 text-gray-300 cursor-not-allowed'
                        }`}
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        {confirmarReset ? '¿Confirmar reset?' : 'Restaurar defaults'}
                      </button>
                    </div>

                    {/* Extras escalares */}
                    {EXTRAS_POR_SISTEMA[sistemaActivo]?.map(extra => (
                      <CampoExtra
                        key={extra.campo}
                        sistemaId={sistemaActivo}
                        campo={extra.campo}
                        label={extra.label}
                        defaultVal={extra.default}
                        sistemaActual={sistemas[sistemaActivo]}
                        actualizarTarifa={actualizarTarifa}
                        setPendientes={setPendientes}
                      />
                    ))}

                    {/* Tabla de tarifas */}
                    <div className="mt-2">
                      <TablaTarifas
                        sistemaId={sistemaActivo}
                        sistemaActual={sistemas[sistemaActivo]}
                        actualizarTarifa={actualizarTarifa}
                        pendientes={pendientes}
                        setPendientes={setPendientes}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto px-6 py-4">
                <HistorialCambios historial={historial} />
              </div>
            )}

            {/* Footer con acciones */}
            {tab === 'tarifas' && (
              <div className="border-t border-gray-200 px-6 py-3 flex items-center justify-between bg-gray-50">
                <p className="text-xs text-gray-400">
                  {totalOverrides === 0
                    ? 'Sin cambios activos — usando valores base'
                    : `${totalOverrides} sistema${totalOverrides !== 1 ? 's' : ''} con valores modificados`
                  }
                </p>
                <div className="flex items-center gap-3">
                  {guardado && (
                    <span className="flex items-center gap-1 text-sm text-green-600">
                      <CheckCircle2 className="w-4 h-4" />
                      Guardado en historial
                    </span>
                  )}
                  <button
                    onClick={handleGuardar}
                    disabled={pendientes.length === 0}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      pendientes.length > 0
                        ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    <Save className="w-4 h-4" />
                    Registrar en historial
                    {pendientes.length > 0 && (
                      <span className="bg-white/20 text-xs px-1.5 py-0.5 rounded">
                        {pendientes.length}
                      </span>
                    )}
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      )}
    </>
  );
}

export default PanelConfiguracion;