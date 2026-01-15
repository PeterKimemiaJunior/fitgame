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
  data: number[];
  color?: string;
}

export function SimpleLineChart({ labels, data, color = '#10b981' }: SimpleLineChartProps) {
  // SOLUÇÃO: Desabilitando a regra eslint para esta linha específica
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
        callbacks: {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          label: (context: any) => `${context.parsed.y} pts`,
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