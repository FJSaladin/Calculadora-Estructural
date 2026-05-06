import React, { useState, useEffect } from 'react';
import Header from './components/layout/Header';
import SistemaSelector from './components/sistema/SistemaSelector';
import DatosProyecto from './components/formulario/DatosProyecto';
import ServiciosMIVED from './components/formulario/ServiciosMIVED';
import Validaciones from './components/resultados/Validaciones';
import ResultadosCostos from './components/resultados/ResultadosCostos';
import { useValidaciones } from './hooks/useValidaciones';
import { useValidacionCampos } from './hooks/useValidacionCampos';
import { useCalculos } from './hooks/useCalculos';

function App() {
  const [sistemaSeleccionado, setSistemaSeleccionado] = useState('');
  const [datosProyecto, setDatosProyecto] = useState({
    niveles: '',
    areasNiveles: {},
    alturasNiveles: {}, 
    irregularidad: '',
    continuidad: '1',
    zona: '1',
    alturaNivel: '',
    numPlanchas: '',
    tipoDual: 'intermedia',
    tipoMetalico: 'porticos_arriostramiento',
  });
  const [gestionMIVED, setGestionMIVED] = useState(false);
// Cargar datos guardados al iniciar
  useEffect(() => {
    const sistemaGuardado = localStorage.getItem('shizzo_sistema');
    const datosGuardados = localStorage.getItem('shizzo_datos');
    const mivedGuardado = localStorage.getItem('shizzo_mived');

    if (sistemaGuardado) setSistemaSeleccionado(sistemaGuardado);
    if (datosGuardados) setDatosProyecto(JSON.parse(datosGuardados));
    if (mivedGuardado) setGestionMIVED(JSON.parse(mivedGuardado));
  }, []);

  // Guardar cada vez que cambia algo
  useEffect(() => {
    localStorage.setItem('shizzo_sistema', sistemaSeleccionado);
    localStorage.setItem('shizzo_datos', JSON.stringify(datosProyecto));
    localStorage.setItem('shizzo_mived', JSON.stringify(gestionMIVED));
  }, [sistemaSeleccionado, datosProyecto, gestionMIVED]);

  const handleSistemaChange = (nuevoSistema) => {
    setSistemaSeleccionado(nuevoSistema);
    setDatosProyecto({
      niveles: '',
      areasNiveles: {},
      alturasNiveles: {},
      irregularidad: '',
      continuidad: '1',
      zona: '',
      alturaNivel: '',
      numPlanchas: '',
      tipoDual: 'intermedia',
      tipoMetalico: 'porticos_arriostramiento',
    });
    setGestionMIVED(false);
  }; 

  const validaciones = useValidaciones(sistemaSeleccionado, datosProyecto);
  const validacionCampos = useValidacionCampos(sistemaSeleccionado, datosProyecto);
  const calculos = useCalculos(
    sistemaSeleccionado, 
    datosProyecto, 
    gestionMIVED, 
    validaciones.valido && validacionCampos.todosCompletos
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-6xl mx-auto">
        <Header />
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-6 no-print">
            <SistemaSelector 
              sistemaSeleccionado={sistemaSeleccionado}
              setSistemaSeleccionado={handleSistemaChange}
            />

            {sistemaSeleccionado && (
              <>
                <DatosProyecto
                  sistemaSeleccionado={sistemaSeleccionado}
                  datosProyecto={datosProyecto}
                  setDatosProyecto={setDatosProyecto}
                  validacionCampos={validacionCampos}
                />
                
                <ServiciosMIVED
                  gestionMIVED={gestionMIVED}
                  setGestionMIVED={setGestionMIVED}
                />
              </>
            )}
          </div>

          <div className="space-y-6">
            <Validaciones 
              sistemaSeleccionado={sistemaSeleccionado}
              validaciones={validaciones}
            />
            
            <ResultadosCostos
              sistemaSeleccionado={sistemaSeleccionado}
              calculos={calculos}
              validaciones={validaciones} 
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;