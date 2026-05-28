type ApiModule = {
  prefix: string;
  endPoints: {
    list?: string;
    create?: string;
    update?: string;
    delete?: string;
    getById?: string;
  };
  getListUrl?: () => string;
  getCreateUrl?: () => string;
  getUpdateUrl?: () => string;
  getDeleteUrl?: () => string;
  getByIdUrl: () => string;
};

type CommonApisType = {
  baseURL: string;
  draft: ApiModule;
};

export const COMMON_APIS: CommonApisType = {
  baseURL: "/api/v1",
  draft: {
    prefix: "/magic-save",
    endPoints: {
      list: "/fetch-draft",
      create: '/draft',
    },
    getByIdUrl(this: typeof COMMON_APIS.draft) {
      return COMMON_APIS.baseURL + this.prefix + this.endPoints.list
    },
    getCreateUrl(this: typeof COMMON_APIS.draft) {
      return COMMON_APIS.baseURL + this.prefix + this.endPoints.create
    }
  }
};


export const API_ENDPOINTS = {
  baseURL: "/api/v1/production",
  production: {
    finalOQC: {
      endPoints: {
        test: {
          upsert: "/testing-protocol/",
          get: (model_mapper_id: string | number) => `/testing-protocol/${model_mapper_id}`,
        },
        inspection: {
          upsert: "/inspection-protocol/",
          get: (project_id: string | number) => `/inspection-protocol/${project_id}`,
        },
        packaging: {
          upsert: "/packaging-protocol/",
          get: (project_id: string | number) => `/packaging-protocol/${project_id}`,
        },
        productFeature: {
          all: (project_id: string | number, status: string | number = 1) => `/product-feature/all?project_id=${project_id}&status=${status}`,
          get: (product_feature_id: number) => `/product-feature/${product_feature_id}`,
          upsert: "/product-feature/",
        },
        dropdowns: {
          jigs: "/jigs-type/all?status=1",
          equipment: "/equipment-type/all?status=1",
        }
      }
    }
  },

};