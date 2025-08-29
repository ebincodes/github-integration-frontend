import api from './api';

export interface Subscription {
  id: string;
  userId: string;
  repositoryId: string;
  repository: {
    id: string;
    name: string;
    fullName: string;
    description?: string;
    private: boolean;
    htmlUrl: string;
    stargazersCount: number;
    forksCount: number;
    language?: string;
  };
  createdAt: string;
}

export const subscriptionService = {
  getUserSubscriptions: async (): Promise<Subscription[]> => {
    const response = await api.get('/subscriptions');
    return response.data;
  },

  subscribe: async (repositoryId: string): Promise<Subscription> => {
    const response = await api.post(`/subscriptions/${repositoryId}`);
    return response.data;
  },

  unsubscribe: async (repositoryId: string): Promise<void> => {
    await api.delete(`/subscriptions/${repositoryId}`);
  },

  checkSubscription: async (repositoryId: string): Promise<boolean> => {
    const response = await api.get(`/subscriptions/check/${repositoryId}`);
    return response.data.isSubscribed;
  },
};