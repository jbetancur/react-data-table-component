import * as React from 'react';
import { Direction } from '../DataTable/constants';

function useRTL(direction: Direction = Direction.AUTO): boolean {
	const isClient = typeof window === 'object';

	const [isRTL, setIsRTL] = React.useState(false);

	React.useEffect(() => {
		if (!isClient) {
			return;
		}

		if (direction === 'auto') {
			const canUse = !!(window.document && window.document.createElement);
			const bodyRTL = <HTMLScriptElement>document.getElementsByTagName('BODY')[0];
			const htmlTRL = <HTMLScriptElement>document.getElementsByTagName('HTML')[0];
			const hasRTL = bodyRTL.dir === 'rtl' || htmlTRL.dir === 'rtl';

			setIsRTL(canUse && hasRTL);

			return;
		}

		setIsRTL(direction === 'rtl');
	}, [direction, isClient]);

	return isRTL;
}

export default useRTL;
