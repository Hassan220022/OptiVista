import ApiService from './ApiService';

export interface ArModel {
  id: string;
  name: string;
  description: string;
  productId: string;
  productName: string;
  modelUrl: string;
  thumbnailUrl: string;
  fileSize: number;
  fileFormat: string;
  version: number;
  status: 'draft' | 'processing' | 'active' | 'error';
  viewCount: number;
  errorMessage?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ArModelFilter {
  productId?: string;
  status?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface ArModelsResponse {
  data: ArModel[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ArModelCreateInput {
  name: string;
  description: string;
  productId: string;
}

export interface ArModelMetrics {
  totalViews: number;
  viewsByModel: {
    modelId: string;
    modelName: string;
    views: number;
  }[];
  viewsByPeriod: {
    period: string;
    views: number;
  }[];
}

class ArModelServiceClass {
  private readonly basePath = '/ar-models';

  async getArModels(filters: ArModelFilter = {}): Promise<ArModelsResponse> {
    const params: Record<string, string> = {};
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params[key] = String(value);
      }
    });
    
    return ApiService.get<ArModelsResponse>(this.basePath, params);
  }

  async getArModel(id: string): Promise<ArModel> {
    return ApiService.get<ArModel>(`${this.basePath}/${id}`);
  }

  async createArModel(model: ArModelCreateInput): Promise<ArModel> {
    return ApiService.post<ArModel>(this.basePath, model);
  }

  async updateArModel(id: string, model: Partial<ArModelCreateInput>): Promise<ArModel> {
    return ApiService.put<ArModel>(`${this.basePath}/${id}`, model);
  }

  async deleteArModel(id: string): Promise<void> {
    return ApiService.delete<void>(`${this.basePath}/${id}`);
  }

  async uploadArModelFile(id: string, file: File): Promise<{ modelUrl: string }> {
    return ApiService.uploadFile<{ modelUrl: string }>(`${this.basePath}/${id}/file`, file);
  }

  async uploadArModelThumbnail(id: string, image: File): Promise<{ thumbnailUrl: string }> {
    return ApiService.uploadFile<{ thumbnailUrl: string }>(`${this.basePath}/${id}/thumbnail`, image);
  }

  async getArModelMetrics(period: 'daily' | 'weekly' | 'monthly' | 'yearly' = 'monthly'): Promise<ArModelMetrics> {
    return ApiService.get<ArModelMetrics>(`${this.basePath}/metrics`, { period });
  }
}

const ArModelService = new ArModelServiceClass();
export default ArModelService; 