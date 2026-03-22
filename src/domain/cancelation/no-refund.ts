import { RefundRule } from "./refun-rule.interface";

export class NoRefund implements RefundRule {
  calculateRefund(totalPrice: number): number {
    return totalPrice;
  }
}
