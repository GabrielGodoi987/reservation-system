import { FullRefud } from "./full-refund";
import { NoRefund } from "./no-refund";
import { PartialRefund } from "./partial-refund";
import { RefundRule } from "./refun-rule.interface";

export class RefundRuleFactory {
  public static getRefundRule(daysUntilCheckIn: number): RefundRule {
    if (daysUntilCheckIn > 7) {
      return new FullRefud();
    } else if (daysUntilCheckIn >= 1 && daysUntilCheckIn <= 5) {
      return new PartialRefund();
    }
    return new NoRefund();
  }
}
