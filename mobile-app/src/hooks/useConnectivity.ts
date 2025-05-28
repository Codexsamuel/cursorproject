import { useEffect, useCallback, useState } from 'react';
import { AppState, AppStateStatus, Platform } from 'react-native';
import { useStore } from '../store/useStore';
import { useErrorHandler } from '../store/useStore';

export const useConnectivity = () => {
  const [isConnected, setIsConnected] = useState(true);
  const { setOnlineStatus } = useStore();
  const { handleError } = useErrorHandler();

  const checkConnectivity = useCallback(async () => {
    try {
      // Vérification basique de la connectivité
      const response = await fetch('https://www.google.com', {
        method: 'HEAD',
        mode: 'no-cors',
      });
      const isOnline = response.status >= 200 && response.status < 300;
      setIsConnected(isOnline);
      setOnlineStatus(isOnline);

      if (!isOnline) {
        handleError('Vous êtes hors ligne. Certaines fonctionnalités peuvent être limitées.');
      }

      return isOnline;
    } catch (error) {
      setIsConnected(false);
      setOnlineStatus(false);
      handleError('Erreur de connexion. Vérifiez votre connexion internet.');
      return false;
    }
  }, [setOnlineStatus, handleError]);

  useEffect(() => {
    // Vérifier la connectivité au démarrage
    checkConnectivity();

    // Vérifier la connectivité lors des changements d'état de l'application
    const subscription = AppState.addEventListener('change', (nextAppState: AppStateStatus) => {
      if (nextAppState === 'active') {
        checkConnectivity();
      }
    });

    // Vérifier périodiquement la connectivité
    const interval = setInterval(checkConnectivity, 30000); // Vérifier toutes les 30 secondes

    return () => {
      subscription.remove();
      clearInterval(interval);
    };
  }, [checkConnectivity]);

  return {
    isOnline: isConnected,
    checkConnectivity,
  };
};

// Hook pour gérer les requêtes avec support hors ligne
export interface OfflineRequestOptions<T> {
  url: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  body?: any;
  headers?: Record<string, string>;
  retryOptions?: RetryOptions;
}

export interface RetryOptions {
  maxAttempts?: number;
  delayMs?: number;
}

export interface OfflineRequestResult<T> {
  data: T | undefined;
  loading: boolean;
  error: Error | null;
  retry: () => Promise<void>;
}

export const useOfflineRequest = <T>({
  url,
  method = 'GET',
  body,
  headers = {},
  retryOptions = { maxAttempts: 3, delayMs: 1000 },
}: OfflineRequestOptions<T>): OfflineRequestResult<T> => {
  const [data, setData] = useState<T | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { isOnline, getCache, setCache } = useStore(state => ({
    isOnline: state.isOnline,
    getCache: state.getCache,
    setCache: state.setCache,
  }));

  const executeRequest = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Vérifier le cache d'abord
      const cachedData = getCache(url);
      if (cachedData) {
        setData(cachedData as T);
        return;
      }

      // Si en ligne, faire la requête
      if (isOnline) {
        const response = await fetch(url, {
          method,
          body: body ? JSON.stringify(body) : undefined,
          headers: {
            'Content-Type': 'application/json',
            ...headers,
          },
        });
        if (!response.ok) {
          throw new Error(`Erreur HTTP: ${response.status}`);
        }
        const newData = await response.json();
        setData(newData);
        setCache(url, newData);
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Une erreur est survenue'));
    } finally {
      setLoading(false);
    }
  }, [url, method, body, headers, isOnline, getCache, setCache]);

  const retry = useCallback(async () => {
    const maxAttempts = retryOptions.maxAttempts ?? 3;
    let retries = 0;
    while (retries < maxAttempts) {
      try {
        await executeRequest();
        return;
      } catch (err) {
        retries++;
        if (retries === maxAttempts) {
          setError(new Error('Nombre maximum de tentatives atteint'));
          break;
        }
        await new Promise(resolve => setTimeout(resolve, retryOptions.delayMs ?? 1000));
      }
    }
  }, [executeRequest, retryOptions]);

  useEffect(() => {
    executeRequest();
  }, [executeRequest]);

  return { data, loading, error, retry };
}; 