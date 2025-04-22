import { View } from ".";
import { basicView } from "./basic";

export function transferAmountView() {
  const view = new View();

  view.addActions([
    {
      trigger: "*",
      label: "Enter the amount to transfer",
      callback: async (ctx, input) => {
        const accountFromId = ctx.stateMap.get("accountFromId");
        const accountToId = ctx.stateMap.get("accountToId");

        if (typeof accountFromId !== "string") {
          throw Error("Invalid account from id");
        }

        if (typeof accountToId !== "string") {
          throw Error("Invalid account to id");
        }

        if (input === undefined || isNaN(+input)) {
          throw Error("Please input a valid amount");
        }

        await ctx.accountService.transfer(accountFromId, accountToId, +input);
        ctx.stateMap.clear();

        return basicView(
          `Successfully transfered $${+input}\nTransfered from account with id: ${accountFromId}\nTransfered to account with id: ${accountToId}`
        );
      },
    },
  ]);

  return view;
}
