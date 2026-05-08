import { useState, useCallback, useMemo } from 'react';
import { sistemas as sistemasBase } from '../systems';

const STORAGE_KEY = 'shizzo_tarifas_config';
const HISTORY_KEY = 'shizzo_tarifas_history';
const MAX_HISTORY = 20;

// ─── Helpers ────────────────────────────────────────────────────────────────

function cargarOverrides() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function cargarHistorial() {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function guardarOverrides(overrides) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(overrides));
}

function guardarHistorial(historial) {
  localStorage.setItem(HISTORY_KEY, JSON.stringify(historial));
}

/**
 * Extrae las tarifas "base" de un sistema como objeto plano para edición.
 * Devuelve { irregularidad: { planos, modelo_m2 }, ... }
 */
export function extraerTarifasBase(sistema) {
  if (!sistema) return {};

  // Sistemas con tarifas directas (mamposteria, porticos, etc.)
  if (sistema.tarifas) {
    return JSON.parse(JSON.stringify(sistema.tarifas));
  }

  // Sistema dual hormigon / metalico (tienen 'tipos' con tarifas anidadas)
  if (sistema.tipos) {
    const result = {};
    for (const [tipoKey, tipo] of Object.entries(sistema.tipos)) {
      result[tipoKey] = JSON.parse(JSON.stringify(tipo.tarifas));
    }
    // Si también tienen planosBase independiente (sistemaDualMetalico)
    if (sistema.planosBase) {
      result._planosBase = { ...sistema.planosBase };
    }
    return result;
  }

  return {};
}

/**
 * Aplica los overrides sobre las tarifas base del sistema.
 * Devuelve el sistema con las tarifas modificadas (sin mutar el original).
 */
function aplicarOverrides(sistemaId, sistemaBase, overrides) {
  const override = overrides[sistemaId];
  if (!override) return sistemaBase;

  const sistema = { ...sistemaBase };

  if (sistemaBase.tarifas) {
    sistema.tarifas = { ...sistemaBase.tarifas };
    for (const [irr, vals] of Object.entries(override)) {
      if (sistema.tarifas[irr]) {
        sistema.tarifas[irr] = { ...sistema.tarifas[irr], ...vals };
      }
    }
  }

  if (sistemaBase.tipos) {
    sistema.tipos = { ...sistemaBase.tipos };
    for (const [tipoKey, tipoOverride] of Object.entries(override)) {
      if (tipoKey === '_planosBase' && sistemaBase.planosBase) {
        sistema.planosBase = { ...sistemaBase.planosBase, ...tipoOverride };
        continue;
      }
      if (sistema.tipos[tipoKey]) {
        const tipo = { ...sistema.tipos[tipoKey] };
        tipo.tarifas = { ...tipo.tarifas };
        for (const [irr, vals] of Object.entries(tipoOverride)) {
          if (tipo.tarifas[irr]) {
            tipo.tarifas[irr] = { ...tipo.tarifas[irr], ...vals };
          }
        }
        sistema.tipos[tipoKey] = tipo;
      }
    }
  }

  // Otros campos escalares editables (memoriaCalculo, etc.)
  if (override._escalares) {
    Object.assign(sistema, override._escalares);
  }

  return sistema;
}

// ─── Hook principal ──────────────────────────────────────────────────────────

