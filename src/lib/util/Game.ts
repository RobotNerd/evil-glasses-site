import type { PurchaseInfo } from "$lib/util/Purchase";

export interface GameMeta {
  purchaseLinks: PurchaseInfo[];
  image: string;
  route: string;
  subtitle: string;
  synopsis: string;
}
