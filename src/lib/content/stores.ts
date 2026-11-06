import type { EnhancedImgAttributes } from '@sveltejs/enhanced-img';
import amazon from '../assets/stores/amazon.png?enhanced';
import kindle from '../assets/stores/kindle.png?enhanced';
import smashwords from '../assets/stores/smashwords.png?enhanced';
import type { StoreLink } from './schemas';

type Badge = EnhancedImgAttributes['src'];

/** Badge or logo per store. Apple and Google Play badges arrive with the games task. */
export const storeBadges: Partial<Record<StoreLink['store'], Badge>> = {
	amazon,
	kindle,
	smashwords
};
