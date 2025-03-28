import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  AreaChart,
  Area
} from 'recharts';
import Card from '../ui/Card';
import { ChartSkeleton } from '../ui/Skeleton';
import { formatCurrency } from '../../utils/formatting';

export interface SalesChartProps {
  data: Array<{
    date: string;
    revenue: number;
    profit: number;
  }>;
  title?: string;
  isLoading?: boolean;
  height?: number;
  showArea?: boolean;
}

const SalesChart: React.FC<SalesChartProps> = ({
  data,
  title = 'Sales Trend',
  isLoading = false,
  height = 300,
  showArea = true
}) => {
  if (isLoading) {
    return <ChartSkeleton height={height} />;
  }

  // Custom tooltip formatter
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded shadow-md">
          <p className="font-medium text-sm">{label}</p>
          <p className="text-blue-600 text-sm">
            Revenue: {formatCurrency(payload[0].value)}
          </p>
          <p className="text-green-600 text-sm">
            Profit: {formatCurrency(payload[1].value)}
          </p>
        </div>
      );
    }
    return null;
  };

  // Custom legend dot renderer
  const renderLegendDot = (color: string) => {
    return <div className={`inline-block w-3 h-3 mr-2 rounded-full bg-${color}`} />;
  };

  const Chart = showArea ? AreaChart : LineChart;
  const ChartComponent = showArea ? Area : Line;

  return (
    <Card className="bg-white" title={title}>
      <div style={{ height: `${height}px` }}>
        <ResponsiveContainer width="100%" height="100%">
          <Chart
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
            <XAxis 
              dataKey="date" 
              tick={{ fontSize: 12, fill: '#666' }}
              tickLine={false}
              axisLine={{ stroke: '#eee' }}
            />
            <YAxis 
              tickFormatter={(value) => formatCurrency(value)}
              tick={{ fontSize: 12, fill: '#666' }}
              tickLine={false}
              axisLine={{ stroke: '#eee' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              verticalAlign="top" 
              height={36}
              wrapperStyle={{ paddingTop: '10px' }}
            />
            {showArea ? (
              <>
                <Area
                  type="monotone"
                  dataKey="revenue"
                  name="Revenue"
                  stroke="#3b82f6"
                  fillOpacity={0.1}
                  fill="#3b82f6"
                  strokeWidth={2}
                />
                <Area
                  type="monotone"
                  dataKey="profit"
                  name="Profit"
                  stroke="#10b981"
                  fillOpacity={0.1}
                  fill="#10b981"
                  strokeWidth={2}
                />
              </>
            ) : (
              <>
                <Line
                  type="monotone"
                  dataKey="revenue"
                  name="Revenue"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={{ stroke: '#3b82f6', strokeWidth: 2, r: 4, fill: 'white' }}
                  activeDot={{ stroke: '#3b82f6', strokeWidth: 2, r: 6, fill: 'white' }}
                />
                <Line
                  type="monotone"
                  dataKey="profit"
                  name="Profit"
                  stroke="#10b981"
                  strokeWidth={2}
                  dot={{ stroke: '#10b981', strokeWidth: 2, r: 4, fill: 'white' }}
                  activeDot={{ stroke: '#10b981', strokeWidth: 2, r: 6, fill: 'white' }}
                />
              </>
            )}
          </Chart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default SalesChart; 