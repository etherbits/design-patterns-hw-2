import { View, type Action } from ".";

export function singleSelectAccountView(
  content: string,
  stateKey: string,
  innerView: () => View
) {
  return () => {
    const view = new View(content);

    view.setContextActionGenerator(async (ctx) => {
      const accounts = await ctx.accountService.getAll();

      const selectAccountActions = accounts.map((account, idx) => {
        return {
          trigger: idx.toString(),
          label: `ID: ${account.getId()} | Full Name: ${account.getFullName()}`,
          callback: async (ctx) => {
            ctx.stateMap.set(stateKey, account.getId());
            return innerView;
          },
        } satisfies Action;
      });

      return selectAccountActions;
    });
    return view;
  };
}
