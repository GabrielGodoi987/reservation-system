import { RefundRule } from "./refun-rule.interface";

export class FullRefud implements RefundRule {
  calculateRefund(totalPrice: number): number {
    return 0;
  }
}
