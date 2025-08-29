import api from './api';

export interface Repository {
  id: string;
  githubId: string;
  name: string;
  fullName: string;
  description?: string;
  private: boolean;
  htmlUrl: string;
  stargazersCount: number;
  forksCount: number;
  language?: string;
  createdAt: string;
  updatedAt: string;
}

export const repositoryService = {
  getUserRepositories: async (): Promise<Repository[]> => {
    const response = await api.get('/repositories');
    return response.data;
  },

  syncRepositories: async (): Promise<Repository[]> => {
    const response = await api.post('/repositories/sync');
    return response.data;
  },

  getRepository: async (id: string): Promise<Repository> => {
    const response = await api.get(`/repositories/${id}`);
    return response.data;
  },
};