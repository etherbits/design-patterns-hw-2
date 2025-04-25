import { View } from ".";
import { basicView } from "./basic";

export function depositAmountView() {
  const view = new View();

  view.addActions([
    {
      trigger: "*",
      label: "Enter the amount to deposit",
      callback: async (ctx, input) => {
        const accountId = ctx.stateMap.get("accountId");

        if (typeof accountId !== "string") {
          throw Error("Invalid account id");
        }
        if (input === undefined || isNaN(+input)) {
          throw Error("Please input a valid amount");
        }

        await ctx.accountService.deposit(accountId, +input);
        ctx.stateMap.clear();

        return basicView(`Successfully deposited ${+input} in the bank account!`);
      },
    },
  ]);

  return view;
}
