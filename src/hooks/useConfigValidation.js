import { useMemo } from 'react';

// V1: client confirmed there are no inter-option dependencies.
// This hook just reports which required option keys still hold a value
// so the UI can show progress.
export function useConfigValidation({ product, selections }) {
  return useMemo(() => {
    if (!product) return { complete: false, missing: [], total: 0, filled: 0 };
    const keys = Object.keys(product.options).filter((k) => k !== 'notes');
    const missing = keys.filter((k) => {
      const v = selections[k];
      if (v === undefined || v === null) return true;
      if (Array.isArray(v) && v.length === 0 && product.options[k].type !== 'multi_select') {
        return true;
      }
      return false;
    });
    return {
      complete: missing.length === 0,
      missing,
      total: keys.length,
      filled: keys.length - missing.length
    };
  }, [product, selections]);
}
