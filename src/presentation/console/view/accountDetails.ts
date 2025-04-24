import { View, type ViewContext } from ".";

export function accountDetailsView() {
  const view = new View();

  view.setContent(async (ctx: ViewContext) => {
    const accountId = ctx.stateMap.get("accountId");

    if (typeof accountId !== "string") {
      throw Error("Invalid account id");
    }

    const account = await ctx.accountService.get(accountId);
    if (!account) {
      return "No such account exists";
    }

    return `Account Details\nId: ${account.getId()}\nFull Name: ${account.getFullName()}\nBalance (USD): ${account.getBalance()}`;
  });

  return view;
}
