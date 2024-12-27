import React from 'react';
import { LucideIcon } from 'lucide-react';
import { Card } from '../../common/Card';

interface StatCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  change: string;
}

export function StatCard({ title, value, icon: Icon, change }: StatCardProps) {
  const isPositive = change.startsWith('+');
  
  return (
    <Card>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-semibold text-gray-900">{value}</p>
        </div>
        <div className="p-2 bg-blue-50 rounded-lg">
          <Icon className="w-6 h-6 text-blue-600" />
        </div>
      </div>
      <div className="mt-4">
        <span className={`text-sm ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
          {change} from last month
        </span>
      </div>
    </Card>
  );
}