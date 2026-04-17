import { createContext, useContext, useReducer, useEffect, useMemo, useRef } from 'react';
import productsConfig from '../config/products.json';
import { reducer, initialState, ACTIONS } from './reducer.js';
import { encodeState, decodeState } from '../lib/urlState.js';

const ConfiguratorContext = createContext(null);

export function ConfiguratorProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const skipNextUrlSync = useRef(false);

  // Hydrate from URL once on mount.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const c = params.get('c');
    if (!c) return;
    const decoded = decodeState(c);
    if (decoded) {
      skipNextUrlSync.current = true;
      dispatch({ type: ACTIONS.LOAD_FROM_URL, state: decoded });
    }
  }, []);

  // Sync state to URL whenever it changes (after a product is picked).
  useEffect(() => {
    if (skipNextUrlSync.current) {
      skipNextUrlSync.current = false;
      return;
    }
    if (!state.productId) return;
    const encoded = encodeState({
      productId: state.productId,
      selections: state.selections
    });
    const url = new URL(window.location.href);
    url.searchParams.set('c', encoded);
    window.history.replaceState(null, '', url.toString());
  }, [state.productId, state.selections]);

  const value = useMemo(
    () => ({
      state,
      dispatch,
      config: productsConfig,
      product: state.productId ? productsConfig.products[state.productId] : null,
      palette: productsConfig.palettes.ral_palette_placeholder
    }),
    [state]
  );

  return (
    <ConfiguratorContext.Provider value={value}>
      {children}
    </ConfiguratorContext.Provider>
  );
}

export function useConfigurator() {
  const ctx = useContext(ConfiguratorContext);
  if (!ctx) throw new Error('useConfigurator must be used within ConfiguratorProvider');
  return ctx;
}
