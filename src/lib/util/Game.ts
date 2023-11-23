export interface GameMeta {
  gameLinks: GameLink[];
  image: string;
  route: string;
  subtitle: string;
  synopsis: string;
}

export interface GameLink {
  image: string;
  label: string;
  url: string;
}