import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useGastos } from '../../context/GastosContext';
import { FaEdit, FaTrash, FaTimes } from 'react-icons/fa';
import { BsSun, BsMoon } from 'react-icons/bs';
import { 
  MdFastfood, 
  MdDirectionsCar, 
  MdSportsEsports, 
  MdHome, 
  MdSchool, 
  MdLocalHospital, 
  MdShoppingCart, 
  MdWork, 
  MdLocalAtm,
  MdMoreHoriz
} from 'react-icons/md';
import { BsCurrencyDollar, BsFileText } from 'react-icons/bs';
import { IoCalendarOutline } from 'react-icons/io5';
import { IoMdPricetag } from 'react-icons/io';
import { HiPlus } from 'react-icons/hi';
import Navbar from '../Navbar/Navbar';
import './Gastos.css';

const CATEGORIAS = {
  alimentacion: { label: 'Alimentación', icon: MdFastfood },
  transporte: { label: 'Transporte', icon: MdDirectionsCar },
  entretenimiento: { label: 'Entretenimiento', icon: MdSportsEsports },
  servicios: { label: 'Servicios', icon: MdHome },
  educacion: { label: 'Educación', icon: MdSchool },
  salud: { label: 'Salud', icon: MdLocalHospital },
  compras: { label: 'Compras', icon: MdShoppingCart },
  trabajo: { label: 'Trabajo', icon: MdWork },
  inversiones: { label: 'Inversiones', icon: MdLocalAtm },
  otros: { label: 'Otros', icon: MdMoreHoriz }
};

