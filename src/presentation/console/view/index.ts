import type { AccountService } from "../../../application/service/accountService";
import { homeView } from "./home";

export class View {
  private content?: string | ((ctx: ViewContext) => Promise<string>);
  private context?: ViewContext;
  private actions: Action[];
  private contextActionGenerator?: (ctx: ViewContext) => Promise<Action[]>;

  constructor(msg?: string) {
    this.setContent(msg);
    this.actions = defaultActions;
  }

  async init(ctx: ViewContext) {
    this.setContext(ctx);
    await this.generateContextActions();
  }

  addActions(actions: Action[]) {
    this.actions = [...defaultActions, ...actions];
  }

  overrideActions(actions: Action[]) {
    this.actions = actions;
  }

  async setContextActionGenerator(
    fn: NonNullable<typeof this.contextActionGenerator>
  ) {
    this.contextActionGenerator = fn;
  }

  async generateContextActions() {
    if (!this.contextActionGenerator) return;
    if (!this.context)
      throw Error(
        "Context must be initialized before calling generateContextActions"
      );

    this.actions = [
      ...this.actions,
      ...(await this.contextActionGenerator(this.context)),
    ];
  }

  setContext(ctx: ViewContext) {
    this.context = ctx;
  }

  setContent(msg: typeof this.content) {
    this.content = msg;
  }

  async serve() {
    if (!this.actions || this.actions.length === 0 || !this.context)
      throw Error(
        "The view must be initialized before calling the serve method"
      );

    await this.render();
    const trigger = this.prompt();
    return await this.runAction(trigger);
  }

  private async render() {
    console.clear();

    if (typeof this.content === "string") {
      console.log(this.content);
    } else if (typeof this.content === "function") {
      console.log(await this.content(this.context!));
    }

    if (this.content) {
      console.log("");
    }

    this.actions!.forEach((action) => {
      console.log(`${action.trigger}: ${action.label}`);
    });

    console.log("");
  }

  private prompt(): string {
    const trigger = prompt("Execute: ") ?? "";
    return trigger;
  }

  private async runAction(trigger: string) {
    const action = this.actions!.find((action) => action.trigger === trigger);
    if (!action) {
      const inputAction = this.actions!.find(
        (action) => action.trigger === "*"
      );
      if (!inputAction) return null;

      return await inputAction.callback(this.context!, trigger);
    }

    return await action.callback(this.context!);
  }
}

const defaultActions = [
  { trigger: "x", label: "Quit the CLI", callback: () => process.exit() },
  {
    trigger: "/",
    label: "Go back to home view",
    callback: async () => homeView,
  },
  {
    trigger: "<",
    label: "Go back to the previous view",
    callback: async (ctx) => ctx.back(),
  },
] satisfies Action[];

export type Action = {
  // The string input that will trigger the action
  trigger: string;
  label: string;
  // The function that will be run when the action gets triggered
  callback: (ctx: ViewContext, input?: string) => Promise<(() => View) | null>;
};

export type ViewContext = {
  accountService: AccountService;
  stateMap: Map<string, unknown>;
  back: () => () => View;
};
