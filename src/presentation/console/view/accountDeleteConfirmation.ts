import { View } from ".";
import { basicView } from "./basic";
import { homeView } from "./home";

export function accountDeleteConfirmationView() {
  const view = new View("Are you sure you want to delete this account?");

  view.addActions([
    {
      trigger: "y",
      label: "Yes I'm sure",
      callback: async (ctx) => {
        const accountId = ctx.stateMap.get("accountId");

        if (typeof accountId !== "string") {
          throw Error("Invalid account id");
        }

        await ctx.accountService.delete(accountId);
        ctx.stateMap.clear();

        return basicView(`Successfully deleted account with id: ${accountId}`);
      },
    },
    {
      trigger: "n",
      label: "No, bring me back home",
      callback: async (ctx) => {
        ctx.stateMap.clear();

        return homeView;
      },
    },
  ]);

  return view;
}
