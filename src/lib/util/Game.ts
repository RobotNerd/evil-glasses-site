import type { PurchaseInfo } from "$lib/util/Purchase";

export interface GameMeta {
  description: string[];
  image: string;
  purchaseLinks: PurchaseInfo[];
  route: string;
  subtitle: string;
  synopsis: string;
}
