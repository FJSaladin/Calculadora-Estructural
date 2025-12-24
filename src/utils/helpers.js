export const calcularAreaTotal = (areasNiveles) => {
  return Object.values(areasNiveles).reduce((sum, area) => {
    return sum + (parseFloat(area) || 0);
  }, 0);
};

// Ya no es necesaria, pero la dejamos por compatibilidad
export const encontrarIrregularidad = (valor) => {
  const opciones = [0, 20, 40, 60, 80, 100];
  return opciones.reduce((prev, curr) => 
    Math.abs(curr - valor) < Math.abs(prev - valor) ? curr : prev
  );
};