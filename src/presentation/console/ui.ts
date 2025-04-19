import { View } from "./view";
import { HomeView } from "./view/homeView.ts";
import { AccountService } from "../../application/accountService";

export class ConsoleUI {
  currentView: View;
  constructor(private readonly accountService: AccountService) {
    this.currentView = HomeView;
  }

  run() {
    while (true) {
      const nextView = this.currentView.serve();
      if (!nextView) return;

      this.currentView = nextView;
    }
  }
}
