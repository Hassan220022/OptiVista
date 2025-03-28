import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Card from '../../components/ui/Card';
import DashboardService, { 
  DashboardSummary,
  SalesOverview, 
  SalesBreakdown,
  TopSellingProduct,
  PopularArModel,
  RecentActivity,
  ChartData
} from '../../services/DashboardService';
import { formatCurrency, formatNumber, formatDate, formatPercentage } from '../../utils/formatting';
import { ROUTES, API_ENDPOINTS } from '../../utils/constants';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import { useNotification } from '../../hooks/useNotification';
import SalesChart from '../../components/charts/SalesChart';
import OrdersChart from '../../components/charts/OrdersChart';
import SalesBreakdownChart from '../../components/charts/SalesBreakdownChart';
import { StatCardSkeleton, TableRowSkeleton } from '../../components/ui/Skeleton';
import { scheduleDataReload, clearScheduledReload } from '../../utils/reload-data';

const DashboardPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [dashboardData, setDashboardData] = useState<DashboardSummary | null>(null);
  const [period, setPeriod] = useState<'daily' | 'weekly' | 'monthly' | 'yearly'>('monthly');
  const [error, setError] = useState<string | null>(null);
  const { showNotification } = useNotification();
  
  // Add state for real-time refresh interval
  const [autoRefresh, setAutoRefresh] = useState<boolean>(false);
  const [autoRefreshInterval, setAutoRefreshInterval] = useState<number | null>(null);
  
  useEffect(() => {
    const fetchDashboardData = async () => {
      if (refreshing) return; // Prevent multiple simultaneous fetches
      
      setRefreshing(true);
      
      if (!dashboardData) {
        setIsLoading(true);
      }
      
      setError(null);
      
      try {
        // Fetch complete dashboard summary
        const data = await DashboardService.getDashboardSummary(period);
        setDashboardData(data);
        
        if (refreshing && !isLoading) {
          showNotification('Dashboard data refreshed successfully', 'success');
        }
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data. Please try again later.');
        
        if (refreshing && !isLoading) {
          showNotification('Failed to refresh dashboard data', 'error');
        }
      } finally {
        setIsLoading(false);
        setRefreshing(false);
      }
    };
    
    fetchDashboardData();
  }, [period, showNotification, refreshing, isLoading]);
  
  // Set up auto-refresh
  useEffect(() => {
    // Clean up previous interval if exists
    if (autoRefreshInterval) {
      clearScheduledReload(autoRefreshInterval);
      setAutoRefreshInterval(null);
    }
    
    // Set new interval if auto-refresh is enabled
    if (autoRefresh) {
      const intervalId = scheduleDataReload(() => {
        setRefreshing(true);
      }, 60000); // Refresh every minute
      
      setAutoRefreshInterval(intervalId);
      showNotification('Auto-refresh enabled (every 60 seconds)', 'info');
    }
    
    // Cleanup on component unmount
    return () => {
      if (autoRefreshInterval) {
        clearScheduledReload(autoRefreshInterval);
      }
    };
  }, [autoRefresh, showNotification]);
  
  // Handler for period change
  const handlePeriodChange = (newPeriod: 'daily' | 'weekly' | 'monthly' | 'yearly') => {
    setPeriod(newPeriod);
  };
  
  // Handler for manual refresh
  const handleManualRefresh = () => {
    setRefreshing(true);
  };
  
  // Handler for auto-refresh toggle
  const toggleAutoRefresh = () => {
    setAutoRefresh(prevState => !prevState);
  };
  
  // Loading state for initial load
  if (isLoading && !dashboardData) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <div className="animate-pulse h-8 w-20 bg-gray-200 rounded"></div>
        </div>
        
        <div className="grid grid-cols-1 gap-6 mb-6 sm:grid-cols-2 lg:grid-cols-4">
          <StatCardSkeleton />
          <StatCardSkeleton />
          <StatCardSkeleton />
          <StatCardSkeleton />
        </div>
        
        <div className="grid grid-cols-1 gap-6 mb-6 lg:grid-cols-2">
          <StatCardSkeleton />
          <StatCardSkeleton />
        </div>
      </div>
    );
  }
  
  // Error state for failed load
  if (error && !dashboardData) {
    return (
      <div className="text-center p-6 bg-red-50 rounded-lg">
        <svg className="w-12 h-12 mx-auto text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 className="mt-3 text-lg font-semibold text-red-800">Error Loading Dashboard</h3>
        <p className="mt-2 text-sm text-red-600">{error}</p>
        <Button variant="primary" className="mt-4" onClick={handleManualRefresh}>
          Retry
        </Button>
      </div>
    );
  }
  
  // If no data is available, use default placeholder or display a message
  if (!dashboardData) {
    return (
      <div className="text-center p-6">
        <h3 className="text-lg font-semibold">No Dashboard Data Available</h3>
        <p className="mt-2 text-sm text-gray-600">Please check your connection to the backend service.</p>
        <Button variant="primary" className="mt-4" onClick={handleManualRefresh}>
          Refresh
        </Button>
      </div>
    );
  }
  
  // We have data to display
  const data = dashboardData;
  
  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-1 text-gray-600">Overview of your store's performance</p>
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
      <div className="flex items-center justify-between mb-6">
        <div className="flex space-x-2">
          <Button 
            variant={period === 'daily' ? 'primary' : 'light'} 
            size="sm" 
            onClick={() => handlePeriodChange('daily')}
          >
            Daily
          </Button>
          <Button 
            variant={period === 'weekly' ? 'primary' : 'light'} 
            size="sm" 
            onClick={() => handlePeriodChange('weekly')}
          >
            Weekly
          </Button>
          <Button 
            variant={period === 'monthly' ? 'primary' : 'light'} 
            size="sm" 
            onClick={() => handlePeriodChange('monthly')}
          >
            Monthly
          </Button>
          <Button 
            variant={period === 'yearly' ? 'primary' : 'light'} 
            size="sm" 
            onClick={() => handlePeriodChange('yearly')}
          >
            Yearly
          </Button>
        </div>
        <Button 
          variant="light" 
          size="sm" 
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
          onClick={handleManualRefresh}
          disabled={refreshing}
        >
          {refreshing ? 'Refreshing...' : 'Refresh'}
        </Button>
      </div>
      
      {/* Sales overview cards */}
      <div className="grid grid-cols-1 gap-6 mb-6 sm:grid-cols-2 lg:grid-cols-4">
        <Card 
          className="bg-white" 
          title="Total Sales" 
          subtitle={formatCurrency(data.salesOverview.totalSales)}
        >
          <div className="mt-2">
            <span className={`text-sm font-medium ${data.salesOverview.salesGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {data.salesOverview.salesGrowth >= 0 ? '↑' : '↓'} {formatPercentage(Math.abs(data.salesOverview.salesGrowth))}
            </span>
            <span className="text-sm text-gray-500 ml-1">from previous {period}</span>
          </div>
        </Card>
        
        <Card 
          className="bg-white" 
          title="Total Orders"
          subtitle={formatNumber(data.salesOverview.totalOrders)}
        >
          <div className="mt-2">
            <span className={`text-sm font-medium ${data.salesOverview.ordersGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {data.salesOverview.ordersGrowth >= 0 ? '↑' : '↓'} {formatPercentage(Math.abs(data.salesOverview.ordersGrowth))}
            </span>
            <span className="text-sm text-gray-500 ml-1">from previous {period}</span>
          </div>
        </Card>
        
        <Card 
          className="bg-white" 
          title="Average Order Value"
          subtitle={formatCurrency(data.salesOverview.averageOrderValue)}
        >
          <div className="mt-2">
            <span className={`text-sm font-medium ${data.salesOverview.aovGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {data.salesOverview.aovGrowth >= 0 ? '↑' : '↓'} {formatPercentage(Math.abs(data.salesOverview.aovGrowth))}
            </span>
            <span className="text-sm text-gray-500 ml-1">from previous {period}</span>
          </div>
        </Card>
        
        <Card 
          className="bg-white" 
          title="Conversion Rate"
          subtitle={formatPercentage(data.salesOverview.conversionRate)}
        >
          <div className="mt-2">
            <span className={`text-sm font-medium ${data.salesOverview.conversionRateGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {data.salesOverview.conversionRateGrowth >= 0 ? '↑' : '↓'} {formatPercentage(Math.abs(data.salesOverview.conversionRateGrowth), 2)}
            </span>
            <span className="text-sm text-gray-500 ml-1">from previous {period}</span>
          </div>
        </Card>
      </div>
      
      {/* Charts */}
      <div className="grid grid-cols-1 gap-6 mb-6 lg:grid-cols-2">
        <SalesChart data={data.salesChart} title="Sales Trend" isLoading={refreshing} />
        <OrdersChart data={data.ordersChart} title="Orders Trend" isLoading={refreshing} />
      </div>
      
      {/* Sales Breakdown */}
      <div className="grid grid-cols-1 gap-6 mb-6 lg:grid-cols-2">
        <SalesBreakdownChart 
          data={data.salesBreakdown.byCategory} 
          title="Sales by Category" 
          isLoading={refreshing}
          nameKey="category"
        />
        <SalesBreakdownChart 
          data={data.salesBreakdown.byPaymentMethod} 
          title="Sales by Payment Method" 
          isLoading={refreshing}
          nameKey="method"
        />
      </div>
      
      {/* Top Selling Products */}
      <div className="mb-6">
        <Card className="bg-white" title="Top Selling Products">
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
                {refreshing ? (
                  // Show skeleton loader during refresh
                  Array(4).fill(0).map((_, index) => (
                    <TableRowSkeleton key={index} columns={3} />
                  ))
                ) : data.topSellingProducts.length > 0 ? (
                  data.topSellingProducts.map((product) => (
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
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="px-6 py-4 text-center text-sm text-gray-500">No top selling products data available</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
      
      {/* Popular AR Models */}
      <div className="mb-6">
        <Card className="bg-white" title="Popular AR Models">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Model</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Views</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Conversion Rate</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {refreshing ? (
                  // Show skeleton loader during refresh
                  Array(3).fill(0).map((_, index) => (
                    <TableRowSkeleton key={index} columns={3} />
                  ))
                ) : data.popularArModels.length > 0 ? (
                  data.popularArModels.map((model) => (
                    <tr key={model.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {model.thumbnailUrl && (
                            <div className="flex-shrink-0 h-10 w-10 mr-4">
                              <img className="h-10 w-10 rounded-md" src={model.thumbnailUrl} alt={model.name} />
                            </div>
                          )}
                          <div>
                            <div className="text-sm font-medium text-gray-900">{model.name}</div>
                            <div className="text-sm text-gray-500">ID: {model.id}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatNumber(model.viewCount)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatPercentage(model.conversionRate)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="px-6 py-4 text-center text-sm text-gray-500">No popular AR models data available</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
      
      {/* Recent Activity */}
      <div className="mb-6">
        <Card className="bg-white" title="Recent Activity">
          <div className="space-y-4 mt-2">
            {refreshing ? (
              // Show skeleton loader during refresh
              <div className="animate-pulse space-y-4">
                {Array(4).fill(0).map((_, index) => (
                  <div key={index} className="flex space-x-4">
                    <div className="rounded-full bg-gray-200 h-10 w-10"></div>
                    <div className="flex-1 space-y-2 py-1">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : data.recentActivity.length > 0 ? (
              data.recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start">
                  <div className="mr-4">
                    {activity.type === 'order' && (
                      <div className="bg-blue-100 p-2 rounded-full">
                        <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                      </div>
                    )}
                    {activity.type === 'customer' && (
                      <div className="bg-green-100 p-2 rounded-full">
                        <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                    )}
                    {activity.type === 'product' && (
                      <div className="bg-yellow-100 p-2 rounded-full">
                        <svg className="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
                        </svg>
                      </div>
                    )}
                    {activity.type === 'ar-model' && (
                      <div className="bg-purple-100 p-2 rounded-full">
                        <svg className="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="flex items-center">
                      <h4 className="text-sm font-medium text-gray-900">{activity.title}</h4>
                      <Badge className="ml-2" color={
                        activity.type === 'order' ? 'blue' :
                        activity.type === 'customer' ? 'green' :
                        activity.type === 'product' ? 'yellow' : 'purple'
                      } size="sm" variant="subtle">
                        {activity.type}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
                    <p className="text-xs text-gray-500 mt-1">{formatDate(new Date(activity.timestamp))}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-4 text-sm text-gray-500">No recent activity</div>
            )}
          </div>
        </Card>
      </div>
      
      {/* Quick Actions */}
      <div className="mb-6">
        <Card className="bg-white" title="Quick Actions">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mt-2">
            <Link to={ROUTES.PRODUCTS}>
              <Button variant="primary" className="w-full" size="sm">View All Products</Button>
            </Link>
            <Link to={ROUTES.AR_MODELS}>
              <Button variant="primary" className="w-full" size="sm">Manage AR Models</Button>
            </Link>
            <Link to={ROUTES.ORDERS}>
              <Button variant="primary" className="w-full" size="sm">View Recent Orders</Button>
            </Link>
            <Link to={ROUTES.CUSTOMERS}>
              <Button variant="primary" className="w-full" size="sm">Customer Database</Button>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage; 