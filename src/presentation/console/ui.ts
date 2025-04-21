import { View, type ViewContext } from "./view";
import { homeView } from "./view/home";
import { AccountService } from "../../application/service/accountService";
import { basicView } from "./view/basic";

export class ConsoleUI {
  viewFnStack: (() => View)[];
  currentView!: View;
  viewContext: ViewContext;
  skipNextHistory: boolean;

  constructor(private readonly accountService: AccountService) {
    this.viewContext = {
      accountService: this.accountService,
      stateMap: new Map(),
      back: () => {
        if (this.viewFnStack.length > 1) {
          this.viewFnStack.pop();
        }
        this.skipNextHistory = true;

        return this.viewFnStack[this.viewFnStack.length - 1];
      },
    };

    this.viewFnStack = [];
    this.skipNextHistory = false;
  }

  async init() {
    await this.setView(DEFAULT_VIEW);
  }

  async setView(viewFn: () => View) {
    if (this.skipNextHistory) {
      this.skipNextHistory = false;
    } else {
      this.viewFnStack.push(viewFn);
    }

    const view = viewFn();
    await view.init(this.viewContext);
    this.currentView = view;
  }

  async run() {
    while (true) {
      try {
        const nextView = await this.currentView.serve();
        if (nextView === null) {
          await this.setView(
            basicView(
              "Invalid input.\nPlease look at the available actions and input a valid sequence"
            )
          );

          continue;
        }

        await this.setView(nextView);
      } catch (err) {
        await this.setView(basicView("Error"));
        if (err instanceof Error) {
          this.currentView.setContent(`ERROR: ${err.message}`);
        }
      }
    }
  }
}

const DEFAULT_VIEW = homeView;