export function useTarifasConfig() {
  const [overrides, setOverrides] = useState(cargarOverrides);
  const [historial, setHistorial] = useState(cargarHistorial);

  // Sistemas con overrides aplicados — esta es la fuente de verdad para cálculos
  const sistemas = useMemo(() => {
    const result = {};
    for (const [id, sistemaBase] of Object.entries(sistemasBase)) {
      result[id] = aplicarOverrides(id, sistemaBase, overrides);
    }
    return result;
  }, [overrides]);

  /**
   * Guarda un override para un campo específico.
   * path: 'tarifas.0.planos' | 'tipos.intermedia.40.modelo_m2' | 'memoriaCalculo'
   */
  const actualizarTarifa = useCallback((sistemaId, path, valorNuevo) => {
    setOverrides(prev => {
      const siguiente = { ...prev };
      if (!siguiente[sistemaId]) siguiente[sistemaId] = {};

      const partes = path.split('.');

      // Campo escalar (ej: memoriaCalculo)
      if (partes.length === 1) {
        if (!siguiente[sistemaId]._escalares) siguiente[sistemaId]._escalares = {};
        siguiente[sistemaId]._escalares[partes[0]] = Number(valorNuevo);
        guardarOverrides(siguiente);
        return siguiente;
      }

      // Tarifa anidada: ['tarifas' | 'tipos', key1, key2, campo]
      if (partes[0] === 'tarifas') {
        const [, irr, campo] = partes;
        if (!siguiente[sistemaId][irr]) siguiente[sistemaId][irr] = {};
        siguiente[sistemaId][irr][campo] = Number(valorNuevo);
      } else if (partes[0] === 'tipos') {
        const [, tipoKey, irr, campo] = partes;
        if (!siguiente[sistemaId][tipoKey]) siguiente[sistemaId][tipoKey] = {};
        if (!siguiente[sistemaId][tipoKey][irr]) siguiente[sistemaId][tipoKey][irr] = {};
        siguiente[sistemaId][tipoKey][irr][campo] = Number(valorNuevo);
      } else if (partes[0] === '_planosBase') {
        const [, irr] = partes;
        if (!siguiente[sistemaId]._planosBase) siguiente[sistemaId]._planosBase = {};
        siguiente[sistemaId]._planosBase[irr] = Number(valorNuevo);
      }

      guardarOverrides(siguiente);
      return siguiente;
    });
  }, []);

  /**
   * Confirma un lote de cambios y lo registra en historial.
   * cambios: [{ sistemaId, path, valorAnterior, valorNuevo, etiqueta }]
   */
  const confirmarCambios = useCallback((cambios) => {
    if (!cambios || cambios.length === 0) return;

    const entrada = {
      id: Date.now(),
      fecha: new Date().toISOString(),
      cambios,
    };

    setHistorial(prev => {
      const siguiente = [entrada, ...prev].slice(0, MAX_HISTORY);
      guardarHistorial(siguiente);
      return siguiente;
    });
  }, []);

  /**
   * Restaura un sistema a sus valores por defecto.
   */
  const resetearSistema = useCallback((sistemaId) => {
    setOverrides(prev => {
      const siguiente = { ...prev };
      const sistemaBase = sistemasBase[sistemaId];
      const tarifasActuales = extraerTarifasBase(sistemas[sistemaId]);
      const tarifasDefault = extraerTarifasBase(sistemaBase);

      // Registrar en historial antes de borrar
      const cambios = [];
      // Comparación superficial para registrar diferencias
      const registrarDiffs = (actual, base, prefijo = '') => {
        for (const [k, v] of Object.entries(base)) {
          if (typeof v === 'object' && v !== null) {
            registrarDiffs(actual?.[k] ?? {}, v, `${prefijo}${k}.`);
          } else {
            const valActual = actual?.[k];
            if (valActual !== undefined && valActual !== v) {
              cambios.push({
                sistemaId,
                path: `${prefijo}${k}`,
                valorAnterior: valActual,
                valorNuevo: v,
                etiqueta: `Reset ${prefijo}${k}`,
              });
            }
          }
        }
      };
      registrarDiffs(tarifasActuales, tarifasDefault);

      delete siguiente[sistemaId];
      guardarOverrides(siguiente);

      if (cambios.length > 0) {
        const entrada = {
          id: Date.now(),
          fecha: new Date().toISOString(),
          tipo: 'reset',
          cambios,
        };
        setHistorial(prevH => {
          const sig = [entrada, ...prevH].slice(0, MAX_HISTORY);
          guardarHistorial(sig);
          return sig;
        });
      }

      return siguiente;
    });
  }, [sistemas]);

  /**
   * Restaura todos los sistemas a defaults.
   */
  const resetearTodo = useCallback(() => {
    guardarOverrides({});
    setOverrides({});
  }, []);

  /**
   * ¿Tiene un sistema algún override activo?
   */
  const tieneOverrides = useCallback((sistemaId) => {
    return !!overrides[sistemaId] && Object.keys(overrides[sistemaId]).length > 0;
  }, [overrides]);

  return {
    sistemas,
    overrides,
    historial,
    actualizarTarifa,
    confirmarCambios,
    resetearSistema,
    resetearTodo,
    tieneOverrides,
  };
}