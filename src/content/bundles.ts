// Bundle pricing and configuration for Wagly
// Extracted from BringWaglyHome.tsx for easier maintenance

export type BundleKey = '1' | '2' | '3' | '4';

export interface Bundle {
  key: BundleKey;
  qty: number;
  perUnit: string;
  total: string;
  original: string;
  discount: string;
  bestSeller?: boolean;
  bestValue?: boolean;
}

export const bundles: Record<BundleKey, Bundle> = {
  '1': { 
    key: '1', 
    qty: 1, 
    perUnit: '49.99', 
    total: '49.99', 
    original: '124.99', 
    discount: '60%' 
  },
  '2': { 
    key: '2', 
    qty: 2, 
    perUnit: '44.99', 
    total: '89.98', 
    original: '249.99', 
    discount: '64%' 
  },
  '3': { 
    key: '3', 
    qty: 3, 
    perUnit: '39.99', 
    total: '119.97', 
    original: '374.99', 
    discount: '68%', 
    bestSeller: true 
  },
  '4': { 
    key: '4', 
    qty: 4, 
    perUnit: '34.99', 
    total: '139.96', 
    original: '499.99', 
    discount: '72%', 
    bestValue: true 
  }
};

// Payment routes for each bundle
export const PAYMENT_ROUTES: Record<BundleKey, string> = {
  '1': 'https://pay.card2crypto.org/pay.php?address=4%2FHcTx3jM49k7fcXsd68WnTr9uzIiSZhY32FyDTgByKHtUX7BcfTdxoUhECa18o4UxKEB%2BTr%2BRb9mTsxZi2FDA%3D%3D&amount=49.99&provider=hosted&email=[EMAIL]&currency=USD',
  '2': 'https://pay.card2crypto.org/pay.php?address=jaOG5kmj0pGJ4qZvCdopfTL0sfuxxtsNpjV04T%2Ba5cbvqR9HsjaIe2vr8oDPK%2Bwdqdx68YHJSWyOVNIGEFspGQ%3D%3D&amount=89.98&provider=hosted&email=[EMAIL]&currency=USD',
  '3': 'https://pay.card2crypto.org/pay.php?address=WrOgk4QcnCUBta%2BqxOG4VR3DH7YOnhnGu3W89aEoXvtXwOqRBOgX%2FhTc3Vb47vaQOKwAwyu%2FkiFYOFjInFv9ig%3D%3D&amount=119.97&provider=hosted&email=[EMAIL]&currency=USD',
  '4': 'https://pay.card2crypto.org/pay.php?address=OrdDuSMvZq534U4TDy2elEW8KaW0%2FI6Xzw9duq5OZhEJqQjYtRJlVUCHBDD3Ys%2B2dLfpbypFtOa3uSVXIsG63g%3D%3D&amount=139.96&provider=hosted&email=[EMAIL]&currency=USD'
};

// Helper to get bundle headline
export function getBundleHeadline(bundleKey: BundleKey): string {
  switch (bundleKey) {
    case '3':
      return 'Adopt Your Wagly Trio';
    case '4':
      return 'Bring Home the Wagly Pack';
    case '2':
      return 'Bring Home Two Wagly Friends';
    case '1':
    default:
      return 'Bring Home a Wagly Today';
  }
}
