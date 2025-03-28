import { API_BASE_URL, API_ENDPOINTS } from '../utils/constants';
import ApiService from './ApiService';

// Dashboard data types
export interface SalesOverview {
  totalSales: number;
  salesGrowth: number;
  totalOrders: number;
  ordersGrowth: number;
  averageOrderValue: number;
  aovGrowth: number;
  conversionRate: number;
  conversionRateGrowth: number;
}

export interface SalesByCategory {
  category: string;
  amount: number;
  percentage: number;
}

export interface SalesByPaymentMethod {
  method: string;
  amount: number;
  percentage: number;
}

export interface SalesBreakdown {
  byCategory: SalesByCategory[];
  byPaymentMethod: SalesByPaymentMethod[];
}

export interface TopSellingProduct {
  id: string;
  name: string;
  imageUrl?: string;
  unitsSold: number;
  revenue: number;
}

export interface PopularArModel {
  id: string;
  name: string;
  thumbnailUrl?: string;
  viewCount: number;
  conversionRate: number;
}

export interface RecentActivity {
  id: string;
  type: 'order' | 'customer' | 'product' | 'ar-model';
  title: string;
  description: string;
  timestamp: string;
}

export interface ChartData {
  date: string;
  revenue: number;
  profit: number;
  orders?: number;
  canceled?: number;
  target?: number;
}

export interface DashboardSummary {
  salesOverview: SalesOverview;
  salesBreakdown: SalesBreakdown;
  topSellingProducts: TopSellingProduct[];
  popularArModels: PopularArModel[];
  recentActivity: RecentActivity[];
  salesChart: ChartData[];
  ordersChart: ChartData[];
}

/**
 * Service for fetching dashboard data and analytics
 */
class DashboardServiceClass {
  private cachedData: Map<string, { data: DashboardSummary, timestamp: number }> = new Map();
  private CACHE_TTL = 5 * 60 * 1000; // 5 minutes cache
  
  /**
   * Fetch dashboard summary including sales, products, and activities
   * @param period The time period to fetch data for
   * @returns A dashboard summary object
   */
  async getDashboardSummary(period: 'daily' | 'weekly' | 'monthly' | 'yearly' = 'monthly'): Promise<DashboardSummary> {
    const cacheKey = `dashboard_${period}`;
    const now = Date.now();
    const cachedItem = this.cachedData.get(cacheKey);
    
    // Return cached data if it's still valid
    if (cachedItem && (now - cachedItem.timestamp) < this.CACHE_TTL) {
      console.log('Returning cached dashboard data for', period);
      return cachedItem.data;
    }
    
    try {
      // First try to fetch real data from the API
      try {
        console.log(`Fetching dashboard data from API for period: ${period}`);
        const endpoint = `${API_BASE_URL}${API_ENDPOINTS.DASHBOARD_SUMMARY}`;
        const response = await ApiService.get<DashboardSummary>(endpoint, { period });
        
        // Cache the response
        this.cachedData.set(cacheKey, {
          data: response,
          timestamp: now
        });
        
        return response;
      } catch (apiError) {
        console.warn('Could not fetch dashboard data from API, falling back to mock data:', apiError);
        
        // Fall back to mock data only if API request fails
        const mockData = this.generateMockData(period);
        
        // Still cache the mock data to avoid regenerating it frequently
        this.cachedData.set(cacheKey, {
          data: mockData,
          timestamp: now
        });
        
        return mockData;
      }
    } catch (error) {
      console.error('Error in getDashboardSummary:', error);
      throw new Error('Failed to fetch dashboard data. Please try again later.');
    }
  }
  
  /**
   * Clear all cached dashboard data
   */
  clearCache(): void {
    this.cachedData.clear();
    console.log('Dashboard data cache cleared');
  }
  
