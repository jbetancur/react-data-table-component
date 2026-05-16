import * as React from 'react';

// useLayoutEffect on the client (for DOM measurements), useEffect on the server
// (no-op during SSR, avoids the React SSR warning).
const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? React.useLayoutEffect : React.useEffect;

export default useIsomorphicLayoutEffect;
