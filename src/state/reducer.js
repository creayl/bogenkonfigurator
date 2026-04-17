import productsConfig from '../config/products.json';

export const ACTIONS = {
  SET_PRODUCT: 'SET_PRODUCT',
  SET_SELECTION: 'SET_SELECTION',
  SET_STRIPE_COLOR: 'SET_STRIPE_COLOR',
  RESET: 'RESET',
  LOAD_FROM_URL: 'LOAD_FROM_URL',
  SET_EMAIL_RECIPIENT: 'SET_EMAIL_RECIPIENT',
  SET_STEP: 'SET_STEP',
  SET_IS_MOBILE: 'SET_IS_MOBILE'
};

export const initialState = {
  productId: null,
  selections: {},
  ui: {
    currentStep: 0,
    isMobile: false,
    emailRecipient: ''
  }
};

export function defaultSelectionsForProduct(productId) {
  const product = productsConfig.products[productId];
  if (!product) return {};
  const out = {};
  for (const [key, opt] of Object.entries(product.options)) {
    if (opt.type === 'color_per_stripe') {
      const count = product.options.stripe_count?.default ?? 3;
      out[key] = Array.from({ length: count }, () => opt.default_same_color);
    } else if (opt.type === 'multi_select') {
      out[key] = Array.isArray(opt.default) ? [...opt.default] : [];
    } else if (opt.type === 'textarea') {
      out[key] = '';
    } else if ('default' in opt) {
      out[key] = opt.default;
    }
  }
  return out;
}

export function reducer(state, action) {
  switch (action.type) {
    case ACTIONS.SET_PRODUCT: {
      return {
        ...state,
        productId: action.productId,
        selections: defaultSelectionsForProduct(action.productId),
        ui: { ...state.ui, currentStep: 0 }
      };
    }
    case ACTIONS.SET_SELECTION: {
      const next = { ...state.selections, [action.key]: action.value };
      // Keep stripe_colors length in sync with stripe_count.
      if (action.key === 'stripe_count') {
        const current = state.selections.stripe_colors ?? [];
        const fill = current[0] ?? 'RAL_9005';
        const len = Number(action.value) || 0;
        next.stripe_colors = Array.from(
          { length: len },
          (_, i) => current[i] ?? fill
        );
      }
      return { ...state, selections: next };
    }
    case ACTIONS.SET_STRIPE_COLOR: {
      const arr = [...(state.selections.stripe_colors ?? [])];
      arr[action.index] = action.ralId;
      return {
        ...state,
        selections: { ...state.selections, stripe_colors: arr }
      };
    }
    case ACTIONS.SET_EMAIL_RECIPIENT: {
      return { ...state, ui: { ...state.ui, emailRecipient: action.value } };
    }
    case ACTIONS.SET_STEP: {
      return { ...state, ui: { ...state.ui, currentStep: action.step } };
    }
    case ACTIONS.SET_IS_MOBILE: {
      return { ...state, ui: { ...state.ui, isMobile: action.value } };
    }
    case ACTIONS.LOAD_FROM_URL: {
      const loaded = action.state || {};
      return {
        ...state,
        productId: loaded.productId ?? state.productId,
        selections: { ...(loaded.selections ?? {}) },
        ui: { ...state.ui, ...(loaded.ui ?? {}) }
      };
    }
    case ACTIONS.RESET: {
      return initialState;
    }
    default:
      return state;
  }
}
