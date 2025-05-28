// Mover todas las importaciones al inicio
import React, { useState } from 'react';
import { useGastos } from '../../context/GastosContext';
import { useTheme } from '../../context/ThemeContext';
import Navbar from '../Navbar/Navbar';
import { 
  MdTrendingUp, 
  MdTrendingDown, 
  MdAccountBalance,
  MdDateRange,
  MdCategory,
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
import { 
  Chart as ChartJS, 
  ArcElement, 
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend 
} from 'chart.js';
import { Pie, Bar, Line } from 'react-chartjs-2';
import './Dashboard.css';
import { MdAttachMoney,
  MdQueryStats,
  MdPriceCheck,
  MdOutlineCategory
} from 'react-icons/md';

// Definir las categorías antes de usar
export const CATEGORIAS = {
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

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const { gastos = [] } = useGastos();
  const { isDark } = useTheme();
  const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;
  const [error, setError] = useState(null);

 
  // Add this calculation after gastosPorCategoria and before the error checks
  const totalGastos = gastos?.reduce((sum, gasto) => sum + Number(gasto.monto), 0) || 0;
  const gastosPorCategoria = gastos?.reduce((acc, gasto) => {
    acc[gasto.categoria] = (acc[gasto.categoria] || 0) + Number(gasto.monto);
    return acc;
  }, {}) || {};
  
  // Add the promedioDiario calculation here
  const diasUnicos = [...new Set(gastos.map(g => g.fecha))].length || 1;
  const promedioDiario = totalGastos / diasUnicos;

  // Add error boundary for data loading
  if (!gastos) {
    return <div>Cargando datos...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const categoriaMaxGasto = Object.entries(gastosPorCategoria)
    .sort(([,a], [,b]) => b - a)[0]?.[0] || 'N/A';

  // Datos para el gráfico de pastel
  const pieData = {
    labels: Object.keys(gastosPorCategoria).map(cat => CATEGORIAS[cat]?.label || cat),
    datasets: [{
      data: Object.values(gastosPorCategoria),
      backgroundColor: [
        '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
        '#FF9F40', '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'
      ]
    }]
  };

  // Datos para el gráfico de barras (últimos 7 días)
  const ultimos7Dias = [...Array(7)].map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - i);
    return d.toISOString().split('T')[0];
  }).reverse();

  const barData = {
    labels: ultimos7Dias.map(fecha => new Date(fecha).toLocaleDateString()),
    datasets: [{
      label: 'Gastos por día',
      data: ultimos7Dias.map(fecha => 
        gastos
          .filter(g => g.fecha === fecha)
          .reduce((sum, g) => sum + Number(g.monto), 0)
      ),
      backgroundColor: '#36A2EB'
    }]
  };

  // Agregar cálculos adicionales
  const gastosMesActual = gastos.filter(gasto => {
    const fecha = new Date(gasto.fecha);
    const ahora = new Date();
    return fecha.getMonth() === ahora.getMonth() && 
           fecha.getFullYear() === ahora.getFullYear();
  });

  const gastosMesAnterior = gastos.filter(gasto => {
    const fecha = new Date(gasto.fecha);
    const ahora = new Date();
    const mesAnterior = ahora.getMonth() === 0 ? 11 : ahora.getMonth() - 1;
    const año = ahora.getMonth() === 0 ? ahora.getFullYear() - 1 : ahora.getFullYear();
    return fecha.getMonth() === mesAnterior && fecha.getFullYear() === año;
  });

  const totalMesActual = gastosMesActual.reduce((sum, gasto) => sum + Number(gasto.monto), 0);
  const totalMesAnterior = gastosMesAnterior.reduce((sum, gasto) => sum + Number(gasto.monto), 0);

  // Mejorar el cálculo de la variación mensual
  const variacionMensual = totalMesAnterior === 0 
    ? totalMesActual > 0 ? 100 : 0
    : ((totalMesActual - totalMesAnterior) / totalMesAnterior) * 100;
  
  // En el return, actualizar la tarjeta de Gastos Mes Actual
  <div className="stat-card">
    <MdTrendingUp className="stat-icon" />
    <div className="stat-info">
      <h3>Gastos Mes Actual</h3>
      <p>${totalMesActual.toFixed(2)}</p>
      <div className={`trend-indicator ${variacionMensual >= 0 ? 'trend-up' : 'trend-down'}`}>
        {variacionMensual >= 0 ? <MdTrendingUp /> : <MdTrendingDown />}
        <span>
          {totalMesAnterior === 0 
            ? totalMesActual > 0 
              ? 'Primer mes con gastos'
              : 'Sin gastos registrados'
            : `${Math.abs(variacionMensual).toFixed(1)}% vs mes anterior`
          }
        </span>
      </div>
    </div>
  </div>

  // Datos para el gráfico de línea (tendencia mensual)
  const ultimos6Meses = [...Array(6)].map((_, i) => {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    return d;
  }).reverse();

  // Update the lineData configuration with distinct colors
  const lineData = {
    labels: ultimos6Meses.map(fecha => 
      fecha.toLocaleDateString('es-ES', { month: 'short', year: 'numeric' })
    ),
    datasets: Object.keys(CATEGORIAS).map((categoria, index) => {
      // Predefined distinct colors for each category
      const categoryColors = [
        '#FF6384', // Red
        '#36A2EB', // Blue
        '#FFCE56', // Yellow
        '#4BC0C0', // Teal
        '#9966FF', // Purple
        '#FF9F40', // Orange
        '#8AC24A', // Green
        '#FF5252', // Bright Red
        '#2196F3', // Bright Blue
        '#FFEB3B'  // Bright Yellow
      ];
      
      return {
        label: CATEGORIAS[categoria].label,
        data: ultimos6Meses.map(fecha => {
          return gastos
            .filter(g => {
              const gFecha = new Date(g.fecha);
              return gFecha.getMonth() === fecha.getMonth() && 
                     gFecha.getFullYear() === fecha.getFullYear() &&
                     g.categoria === categoria;
            })
            .reduce((sum, g) => sum + Number(g.monto), 0);
        }),
        borderColor: categoryColors[index % categoryColors.length],
        backgroundColor: categoryColors[index % categoryColors.length],
        tension: 0.4,
        fill: false
      };
    })
  };

  return (
    <div className={`dashboard-container ${isDark ? 'dark-mode' : ''}`}>
      <Navbar 
        activePage="dashboard"
        user={user}
      />

      <div className="dashboard-content">
        <h1 className="dashboard-title">Panel de Control</h1>

        <div className="stats-cards">
          {/* 4 tarjetas existentes - mantienen sus iconos actuales */}
          <div className="stat-card">
            <MdAccountBalance className="stat-icon" />
            <div className="stat-info">
              <h3>Total Gastos</h3>
              <p>${totalGastos.toFixed(2)}</p>
            </div>
          </div>

          <div className="stat-card">
            <MdTrendingUp className="stat-icon" />
            <div className="stat-info">
              <h3>Gastos Mes Actual</h3>
              <p>${totalMesActual.toFixed(2)}</p>
              <div className={`trend-indicator ${variacionMensual >= 0 ? 'trend-up' : 'trend-down'}`}>
                {variacionMensual >= 0 ? <MdTrendingUp /> : <MdTrendingDown />}
                <span>{Math.abs(variacionMensual).toFixed(1)}% vs mes anterior</span>
              </div>
            </div>
          </div>

          <div className="stat-card">
            <MdCategory className="stat-icon" />
            <div className="stat-info">
              <h3>Categoría Principal</h3>
              <p>{CATEGORIAS[categoriaMaxGasto]?.label || categoriaMaxGasto}</p>
            </div>
          </div>

          <div className="stat-card">
            <MdDateRange className="stat-icon" />
            <div className="stat-info">
              <h3>Total Registros</h3>
              <p>{gastos.length}</p>
            </div>
          </div>

          {/* Nuevas tarjetas con iconos diferentes */}
          <div className="stat-card">
            <MdAttachMoney className="stat-icon" /> {/* Cambio de icono */}
            <div className="stat-info">
              <h3>Promedio Mensual</h3>
              <p>${(totalGastos / (gastos.length || 1)).toFixed(2)}</p>
            </div>
          </div>
          
          <div className="stat-card">
            <MdQueryStats className="stat-icon" /> {/* Cambio de icono */}
            <div className="stat-info">
              <h3>Promedio Diario</h3>
              <p>${promedioDiario.toFixed(2)}</p>
            </div>
          </div>

          <div className="stat-card">
            <MdOutlineCategory className="stat-icon" /> {/* Cambio de icono */}
            <div className="stat-info">
              <h3>Total Categorías</h3>
              <p>{Object.keys(gastosPorCategoria).length}</p>
            </div>
          </div>
        </div>

        <div className="charts-container">
          <div className="pie-chart-card">
            <h3>Distribución por Categoría</h3>
            <div className="pie-chart-container">
              <Pie data={pieData} options={{ 
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'bottom',
                    align: 'start',
                    labels: {
                      boxWidth: 12,
                      padding: 15
                    }
                  }
                }
              }} />
            </div>
          </div>
          
          <div className="charts-column">
            <div className="chart-card">
              <h3>Gastos Últimos 7 Días</h3>
              <div className="bar-chart-container">
                <Bar data={barData} options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: { y: { beginAtZero: true } }
                }} />
              </div>
            </div>
          
            <div className="chart-card">
              <h3>Tendencia de Gastos (6 meses)</h3>
              <div className="line-chart-container">
                
                <Line data={lineData} options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: { 
                    y: { 
                      beginAtZero: true,
                      title: {
                        display: true,
                        text: 'Monto ($)'
                      }
                    },
                    x: {
                      title: {
                        display: true,
                        text: 'Mes'
                      }
                    }
                  },
                  plugins: {
                    legend: {
                      position: 'bottom',
                      labels: {
                        boxWidth: 12,
                        padding: 20
                      }
                    }
                  }
                }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;