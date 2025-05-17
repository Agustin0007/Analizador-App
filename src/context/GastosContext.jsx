import React, { createContext, useContext, useState, useEffect } from 'react';

const GastosContext = createContext();

export function GastosProvider({ children }) {
  const [gastos, setGastos] = useState(() => {
    const savedGastos = localStorage.getItem('gastos');
    return savedGastos ? JSON.parse(savedGastos) : [];
  });

  useEffect(() => {
    localStorage.setItem('gastos', JSON.stringify(gastos));
  }, [gastos]);

  const addGasto = (gasto) => {
    setGastos([...gastos, { ...gasto, id: Date.now().toString() }]);
  };

  const editGasto = (id, gastoActualizado) => {
    setGastos(gastos.map(gasto => 
      gasto.id === id ? { ...gastoActualizado, id } : gasto
    ));
  };

  const deleteGasto = (id) => {
    setGastos(gastos.filter(gasto => gasto.id !== id));
  };

  return (
    <GastosContext.Provider value={{ gastos, addGasto, editGasto, deleteGasto }}>
      {children}
    </GastosContext.Provider>
  );
}

export function useGastos() {
  return useContext(GastosContext);
}