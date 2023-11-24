import type { PurchaseLink } from "$lib/util/Purchase";

export interface BookMeta {
  author: string;
  authorDescription: string;
  coverImage: string;
  purchaseLinks: PurchaseLink[];
  route: string;
  subtitle: string;
  synopsis: string;
}

export interface Story {
  author: string;
  synopsis: string;
  title: string;
}

export interface ShortStoryMeta {
  name: string;
  date: string;
  edition: string;
  stories: Story[];
  route: string;
}
