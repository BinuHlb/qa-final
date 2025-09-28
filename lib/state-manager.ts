import { createContext, useContext, useReducer, useCallback, useMemo } from 'react';

/**
 * Scalable state management system for better performance
 */

export interface StateAction<T = any> {
  type: string;
  payload?: T;
  meta?: Record<string, any>;
}

export interface StateManagerConfig<T> {
  initialState: T;
  reducer: (state: T, action: StateAction) => T;
  persist?: boolean;
  storageKey?: string;
  version?: string;
}

export class StateManager<T> {
  private state: T;
  private listeners: Set<(state: T) => void> = new Set();
  private reducer: (state: T, action: StateAction) => T;
  private persist: boolean;
  private storageKey: string;
  private version: string;

  constructor(config: StateManagerConfig<T>) {
    this.reducer = config.reducer;
    this.persist = config.persist || false;
    this.storageKey = config.storageKey || 'app-state';
    this.version = config.version || '1.0.0';
    
    this.state = this.loadState(config.initialState);
  }

  getState(): T {
    return this.state;
  }

  dispatch(action: StateAction): void {
    const newState = this.reducer(this.state, action);
    
    if (newState !== this.state) {
      this.state = newState;
      this.saveState(newState);
      this.notifyListeners(newState);
    }
  }

  subscribe(listener: (state: T) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notifyListeners(state: T): void {
    this.listeners.forEach(listener => listener(state));
  }

  private loadState(initialState: T): T {
    if (!this.persist || typeof window === 'undefined') {
      return initialState;
    }

    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.version === this.version) {
          return parsed.state;
        }
      }
    } catch (error) {
      console.warn('Failed to load state from storage:', error);
    }

    return initialState;
  }

  private saveState(state: T): void {
    if (!this.persist || typeof window === 'undefined') {
      return;
    }

    try {
      const data = {
        version: this.version,
        state,
        timestamp: Date.now(),
      };
      localStorage.setItem(this.storageKey, JSON.stringify(data));
    } catch (error) {
      console.warn('Failed to save state to storage:', error);
    }
  }
}

// React hook for state management
export function useStateManager<T>(config: StateManagerConfig<T>) {
  const [state, dispatch] = useReducer(config.reducer, config.initialState);

  const dispatchAction = useCallback((action: StateAction) => {
    dispatch(action);
  }, []);

  const getState = useCallback(() => state, [state]);

  return {
    state,
    dispatch: dispatchAction,
    getState,
  };
}

// Context-based state management
export function createStateContext<T>(config: StateManagerConfig<T>) {
  const StateContext = createContext<{
    state: T;
    dispatch: (action: StateAction) => void;
  } | null>(null);

  const StateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { state, dispatch } = useStateManager(config);

    const value = useMemo(() => ({ state, dispatch }), [state, dispatch]);

    return (
      <StateContext.Provider value={value}>
        {children}
      </StateContext.Provider>
    );
  };

  const useStateContext = () => {
    const context = useContext(StateContext);
    if (!context) {
      throw new Error('useStateContext must be used within a StateProvider');
    }
    return context;
  };

  return {
    StateProvider,
    useStateContext,
  };
}

// Action creators for common patterns
export const createActionCreators = <T>() => ({
  set: <K extends keyof T>(key: K, value: T[K]) => ({
    type: `SET_${String(key).toUpperCase()}`,
    payload: { key, value },
  }),

  update: <K extends keyof T>(key: K, updates: Partial<T[K]>) => ({
    type: `UPDATE_${String(key).toUpperCase()}`,
    payload: { key, updates },
  }),

  add: <K extends keyof T>(key: K, item: any) => ({
    type: `ADD_${String(key).toUpperCase()}`,
    payload: { key, item },
  }),

  remove: <K extends keyof T>(key: K, id: string | number) => ({
    type: `REMOVE_${String(key).toUpperCase()}`,
    payload: { key, id },
  }),

  clear: <K extends keyof T>(key: K) => ({
    type: `CLEAR_${String(key).toUpperCase()}`,
    payload: { key },
  }),

  reset: () => ({
    type: 'RESET',
  }),
});

// Generic reducer for common state patterns
export function createGenericReducer<T>(initialState: T) {
  return (state: T, action: StateAction): T => {
    switch (action.type) {
      case 'RESET':
        return initialState;

      default:
        // Handle dynamic actions based on payload structure
        if (action.payload && typeof action.payload === 'object') {
          const { key, value, updates, item, id } = action.payload as any;
          
          if (key !== undefined) {
            if (action.type.startsWith('SET_')) {
              return { ...state, [key]: value };
            }
            
            if (action.type.startsWith('UPDATE_')) {
              return {
                ...state,
                [key]: { ...state[key], ...updates },
              };
            }
            
            if (action.type.startsWith('ADD_')) {
              const currentArray = state[key] as any[];
              return {
                ...state,
                [key]: [...currentArray, item],
              };
            }
            
            if (action.type.startsWith('REMOVE_')) {
              const currentArray = state[key] as any[];
              return {
                ...state,
                [key]: currentArray.filter((item: any) => item.id !== id),
              };
            }
            
            if (action.type.startsWith('CLEAR_')) {
              return {
                ...state,
                [key]: Array.isArray(state[key]) ? [] : null,
              };
            }
          }
        }

        return state;
    }
  };
}

// Selector hook for optimized state access
export function useSelector<T, R>(
  state: T,
  selector: (state: T) => R,
  deps: React.DependencyList = []
): R {
  return useMemo(() => selector(state), [state, ...deps]);
}

// Async action creator
export function createAsyncAction<T>(
  asyncFn: (dispatch: (action: StateAction) => void, getState: () => T) => Promise<void>
) {
  return async (dispatch: (action: StateAction) => void, getState: () => T) => {
    try {
      dispatch({ type: 'ASYNC_START' });
      await asyncFn(dispatch, getState);
      dispatch({ type: 'ASYNC_SUCCESS' });
    } catch (error) {
      dispatch({ type: 'ASYNC_ERROR', payload: error });
    }
  };
}
