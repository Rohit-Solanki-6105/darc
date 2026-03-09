"use client";

import { useState, useCallback, useEffect } from "react";
import { apiService } from "@/lib/api";
import {
  saveAuthData,
  clearAuthData,
  getAuthToken,
  getUserData,
  AuthUser,
} from "@/lib/auth";

export interface UseAuthReturn {
  user: AuthUser | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    passwordConfirm: string,
    isDeveloper?: boolean,
    mobile?: string
  ) => Promise<boolean>;
  logout: () => void;
  updateProfile: (userData: Partial<AuthUser>) => Promise<boolean>;
  changePassword: (
    oldPassword: string,
    newPassword: string
  ) => Promise<boolean>;
  refreshUser: () => Promise<void>;
}

/**
 * Custom hook for authentication
 */
export const useAuth = (): UseAuthReturn => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Initialize auth on mount
  useEffect(() => {
    const token = getAuthToken();
    const userData = getUserData();

    if (token && userData) {
      setUser(userData);
      setIsAuthenticated(true);
    }
  }, []);

  const login = useCallback(
    async (email: string, password: string): Promise<boolean> => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await apiService.login({
          email,
          password,
        });

        // Store token and user data
        saveAuthData(response.token, response.user);
        setUser(response.user);
        setIsAuthenticated(true);

        return true;
      } catch (err: any) {
        const errorMessage =
          err.response?.data?.error ||
          err.message ||
          "Login failed. Please try again.";
        setError(errorMessage);
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const register = useCallback(
    async (
      firstName: string,
      lastName: string,
      email: string,
      password: string,
      passwordConfirm: string,
      isDeveloper = false,
      mobile = ""
    ): Promise<boolean> => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await apiService.register({
          first_name: firstName,
          last_name: lastName,
          email,
          password,
          password_confirm: passwordConfirm,
          is_developer: isDeveloper,
          mobile: mobile || undefined,
        });

        saveAuthData(response.token, response.user);
        setUser(response.user);
        setIsAuthenticated(true);

        return true;
      } catch (err: any) {
        const errorMessage =
          err.response?.data?.email?.[0] ||
          err.response?.data?.password?.[0] ||
          err.response?.data?.error ||
          err.message ||
          "Registration failed. Please try again.";
        setError(errorMessage);
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const logout = useCallback(() => {
    clearAuthData();
    setUser(null);
    setIsAuthenticated(false);
    setError(null);
  }, []);

  const updateProfile = useCallback(
    async (userData: Partial<AuthUser>): Promise<boolean> => {
      if (!user) {
        setError("User not found");
        return false;
      }

      setIsLoading(true);
      setError(null);

      try {
        const updatedUser = await apiService.updateProfile(user.id, userData);
        setUser(updatedUser);
        localStorage.setItem("user_data", JSON.stringify(updatedUser));
        return true;
      } catch (err: any) {
        const errorMessage =
          err.message || "Failed to update profile. Please try again.";
        setError(errorMessage);
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [user]
  );

  const changePassword = useCallback(
    async (oldPassword: string, newPassword: string): Promise<boolean> => {
      setIsLoading(true);
      setError(null);

      try {
        await apiService.changePassword(oldPassword, newPassword);
        return true;
      } catch (err: any) {
        const errorMessage =
          err.response?.data?.error ||
          err.message ||
          "Failed to change password. Please try again.";
        setError(errorMessage);
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const refreshUser = useCallback(async () => {
    if (!user) return;

    try {
      const updatedUser = await apiService.getCurrentUser();
      setUser(updatedUser);
      localStorage.setItem("user_data", JSON.stringify(updatedUser));
    } catch (err) {
      console.error("Failed to refresh user data");
    }
  }, [user]);

  return {
    user,
    isLoading,
    error,
    isAuthenticated,
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    refreshUser,
  };
};

// Hook for agents
export const useAgents = () => {
  const [agents, setAgents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAgents = useCallback(async (params?: any) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await apiService.getAgents(params);
      setAgents(Array.isArray(data) ? data : data.results || []);
    } catch (err: any) {
      const errorMessage = err.message || "Failed to fetch agents";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createAgent = useCallback(async (agentData: any) => {
    setIsLoading(true);
    setError(null);
    try {
      const newAgent = await apiService.createAgent(agentData);
      setAgents([newAgent, ...agents]);
      return newAgent;
    } catch (err: any) {
      const errorMessage = err.message || "Failed to create agent";
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [agents]);

  const updateAgent = useCallback(
    async (agentId: number, agentData: any) => {
      setIsLoading(true);
      setError(null);
      try {
        const updatedAgent = await apiService.updateAgent(agentId, agentData);
        setAgents(
          agents.map((a) => (a.agent_id === agentId ? updatedAgent : a))
        );
        return updatedAgent;
      } catch (err: any) {
        const errorMessage = err.message || "Failed to update agent";
        setError(errorMessage);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [agents]
  );

  const deleteAgent = useCallback(
    async (agentId: number) => {
      setIsLoading(true);
      setError(null);
      try {
        await apiService.deleteAgent(agentId);
        setAgents(agents.filter((a) => a.agent_id !== agentId));
      } catch (err: any) {
        const errorMessage = err.message || "Failed to delete agent";
        setError(errorMessage);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [agents]
  );

  return {
    agents,
    isLoading,
    error,
    fetchAgents,
    createAgent,
    updateAgent,
    deleteAgent,
  };
};

// Hook for transactions
export const useTransactions = () => {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTransactions = useCallback(async (params?: any) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await apiService.getTransactions(params);
      setTransactions(Array.isArray(data) ? data : data.results || []);
    } catch (err: any) {
      const errorMessage = err.message || "Failed to fetch transactions";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createTransaction = useCallback(async (transactionData: any) => {
    setIsLoading(true);
    setError(null);
    try {
      const newTransaction = await apiService.createTransaction(
        transactionData
      );
      setTransactions([newTransaction, ...transactions]);
      return newTransaction;
    } catch (err: any) {
      const errorMessage = err.message || "Failed to create transaction";
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [transactions]);

  const getTransactionSummary = useCallback(async (developerId?: number) => {
    try {
      return await apiService.getTransactionSummary(developerId);
    } catch (err: any) {
      const errorMessage = err.message || "Failed to fetch summary";
      setError(errorMessage);
      throw err;
    }
  }, []);

  return {
    transactions,
    isLoading,
    error,
    fetchTransactions,
    createTransaction,
    getTransactionSummary,
  };
};

// Hook for reviews
export const useReviews = () => {
  const [reviews, setReviews] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchReviews = useCallback(async (params?: any) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await apiService.getReviews(params);
      setReviews(Array.isArray(data) ? data : data.results || []);
    } catch (err: any) {
      const errorMessage = err.message || "Failed to fetch reviews";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createReview = useCallback(
    async (reviewData: any) => {
      setIsLoading(true);
      setError(null);
      try {
        const newReview = await apiService.createReview(reviewData);
        setReviews([newReview, ...reviews]);
        return newReview;
      } catch (err: any) {
        const errorMessage = err.message || "Failed to create review";
        setError(errorMessage);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [reviews]
  );

  const getAgentReviews = useCallback(async (agentId: number) => {
    try {
      return await apiService.getAgentReviews(agentId);
    } catch (err: any) {
      const errorMessage = err.message || "Failed to fetch agent reviews";
      setError(errorMessage);
      throw err;
    }
  }, []);

  return {
    reviews,
    isLoading,
    error,
    fetchReviews,
    createReview,
    getAgentReviews,
  };
};
