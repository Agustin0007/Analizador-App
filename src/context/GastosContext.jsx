import React, { createContext, useContext, useState, useEffect } from 'react';

const GastosContext = createContext();

export function GastosProvider({ children }) {
  const [gastos, setGastos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    try {
      const savedGastos = localStorage.getItem('gastos');
      setGastos(savedGastos ? JSON.parse(savedGastos) : []);
    } catch (err) {
      setError('Error al cargar los gastos');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('gastos', JSON.stringify(gastos));
    } catch (err) {
      setError('Error al guardar los gastos');
    }
  }, [gastos]);

  const addGasto = (gasto) => {
    try {
      setGastos([...gastos, { ...gasto, id: Date.now().toString() }]);
    } catch (err) {
      throw new Error('Error al agregar gasto');
    }
  };

  const editGasto = (id, gastoActualizado) => {
    try {
      setGastos(gastos.map(gasto => 
        gasto.id === id ? { ...gastoActualizado, id } : gasto
      ));
    } catch (err) {
      throw new Error('Error al editar gasto');
    }
  };

  const deleteGasto = (id) => {
    try {
      setGastos(gastos.filter(gasto => gasto.id !== id));
    } catch (err) {
      throw new Error('Error al eliminar gasto');
    }
  };

  return (
    <GastosContext.Provider value={{ 
      gastos, 
      addGasto, 
      editGasto, 
      deleteGasto,
      loading,
      error
    }}>
      {children}
    </GastosContext.Provider>
  );
}

export function useGastos() {
  const context = useContext(GastosContext);
  if (!context) {
    throw new Error('useGastos debe usarse dentro de un GastosProvider');
  }
  return context;
}