  /**
   * Generate mock data for development and testing
   * @param period The time period to generate mock data for
   * @returns A mock dashboard summary object
   * @private
   */
  private generateMockData(period: string): DashboardSummary {
    console.log(`Generating mock dashboard data for period: ${period}`);
    
    // Base values that will be adjusted based on period
    const baseValues = {
      sales: 78450,
      salesGrowth: 12.5,
      orders: 1240,
      ordersGrowth: 8.3,
      aov: 63.27,
      aovGrowth: 3.7,
      conversionRate: 3.2,
      conversionRateGrowth: 0.8
    };
    
    // Adjust values based on period
    let multiplier: number;
    let chartLength: number;
    
    switch (period) {
      case 'daily':
        multiplier = 0.033; // Roughly 1/30th of monthly
        chartLength = 24; // 24 hours
        break;
      case 'weekly':
        multiplier = 0.25; // Roughly 1/4th of monthly
        chartLength = 7; // 7 days
        break;
      case 'yearly':
        multiplier = 12; // 12x monthly
        chartLength = 12; // 12 months
        break;
      case 'monthly':
      default:
        multiplier = 1; // Base case is monthly
        chartLength = 30; // 30 days
        break;
    }
    
    // Adjust values with multiplier
    const adjustedValues = {
      sales: baseValues.sales * multiplier,
      salesGrowth: baseValues.salesGrowth * (0.8 + Math.random() * 0.4), // +/- 20% randomness
      orders: Math.round(baseValues.orders * multiplier),
      ordersGrowth: baseValues.ordersGrowth * (0.8 + Math.random() * 0.4),
      aov: baseValues.aov * (0.9 + Math.random() * 0.2), // +/- 10% randomness
      aovGrowth: baseValues.aovGrowth * (0.8 + Math.random() * 0.4),
      conversionRate: baseValues.conversionRate * (0.9 + Math.random() * 0.2),
      conversionRateGrowth: baseValues.conversionRateGrowth * (0.7 + Math.random() * 0.6) // +/- 30% randomness
    };
    
    // Generate chart data
    const salesChartData: ChartData[] = [];
    const ordersChartData: ChartData[] = [];
    
    let dateFormatter: (i: number) => string;
    
    // Format dates based on period
    switch (period) {
      case 'daily':
        dateFormatter = (i: number) => `${i}:00`;
        break;
      case 'weekly':
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        dateFormatter = (i: number) => days[i % 7];
        break;
      case 'yearly':
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        dateFormatter = (i: number) => months[i % 12];
        break;
      case 'monthly':
      default:
        dateFormatter = (i: number) => `Day ${i + 1}`;
        break;
    }
    
    // Generate trend data with some randomness but following a pattern
    for (let i = 0; i < chartLength; i++) {
      const date = dateFormatter(i);
      
      // Create a wave pattern with some randomness
      const dayFactor = Math.sin(i / (chartLength / 6) * Math.PI) * 0.2 + 0.8;
      const randomFactor = 0.8 + Math.random() * 0.4; // +/- 20% randomness
      
      const daySales = (adjustedValues.sales / chartLength) * dayFactor * randomFactor;
      const dayProfit = daySales * (0.25 + Math.random() * 0.1); // 25-35% profit margin
      const dayOrders = Math.round((adjustedValues.orders / chartLength) * dayFactor * randomFactor);
      const dayCanceled = Math.round(dayOrders * (0.02 + Math.random() * 0.03)); // 2-5% cancellation rate
      
      // Create chart data points
      salesChartData.push({
        date,
        revenue: daySales,
        profit: dayProfit
      });
      
      ordersChartData.push({
        date,
        orders: dayOrders,
        canceled: dayCanceled,
        // Add a target line for some periods
        target: (period === 'monthly' || period === 'yearly') ? 
          Math.round((adjustedValues.orders / chartLength) * 1.1) : undefined,
        // Add required properties from ChartData interface
        revenue: 0,
        profit: 0
      });
    }
    
    // Generate sales breakdown by category
    const categories = ['Furniture', 'Electronics', 'Clothing', 'Home Decor', 'Other'];
    const salesByCategory: SalesByCategory[] = categories.map((category, index) => {
      // Different weights for different categories
      const weights = [0.35, 0.25, 0.2, 0.15, 0.05];
      const amount = adjustedValues.sales * weights[index] * (0.8 + Math.random() * 0.4);
      return { category, amount, percentage: weights[index] };
    });
    
    // Generate sales breakdown by payment method
    const paymentMethods = ['Credit Card', 'PayPal', 'Bank Transfer', 'Apple Pay', 'Google Pay'];
    const salesByPaymentMethod: SalesByPaymentMethod[] = paymentMethods.map((method, index) => {
      // Different weights for different payment methods
      const weights = [0.4, 0.3, 0.15, 0.1, 0.05];
      const amount = adjustedValues.sales * weights[index] * (0.8 + Math.random() * 0.4);
      return { method, amount, percentage: weights[index] };
    });
    
    // Generate top selling products
    const productNames = [
      'Modern Sofa Set', 'LED TV Stand', 'Coffee Table', 'Ergonomic Office Chair',
      'Dining Table Set', 'Bookshelf', 'Bedside Lamp', 'Area Rug'
    ];
    
    const topSellingProducts: TopSellingProduct[] = productNames.slice(0, 5).map((name, index) => {
      const unitsSold = Math.round((adjustedValues.orders / 4) * (0.9 - index * 0.15) * (0.8 + Math.random() * 0.4));
      const revenue = unitsSold * adjustedValues.aov * (0.8 + Math.random() * 0.4);
      return {
        id: `PROD-${1000 + index}`,
        name,
        imageUrl: `https://source.unsplash.com/100x100/?furniture,${name.replace(' ', '')}`,
        unitsSold,
        revenue
      };
    });
    
    // Generate popular AR models
    const arModelNames = [
      'Living Room Set', 'Office Desk', 'Dining Room Set', 'Bedroom Set',
      'Kitchen Set', 'Outdoor Furniture'
    ];
    
    const popularArModels: PopularArModel[] = arModelNames.slice(0, 4).map((name, index) => {
      const viewCount = Math.round(adjustedValues.orders * (3 - index * 0.5) * (0.8 + Math.random() * 0.4));
      const conversionRate = (0.08 - index * 0.01) * (0.8 + Math.random() * 0.4);
      return {
        id: `AR-${2000 + index}`,
        name,
        thumbnailUrl: `https://source.unsplash.com/100x100/?furniture,${name.replace(' ', '')}`,
        viewCount,
        conversionRate
      };
    });
    
    // Generate recent activity
    const activityTypes: Array<'order' | 'customer' | 'product' | 'ar-model'> = ['order', 'customer', 'product', 'ar-model'];
    const activities: RecentActivity[] = [];
    
    for (let i = 0; i < 6; i++) {
      const type = activityTypes[i % activityTypes.length];
      const hoursAgo = i * 2;
      const timestamp = new Date(Date.now() - hoursAgo * 3600 * 1000).toISOString();
      
      let title = '';
      let description = '';
      
      switch (type) {
        case 'order':
          title = `New order #ORD-${10000 + i}`;
          description = `${['John Doe', 'Jane Smith', 'Sam Johnson'][i % 3]} placed an order for $${Math.round(adjustedValues.aov * (0.8 + Math.random() * 0.4))}.`;
          break;
        case 'customer':
          title = 'New customer registered';
          description = `${['Alex Brown', 'Chris Wilson', 'Taylor Green'][i % 3]} created a new account.`;
          break;
        case 'product':
          title = 'Product inventory updated';
          description = `${productNames[i % productNames.length]} stock increased by ${Math.round(10 + Math.random() * 20)} units.`;
          break;
        case 'ar-model':
          title = 'AR model trending';
          description = `${arModelNames[i % arModelNames.length]} has been viewed ${Math.round(50 + Math.random() * 100)} times today.`;
          break;
      }
      
      activities.push({
        id: `ACT-${3000 + i}`,
        type,
        title,
        description,
        timestamp
      });
    }
    
    return {
      salesOverview: {
        totalSales: adjustedValues.sales,
        salesGrowth: adjustedValues.salesGrowth,
        totalOrders: adjustedValues.orders,
        ordersGrowth: adjustedValues.ordersGrowth,
        averageOrderValue: adjustedValues.aov,
        aovGrowth: adjustedValues.aovGrowth,
        conversionRate: adjustedValues.conversionRate,
        conversionRateGrowth: adjustedValues.conversionRateGrowth
      },
      salesBreakdown: {
        byCategory: salesByCategory,
        byPaymentMethod: salesByPaymentMethod
      },
      topSellingProducts,
      popularArModels,
      recentActivity: activities,
      salesChart: salesChartData,
      ordersChart: ordersChartData
    };
  }
}

const DashboardService = new DashboardServiceClass();
export default DashboardService; 