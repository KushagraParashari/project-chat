import React from 'react';
import { Line, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { getLast7Days } from '../../lib/features';

// ✅ Register chart components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
);

// ✅ Prepare labels once
const labels = getLast7Days();

// ✅ Line chart data generator
const lineData = ({ value }) => ({
  labels,
  datasets: [
    {
      label: 'Messages',
      data: value,
      backgroundColor: 'rgba(75,192,192,0.4)',
      fill: true,
      borderColor: 'rgba(75,192,192,1)',
      tension: 0.1,
    },
    {
      label: 'Chats',
      data: [5, 15, 25, 35, 45, 55, 65],
      backgroundColor: 'rgba(153,102,255,0.4)',
      fill: true,
      borderColor: 'rgba(153,102,255,1)',
      tension: 0.1,
    },
  ],
});

// ✅ Chart options
const lineOptions = {
  responsive: true,
  plugins: {
    legend: {
      display: false,
    },
    title: {
      display: false,
    },
  },
  interaction: {
    mode: 'index',
    intersect: false,
  },
  scales: {
    x: {
      grid: { display: false },
      title: {
        display: true,
        text: 'Days',
      },
    },
    y: {
      grid: { display: false },
      title: {
        display: true,
        text: 'Number of Messages',
      },
    },
  },
};

// ✅ Doughnut data
const doughnutData = ({ value, labels }) => ({
  labels,
  datasets: [
    {
      labels,
      data: value,
      backgroundColor: ['#FF6384', '#36A2EB'],
      hoverOffset: 4,
      tension: 0.1,
      offset: 4
    },
  ],
})

// ✅ LineChart Component
export const LineChart = ({ value = [] }) => {
  return <Line data={lineData({ value })} options={lineOptions} id="line-chart" />;
};

// ✅ DoughnutChart Component
export const DoughnutChart = ({ value = [], labels = [] }) => {
  return <Doughnut data={doughnutData({ value, labels })} id="doughnut-chart" />;
};
