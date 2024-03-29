import type { GameMeta } from '$lib/util/Game';

const baseRoute: string = '/games';

export let Games: { [key: string]: GameMeta } = {
  'Inflation Buster': {
    description: [
      'Stop inflation in its tracks in this fast-paced arcade shooter.',
      'INFLATION is out of control! After years of quantitative easing, the Federal Reserve must reverse course.Who would have guessed that pumping free money into the economy would have negative consequences ?',
      'It is your job to stop inflation before it gets out of control.How do you do that ? Do you address wealth inequality, fix our healthcare system, or build more housing? Nope. You RAISE INTEREST RATES!',
      'How will you know if the plan is working? JOB DESTRUCTION! When regular working Americans don\'t have money to spend, demand goes down, and so does inflation.',
    ],
    image: '/games/inflation-buster.png',
    purchaseLinks: [
      {
        image: '/google-play-badge.png',
        label: 'Android',
        url: 'https://play.google.com/store/apps/details?id=org.godotengine.inflationbuster&hl=en&gl=US',
      },
      {
        image: '/apple-app-store-badge.png',
        label: 'Apple',
        url: 'https://apps.apple.com/us/app/inflation-buster/id6449170617',
      },
    ],
    route: `${baseRoute}/Inflation Buster`,
    subtitle: 'Destroy the economy to save it?',
    synopsis: 'Play as the head of the US Federal Reserve in this fast-paced arcade shooter! Throw out interest rate hikes to stop those inflating dollars in their tracks, and save the economy. ',
  },
};
