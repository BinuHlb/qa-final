'use client';

import React, { useEffect, useState } from 'react';

interface MonthlyData {
  month: string;
  reviews: number;
}

interface StatusData {
  name: string;
  value: number;
}

interface DashboardChartsProps {
  monthlyData: MonthlyData[];
  statusData: StatusData[];
  pieColors: string[];
}

export function MonthlyReviewsChart({ monthlyData }: { monthlyData: MonthlyData[] }) {
  const [ChartComponents, setChartComponents] = useState<any>(null);

  useEffect(() => {
    const loadCharts = async () => {
      const recharts = await import('recharts');
      setChartComponents(recharts);
    };
    loadCharts();
  }, []);

  if (!ChartComponents) {
    return (
      <div className="flex items-center justify-center h-[350px]">
        <div className="text-muted-foreground">Loading chart...</div>
      </div>
    );
  }

  const { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } = ChartComponents;

  return (
    <div style={{ width: '100%', height: 350 }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={monthlyData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="reviews" fill="#0393a8" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function StatusDistributionChart({ statusData, pieColors }: { statusData: StatusData[]; pieColors: string[] }) {
  const [ChartComponents, setChartComponents] = useState<any>(null);

  useEffect(() => {
    const loadCharts = async () => {
      const recharts = await import('recharts');
      setChartComponents(recharts);
    };
    loadCharts();
  }, []);

  if (!ChartComponents) {
    return (
      <div className="flex items-center justify-center h-[350px]">
        <div className="text-muted-foreground">Loading chart...</div>
      </div>
    );
  }

  const { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } = ChartComponents;

  // Helper for Pie label
  const pieLabel = (props: any) => {
    const { name, percent } = props;
    return `${name} ${(percent * 100).toFixed(0)}%`;
  };

  return (
    <div style={{ width: '100%', height: 350 }} key={`pie-${JSON.stringify(statusData)}-${JSON.stringify(pieColors)}`}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={statusData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={pieLabel}
            outerRadius={80}
            dataKey="value"
            fill="#8884d8"
          >
            {statusData.map((entry, index) => (
              <Cell key={`cell-${index}-${entry.name}`} fill={pieColors[index]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
