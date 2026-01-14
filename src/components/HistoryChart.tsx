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
import type { DailyLog } from '../types';

// Registrar componentes
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

interface HistoryChartProps {
  logs: DailyLog[];
}

export function HistoryChart({ logs }: HistoryChartProps) {
  const labels = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d.toLocaleDateString('pt-BR', { weekday: 'short' });
  });

  const dataPoints = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const dateKey = d.toISOString().split('T')[0];
    
    const log = logs.find(l => l.date === dateKey);
    return log ? log.points : 0;
  });

  const data = {
    labels,
    datasets: [
      {
        label: 'Pontos Ganhos',
        data: dataPoints,
        borderColor: '#059669',
        backgroundColor: 'rgba(16, 185, 129, 0.2)',
        tension: 0.4,
        fill: true,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const options: any = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            size: 10,
          },
        },
      },
      y: {
        grid: {
          color: '#f3f4f6',
        },
        beginAtZero: true,
        ticks: {
          font: {
            size: 10,
          },
          stepSize: 10,
        },
      },
    },
    elements: {
      line: {
        borderWidth: 3,
      },
    },
  };

  return (
    <div className="h-48 w-full">
      <Line data={data} options={options} />
    </div>
  );
}