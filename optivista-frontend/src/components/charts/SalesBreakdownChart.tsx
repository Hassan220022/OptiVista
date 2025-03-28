import React from 'react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend
} from 'recharts';
import Card from '../ui/Card';
import { ChartSkeleton } from '../ui/Skeleton';
import { formatCurrency, formatPercentage } from '../../utils/formatting';

export interface SalesBreakdownChartProps {
  data: Array<{
    [key: string]: string | number;
    amount: number;
    percentage: number;
  }>;
  title?: string;
  isLoading?: boolean;
  height?: number;
  dataKey?: string;
  nameKey?: string;
}

const SalesBreakdownChart: React.FC<SalesBreakdownChartProps> = ({
  data,
  title = 'Sales Breakdown',
  isLoading = false,
  height = 300,
  dataKey = 'amount',
  nameKey = 'name'
}) => {
  // Define colors for the pie chart segments
  const COLORS = [
    '#3b82f6', // blue-500
    '#10b981', // green-500
    '#f59e0b', // amber-500
    '#ef4444', // red-500
    '#8b5cf6', // purple-500
    '#ec4899', // pink-500
    '#06b6d4', // cyan-500
    '#14b8a6'  // teal-500
  ];

  if (isLoading) {
    return <ChartSkeleton height={height} />;
  }

  // Custom label for the pie slices
  const renderCustomizedLabel = (props: any) => {
    const { cx, cy, midAngle, innerRadius, outerRadius, percent, index } = props;
    
    // Only show label if the slice is large enough
    if (percent < 0.05) return null;
    
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * Math.PI / 180);
    const y = cy + radius * Math.sin(-midAngle * Math.PI / 180);
    
    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor="middle" 
        dominantBaseline="central"
        fontSize={12}
        fontWeight="bold"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };
  
  // Custom tooltip component
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-gray-200 rounded shadow-md">
          <p className="font-medium text-sm">{item[nameKey]}</p>
          <p className="text-gray-700 text-sm">
            Amount: {formatCurrency(item.amount)}
          </p>
          <p className="text-gray-700 text-sm">
            Percentage: {formatPercentage(item.percentage)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="bg-white" title={title}>
      <div style={{ height: `${height}px` }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderCustomizedLabel}
              outerRadius={height / 3}
              fill="#8884d8"
              dataKey={dataKey}
              nameKey={nameKey}
            >
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={COLORS[index % COLORS.length]} 
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              layout="horizontal" 
              verticalAlign="bottom" 
              align="center"
              formatter={(value, entry, index) => (
                <span className="text-sm">
                  {value} ({formatPercentage(data[index].percentage)})
                </span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default SalesBreakdownChart; 