import React, { useState } from 'react';
import Header from './components/Header';
import SistemaSelector from './components/SistemaSelector';
import DatosProyecto from './components/DatosProyecto';
import ServiciosMIBE from './components/ServiciosMIBE';
import Validaciones from './components/Validaciones';
import ResultadosCostos from './components/ResultadosCostos';
import { useValidaciones } from './hooks/useValidaciones';
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
  const [gestionMIBE, setGestionMIBE] = useState(false);

  const validaciones = useValidaciones(sistemaSeleccionado, datosProyecto);
  const calculos = useCalculos(sistemaSeleccionado, datosProyecto, gestionMIBE, validaciones.valido);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-6xl mx-auto">
        <Header />
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-6">
            <SistemaSelector 
              sistemaSeleccionado={sistemaSeleccionado}
              setSistemaSeleccionado={setSistemaSeleccionado}
            />

            {sistemaSeleccionado && (
              <>
                <DatosProyecto
                  sistemaSeleccionado={sistemaSeleccionado}
                  datosProyecto={datosProyecto}
                  setDatosProyecto={setDatosProyecto}
                />
                
                <ServiciosMIBE
                  gestionMIBE={gestionMIBE}
                  setGestionMIBE={setGestionMIBE}
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
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;