import React, { useState } from 'react';
import Header from './components/Header';
import SistemaSelector from './components/SistemaSelector';
import DatosProyecto from './components/DatosProyecto';
import ServiciosMIVED from './components/ServiciosMIVED';
import Validaciones from './components/Validaciones';
import ResultadosCostos from './components/ResultadosCostos';
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
          <div className="space-y-6">
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