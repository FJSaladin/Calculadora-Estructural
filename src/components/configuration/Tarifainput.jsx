import React, { useState, useEffect, useRef } from 'react';

/**
 * Input controlado para una tarifa individual.
 * Muestra el valor actual vs. el default para detectar cambios.
 * Al hacer blur confirma el cambio en el padre.
 */
function TarifaInput({ valorActual, valorDefault, label, prefix = 'DOP', onCommit }) {
  const [editando, setEditando] = useState(false);
  const [draft, setDraft] = useState(String(valorActual));
  const inputRef = useRef(null);

  useEffect(() => {
    if (!editando) setDraft(String(valorActual));
  }, [valorActual, editando]);

  const handleFocus = () => {
    setEditando(true);
    setDraft(String(valorActual));
    setTimeout(() => inputRef.current?.select(), 0);
  };

  const handleBlur = () => {
    setEditando(false);
    const num = parseFloat(draft);
    if (!isNaN(num) && num > 0 && num !== valorActual) {
      onCommit(num);
    } else {
      setDraft(String(valorActual));
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') inputRef.current?.blur();
    if (e.key === 'Escape') {
      setDraft(String(valorActual));
      setEditando(false);
      inputRef.current?.blur();
    }
  };

  const modificado = valorActual !== valorDefault;

  return (
    <div className="relative group">
      {label && (
        <p className="text-xs text-gray-500 mb-1">{label}</p>
      )}
      <div className={`flex items-center gap-1 rounded-lg border px-2 py-1.5 transition-colors ${
        modificado
          ? 'border-indigo-400 bg-indigo-50'
          : 'border-gray-200 bg-gray-50 hover:border-gray-300 hover:bg-white'
      } ${editando ? 'border-indigo-500 bg-white ring-2 ring-indigo-100' : ''}`}>
        <span className="text-xs text-gray-400 select-none">{prefix}</span>
        <input
          ref={inputRef}
          type="number"
          value={editando ? draft : valorActual}
          onChange={e => setDraft(e.target.value)}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          className="w-full bg-transparent text-sm font-medium text-gray-800 outline-none min-w-0"
          min="0"
          step="100"
        />
        {modificado && !editando && (
          <span className="text-xs text-indigo-400 whitespace-nowrap" title={`Default: ${valorDefault}`}>
            ✎
          </span>
        )}
      </div>
      {modificado && !editando && (
        <p className="text-xs text-gray-400 mt-0.5">
          Base: {prefix} {valorDefault.toLocaleString('en-US')}
        </p>
      )}
    </div>
  );
}

export default TarifaInput;