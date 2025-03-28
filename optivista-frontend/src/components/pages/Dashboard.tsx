import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import Card from '../ui/Card';
import DashboardService, { DashboardSummary, ChartData, SalesByCategory, SalesByPaymentMethod } from '../../services/DashboardService';
import { formatCurrency, formatNumber, formatPercentage } from '../../utils/formatting';
import { ROUTES } from '../../utils/constants';
import Button from '../ui/Button';
import { useNotification } from '../../hooks/useNotification';
import { StatCardSkeleton, ChartSkeleton } from '../ui/Skeleton';
import SalesChart from '../charts/SalesChart';
import OrdersChart from '../charts/OrdersChart';
import SalesBreakdownChart from '../charts/SalesBreakdownChart';

const Dashboard = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [dashboardData, setDashboardData] = useState<DashboardSummary | null>(null);
  const [period, setPeriod] = useState<'daily' | 'weekly' | 'monthly' | 'yearly'>('monthly');
  const [error, setError] = useState<string | null>(null);
  const { showNotification } = useNotification?.() || {};
  
  // Auto-refresh functionality
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [autoRefreshInterval, setAutoRefreshInterval] = useState<number | null>(null);
  
  const fetchDashboardData = useCallback(async (showLoadingState = true) => {
    try {
      if (showLoadingState) {
        setIsLoading(true);
      }
      setError(null);
      
      const data = await DashboardService.getDashboardSummary(period);
      setDashboardData(data);
      
      if (!showLoadingState && showNotification) {
        showNotification('Dashboard data refreshed successfully', 'success');
      }
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
      setError('Could not load dashboard data. Please try again later.');
      
      if (!showLoadingState && showNotification) {
        showNotification('Failed to refresh dashboard data', 'error');
      }
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  }, [period, showNotification]);
  
  // Initial data fetch
  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);
  
  // Set up auto-refresh
  useEffect(() => {
    if (autoRefreshInterval) {
      clearInterval(autoRefreshInterval);
      setAutoRefreshInterval(null);
    }
    
    if (autoRefresh) {
      const intervalId = window.setInterval(() => {
        if (!refreshing) {
          setRefreshing(true);
          fetchDashboardData(false);
        }
      }, 60000); // Refresh every 60 seconds
      
      setAutoRefreshInterval(intervalId);
      
      if (showNotification) {
        showNotification('Auto-refresh enabled (every 60 seconds)', 'info');
      }
    }
    
    return () => {
      if (autoRefreshInterval) {
        clearInterval(autoRefreshInterval);
      }
    };
  }, [autoRefresh, fetchDashboardData, refreshing, showNotification]);
  
  // Handle manual refresh
  const handleRefresh = () => {
    if (refreshing) return;
    
    setRefreshing(true);
    fetchDashboardData(false);
  };
  
  // Toggle auto-refresh
  const toggleAutoRefresh = () => {
    setAutoRefresh(prev => !prev);
  };
  
  if (isLoading && !dashboardData) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <div className="animate-pulse h-8 w-20 bg-gray-200 rounded"></div>
        </div>
        
        <div className="grid grid-cols-1 gap-6 mb-6 sm:grid-cols-2 lg:grid-cols-4">
          <StatCardSkeleton />
          <StatCardSkeleton />
          <StatCardSkeleton />
          <StatCardSkeleton />
        </div>
        
        <div className="grid grid-cols-1 gap-6 mb-6 lg:grid-cols-2">
          <ChartSkeleton height={300} />
          <ChartSkeleton height={300} />
        </div>
      </div>
    );
  }
  
  if (error && !dashboardData) {
    return (
      <div className="text-center p-6 bg-red-50 rounded-lg">
        <h3 className="text-lg font-medium text-red-800">Error Loading Dashboard</h3>
        <p className="mt-2 text-red-600">{error}</p>
        <Button className="mt-4" onClick={handleRefresh}>Retry</Button>
      </div>
    );
  }
  
  // Handle case when there's no data available
  if (!dashboardData) {
    return (
      <div className="text-center p-6">
        <h3 className="text-lg font-semibold">No Dashboard Data Available</h3>
        <p className="mt-2 text-gray-600">Please check your connection to the backend service.</p>
        <Button className="mt-4" onClick={handleRefresh}>Refresh</Button>
      </div>
    );
  }
  
  // Use the fetched data directly
  const data = dashboardData;
  
  return (
    <div className="p-6">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-gray-600">Overview of your store's performance</p>
        </div>
        <div className="flex items-center space-x-2">
          <span className={`flex h-3 w-3 ${autoRefresh ? 'animate-ping-slow' : ''}`}>
            <span className={`animate-ping absolute inline-flex h-3 w-3 rounded-full opacity-75 ${autoRefresh ? 'bg-green-400' : 'bg-gray-400'}`}></span>
            <span className={`relative inline-flex rounded-full h-3 w-3 ${autoRefresh ? 'bg-green-500' : 'bg-gray-500'}`}></span>
          </span>
          <span className="text-sm text-gray-500">
            {autoRefresh ? 'Auto-refresh on' : 'Auto-refresh off'}
          </span>
          <Button
            variant="light"
            size="sm"
            onClick={toggleAutoRefresh}
          >
            {autoRefresh ? 'Disable' : 'Enable'}
          </Button>
        </div>
      </div>
      
      {/* Period selector */}
      <div className="flex justify-between mb-6">
        <div className="flex space-x-2">
          <Button 
            variant={period === 'daily' ? 'primary' : 'light'} 
            onClick={() => setPeriod('daily')}
          >
            Daily
          </Button>
          <Button 
            variant={period === 'weekly' ? 'primary' : 'light'} 
            onClick={() => setPeriod('weekly')}
          >
            Weekly
          </Button>
          <Button 
            variant={period === 'monthly' ? 'primary' : 'light'} 
            onClick={() => setPeriod('monthly')}
          >
            Monthly
          </Button>
          <Button 
            variant={period === 'yearly' ? 'primary' : 'light'} 
            onClick={() => setPeriod('yearly')}
          >
            Yearly
          </Button>
        </div>
        <Button 
          variant="light"
          onClick={handleRefresh} 
          disabled={refreshing}
          rightIcon={
            refreshing ? (
              <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            )
          }
        >
          {refreshing ? 'Refreshing...' : 'Refresh'}
        </Button>
      </div>
      
      {/* Sales overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <Card title="Total Sales" subtitle={formatCurrency(data.salesOverview.totalSales)}>
          <p className={`text-sm ${data.salesOverview.salesGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {data.salesOverview.salesGrowth >= 0 ? '↑' : '↓'} {formatPercentage(data.salesOverview.salesGrowth)} from previous period
          </p>
        </Card>
        
        <Card title="Total Orders" subtitle={formatNumber(data.salesOverview.totalOrders)}>
          <p className={`text-sm ${data.salesOverview.ordersGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {data.salesOverview.ordersGrowth >= 0 ? '↑' : '↓'} {formatPercentage(data.salesOverview.ordersGrowth)} from previous period
          </p>
        </Card>
        
        <Card title="Average Order Value" subtitle={formatCurrency(data.salesOverview.averageOrderValue)}>
          <p className={`text-sm ${data.salesOverview.aovGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {data.salesOverview.aovGrowth >= 0 ? '↑' : '↓'} {formatPercentage(data.salesOverview.aovGrowth)} from previous period
          </p>
        </Card>
        
        <Card title="Conversion Rate" subtitle={formatPercentage(data.salesOverview.conversionRate)}>
          <p className={`text-sm ${data.salesOverview.conversionRateGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {data.salesOverview.conversionRateGrowth >= 0 ? '↑' : '↓'} {formatPercentage(data.salesOverview.conversionRateGrowth)} from previous period
          </p>
        </Card>
      </div>
      
      {/* Charts */}
      <div className="grid grid-cols-1 gap-6 mb-6 lg:grid-cols-2">
        <SalesChart 
          data={data.salesChart.map(item => ({
            date: item.date,
            revenue: item.revenue,
            profit: item.profit
          }))} 
          title="Sales Trend" 
          isLoading={refreshing} 
        />
        <OrdersChart 
          data={data.ordersChart.map(item => ({
            date: item.date,
            orders: item.orders || 0,
            canceled: item.canceled || 0,
            target: item.target
          }))} 
          title="Orders Trend" 
          isLoading={refreshing} 
        />
      </div>
      
      {/* Sales breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <SalesBreakdownChart 
          data={data.salesBreakdown.byCategory.map(item => ({
            ...item,
            name: item.category
          }))} 
          title="Sales by Category" 
          isLoading={refreshing}
          nameKey="name"
        />
        <SalesBreakdownChart 
          data={data.salesBreakdown.byPaymentMethod.map(item => ({
            ...item,
            name: item.method
          }))} 
          title="Sales by Payment Method" 
          isLoading={refreshing}
          nameKey="name"
        />
      </div>
      
      {/* Top selling products */}
      {data.topSellingProducts && data.topSellingProducts.length > 0 && (
        <Card title="Top Selling Products" className="mb-6">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Units Sold</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data.topSellingProducts.map((product) => (
                  <tr key={product.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {product.imageUrl && (
                          <div className="flex-shrink-0 h-10 w-10 mr-4">
                            <img className="h-10 w-10 rounded-full" src={product.imageUrl} alt={product.name} />
                          </div>
                        )}
                        <div>
                          <div className="text-sm font-medium text-gray-900">{product.name}</div>
                          <div className="text-sm text-gray-500">ID: {product.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatNumber(product.unitsSold)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatCurrency(product.revenue)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
      
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link to="/products/new">
            <Button className="w-full">Add New Product</Button>
          </Link>
          <Link to="/ar-models/new">
            <Button className="w-full">Upload AR Model</Button>
          </Link>
          <Link to="/orders">
            <Button className="w-full">View Recent Orders</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 