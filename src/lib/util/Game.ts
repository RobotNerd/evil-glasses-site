import type { PurchaseLink } from "$lib/util/Purchase";

export interface GameMeta {
  purchaseLinks: PurchaseLink[];
  image: string;
  route: string;
  subtitle: string;
  synopsis: string;
}
