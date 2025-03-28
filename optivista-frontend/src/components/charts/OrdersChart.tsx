import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell,
  ReferenceLine
} from 'recharts';
import Card from '../ui/Card';
import { ChartSkeleton } from '../ui/Skeleton';
import { formatNumber } from '../../utils/formatting';

export interface OrdersChartProps {
  data: Array<{
    date: string;
    orders: number;
    canceled: number;
    target?: number;
  }>;
  title?: string;
  isLoading?: boolean;
  height?: number;
}

const OrdersChart: React.FC<OrdersChartProps> = ({
  data,
  title = 'Orders Trend',
  isLoading = false,
  height = 300
}) => {
  if (isLoading) {
    return <ChartSkeleton height={height} />;
  }

  // Calculate the max value for proper YAxis display
  const maxValue = Math.max(
    ...data.map(item => Math.max(item.orders, item.target || 0))
  );
  
  // Custom tooltip formatter
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded shadow-md">
          <p className="font-medium text-sm">{label}</p>
          <p className="text-blue-600 text-sm">
            Orders: {formatNumber(payload[0].value)}
          </p>
          {payload[1] && (
            <p className="text-red-500 text-sm">
              Canceled: {formatNumber(payload[1].value)}
            </p>
          )}
          {payload[2] && (
            <p className="text-gray-500 text-sm">
              Target: {formatNumber(payload[2].value)}
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="bg-white" title={title}>
      <div style={{ height: `${height}px` }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
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
              tickFormatter={(value) => formatNumber(value)}
              tick={{ fontSize: 12, fill: '#666' }}
              tickLine={false}
              axisLine={{ stroke: '#eee' }}
              domain={[0, maxValue * 1.1]} // Add 10% padding to top
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              verticalAlign="top" 
              height={36}
              wrapperStyle={{ paddingTop: '10px' }}
            />
            <Bar 
              dataKey="orders" 
              name="Orders" 
              fill="#3b82f6" 
              radius={[4, 4, 0, 0]}
              barSize={12}
            />
            <Bar 
              dataKey="canceled" 
              name="Canceled" 
              fill="#ef4444" 
              radius={[4, 4, 0, 0]} 
              barSize={12}
            />
            {/* Target line */}
            {data.some(item => item.target !== undefined) && (
              <ReferenceLine 
                y={data[0]?.target} 
                stroke="#9ca3af" 
                strokeDasharray="3 3"
                label={{ value: 'Target', position: 'right', fill: '#9ca3af', fontSize: 12 }}
              />
            )}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default OrdersChart; 