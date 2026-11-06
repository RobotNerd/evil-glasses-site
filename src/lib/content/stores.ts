import type { EnhancedImgAttributes } from '@sveltejs/enhanced-img';
import amazon from '../assets/stores/amazon.png?enhanced';
import apple from '../assets/stores/apple.png?enhanced';
import googlePlay from '../assets/stores/google-play.png?enhanced';
import kindle from '../assets/stores/kindle.png?enhanced';
import smashwords from '../assets/stores/smashwords.png?enhanced';
import type { StoreLink } from './schemas';

type Badge = EnhancedImgAttributes['src'];

/** Badge or logo per store. */
export const storeBadges: Partial<Record<StoreLink['store'], Badge>> = {
	amazon,
	apple,
	'google-play': googlePlay,
	kindle,
	smashwords
};
