import type { GameMeta } from '$lib/util/Game';

const baseRoute: string = '/games';

export let Games: { [key: string]: GameMeta } = {
  'Inflation Buster': {
    gameLinks: [],
    image: '/games/inflation-buster.png',
    route: `${baseRoute}/Inflation Buster`,
    subtitle: 'Destroy the economy to save it?',
    synopsis: 'Play as the head of the US Federal Reserve in this fast-paced arcade shooter! Throw out interest rate hikes to stop those inflating dollars in their tracks, and save the economy. ',
  },
};