const GastoForm = ({ onClose, onSubmit, editingGasto }) => {
  const [formData, setFormData] = useState({
    monto: editingGasto?.monto || '',
    categoria: editingGasto?.categoria || '',
    fecha: editingGasto?.fecha || new Date().toISOString().split('T')[0],
    descripcion: editingGasto?.descripcion || ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  const CategoryIcon = CATEGORIAS[formData.categoria]?.icon || MdMoreHoriz;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-button" onClick={onClose}>
          <FaTimes />
        </button>
        <h2 className="form-title">
          <HiPlus className="title-icon" />
          {editingGasto ? 'Editar Gasto' : 'Registrar Nuevo Gasto'}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Monto</label>
            <div className="input-icon-wrapper">
              <BsCurrencyDollar className="input-icon" />
              <input
                type="number"
                placeholder="Monto"
                value={formData.monto}
                onChange={(e) => setFormData({...formData, monto: e.target.value})}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Categoría</label>
            <div className="input-icon-wrapper">
              <IoMdPricetag className="input-icon" />
              <select
                value={formData.categoria}
                onChange={(e) => setFormData({...formData, categoria: e.target.value})}
                required
                className="category-select"
              >
                <option value="">Selecciona una categoría</option>
                {Object.entries(CATEGORIAS).map(([value, { label }]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Fecha</label>
            <div className="input-icon-wrapper">
              <IoCalendarOutline className="input-icon" />
              <input
                type="date"
                value={formData.fecha}
                onChange={(e) => setFormData({...formData, fecha: e.target.value})}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Descripción</label>
            <div className="input-icon-wrapper">
              <BsFileText className="input-icon" />
              <input
                type="text"
                placeholder="Descripcion"
                value={formData.descripcion}
                onChange={(e) => setFormData({...formData, descripcion: e.target.value})}
              />
            </div>
          </div>

          <button type="submit" className="submit-button">
            <HiPlus />
            {editingGasto ? 'Actualizar Gasto' : 'Registrar Gasto'}
          </button>
        </form>
      </div>
    </div>
  );
};

const Gastos = () => {
  const [darkMode, setDarkMode] = useState(false);
  const { gastos = [], addGasto, editGasto, deleteGasto } = useGastos();
  const [showModal, setShowModal] = useState(false);
  const [editingGasto, setEditingGasto] = useState(null);
  const [showSidebar, setShowSidebar] = useState(false);

  useEffect(() => {
    const isDark = localStorage.getItem('darkMode') === 'true';
    setDarkMode(isDark);
    document.body.classList.toggle('dark-mode', isDark);
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('darkMode', newDarkMode);
    document.body.classList.toggle('dark-mode', newDarkMode);
  };

  const handleSubmit = (gastoData) => {
    try {
      // Validate amount (monto)
      const monto = parseFloat(gastoData.monto);
      if (isNaN(monto) || monto <= 0) {
        toast.error('El monto debe ser un número mayor a 0', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: darkMode ? "dark" : "light",
        });
        return;
      }
  
      // Validate category
      if (!gastoData.categoria) {
        toast.warning('Debe seleccionar una categoría', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: darkMode ? "dark" : "light",
        });
        return;
      }
  
      // Validate date
      const selectedDate = new Date(gastoData.fecha);
      const currentDate = new Date();
      if (selectedDate > currentDate) {
        toast.error('La fecha no puede ser futura', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: darkMode ? "dark" : "light",
        });
        return;
      }
  
      // Validate description
      if (gastoData.descripcion && gastoData.descripcion.length > 100) {
        toast.warning('La descripción no puede exceder los 100 caracteres', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: darkMode ? "dark" : "light",
        });
        return;
      }
  
      if (editingGasto) {
        editGasto(editingGasto.id, gastoData);
        toast.success('Gasto actualizado exitosamente', {
          position: "top-right",
          autoClose: 2000,
          theme: darkMode ? "dark" : "light",
        });
      } else {
        addGasto({
          ...gastoData,
          id: Date.now().toString(),
          fecha: gastoData.fecha
        });
        toast.success('Gasto registrado exitosamente', {
          position: "top-right",
          autoClose: 2000,
          theme: darkMode ? "dark" : "light",
        });
      }
      setShowModal(false);
      setEditingGasto(null);
    } catch (error) {
      toast.error('Error al guardar el gasto: ' + error.message, {
        position: "top-right",
        autoClose: 4000,
        theme: darkMode ? "dark" : "light",
      });
      console.error('Error al guardar el gasto:', error);
    }
  };

  return (
    <div className={`gastos-container ${darkMode ? 'dark-mode' : ''} ${showSidebar ? 'sidebar-open' : ''}`}>
      <Navbar 
        activePage="gastos" 
        darkMode={darkMode} 
        toggleDarkMode={toggleDarkMode}
        showSidebar={showSidebar}
        setShowSidebar={setShowSidebar}
      />
      <div className="gastos-header">
        <h1 className="gastos-title">Lista de Gastos</h1>
      </div>
      
      <div className="gastos-table">
        <div className="table-header">
          <div>Fecha</div>
          <div>Categoría</div>
          <div>Descripción</div>
          <div>Monto</div>
          <div>Acciones</div>
        </div>
        
        <div className="table-body">
          {gastos.map(gasto => {
            const CategoryIcon = CATEGORIAS[gasto.categoria]?.icon || MdMoreHoriz;
            return (
              <div key={gasto.id} className="table-row">
                <div>{new Date(gasto.fecha).toLocaleDateString()}</div>
                <div className="categoria-cell">
                  <CategoryIcon className="categoria-icon" />
                  {CATEGORIAS[gasto.categoria]?.label || 'Otros'}
                </div>
                <div>{gasto.descripcion || '-'}</div>
                <div>${Number(gasto.monto).toFixed(2)}</div>
                <div className="actions">
                  <button onClick={() => {
                    setEditingGasto(gasto);
                    setShowModal(true);
                  }} className="edit-button">
                    <FaEdit />
                  </button>
                  <button onClick={() => deleteGasto(gasto.id)} className="delete-button">
                    <FaTrash />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      
      <button className="add-button" onClick={() => setShowModal(true)}>
        <HiPlus /> Registrar Gasto
      </button>

      {showModal && (
        <GastoForm
          onClose={() => {
            setShowModal(false);
            setEditingGasto(null);
          }}
          onSubmit={handleSubmit}
          editingGasto={editingGasto}
        />
      )}
    </div>
  );
};

export default Gastos;