import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface StatsChartProps {
  labels: string[];
  data: number[];
  color?: string;
  label: string;
}

export function StatsChart({ labels, data, color = '#3b82f6', label }: StatsChartProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const options: any = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { font: { size: 10 } },
      },
      y: {
        grid: { color: '#f3f4f6' },
        beginAtZero: true,
        ticks: { font: { size: 10 } },
      },
    },
  };

  const chartData = {
    labels,
    datasets: [
      {
        label,
        data,
        backgroundColor: color,
        borderRadius: 4,
      },
    ],
  };

  return (
    <div className="h-40 w-full">
      <Bar data={chartData} options={options} />
    </div>
  );
}