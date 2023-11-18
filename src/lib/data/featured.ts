import { Stories } from "./short-story-meta";

export interface Feature {
  image: string;
  name: string;
  route: string;
}

export let featured: Feature[] = [
  Stories[13],
  Stories[12],
  Stories[11],
];
