import { groupByEdition, loadStories } from '../../lib/content/stories';

export function load() {
	return { groups: groupByEdition(loadStories()) };
}
