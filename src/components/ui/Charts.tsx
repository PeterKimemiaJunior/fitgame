/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface SimpleLineChartProps {
  labels: string[];
  // CORREÇÃO: Permite null para que o gráfico pare a linha em dias sem dados
  data: (number | null)[]; 
  color?: string;
}

export function SimpleLineChart({ labels, data, color = '#10b981' }: SimpleLineChartProps) {
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
        callbacks: {
          // Se o valor for null, mostra "Sem registro", senão mostra o valor
          label: (context: any) => {
            if (context.parsed.y === null) return 'Sem registro';
            return `${context.parsed.y} pts`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: {
          font: { size: 10 },
          maxTicksLimit: 7,
        },
      },
      y: {
        grid: { color: '#f3f4f6', drawBorder: false },
        beginAtZero: true,
        ticks: { display: false },
        border: { display: false },
      },
    },
    elements: {
      line: {
        tension: 0.4,
        borderWidth: 2,
        // Propriedade para garantir que ChartJS pare a linha em valores nulos
        spanGaps: false, 
      },
      point: {
        radius: 3,
        hitRadius: 10,
        hoverRadius: 5,
      },
    },
  };

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Adesão',
        data,
        borderColor: color,
        backgroundColor: color.replace(')', ', 0.1)').replace('rgb', 'rgba'),
        fill: true,
      },
    ],
  };

  return (
    <div className="h-40 w-full">
      <Line data={chartData} options={options} />
    </div>
  );
}