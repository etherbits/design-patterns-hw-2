import { View } from ".";
import { basicView } from "./basic";

export function createAccountView() {
  const view = new View();

  view.addActions([
    {
      trigger: "*",
      label: "Enter your full name",
      callback: async (ctx, input) => {
        await ctx.accountService.create(input!);
        return basicView("Successfully created the bank account!");
      },
    },
  ]);

  return view;
}
