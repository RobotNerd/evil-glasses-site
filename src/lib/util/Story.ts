export interface BookMeta {
  author: string;
  authorDescription: string;
  bookLinks: BookLink[];
  coverImage: string;
  route: string;
  subtitle: string;
  synopsis: string;
}

export interface BookLink {
  image: string;
  label: string;
  url: string;
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
