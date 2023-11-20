import { Stories } from "./short-story-meta";

export interface Feature {
  image: string;
  name: string;
  route: string;
}

export let featured: Feature[] = [
  {
    image: '/short-stories/2019-03-01-edition-14.png',
    name: Stories[13].name,
    route: Stories[13].route,
  },
  {
    image: '/short-stories/2018-07-01-edition-13.png',
    name: Stories[12].name,
    route: Stories[12].route,
  },
  {
    image: '/short-stories/2018-04-01-edition-12.png',
    name: Stories[11].name,
    route: Stories[11].route,
  },
];
