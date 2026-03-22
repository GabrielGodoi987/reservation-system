import { RefundRule } from "./refun-rule.interface";

export class PartialRefund implements RefundRule {
  calculateRefund(totalPrice: number): number {
    return totalPrice * 0.5;
  }
}
