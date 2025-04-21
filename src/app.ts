import { AccountService } from "./application/service/accountService";
import { FileAccountRepository } from "./persistence/repository/fileAccountRepository";
import { InMemoryAccountRepository } from "./persistence/repository/inMemoryAccountRepository";
import { ConsoleUI } from "./presentation/console/ui";

export class App {
  run: () => Promise<void>;

  constructor() {
    this.run = () => {
      throw Error("Please initialize the Application before calling run");
    };
  }

  async default() {
    const accountRepository = this.getAccountRepository();
    const accountService = new AccountService(accountRepository);

    const consoleUI = new ConsoleUI(accountService);
    await consoleUI.init();
    this.run = () => consoleUI.run();

    return this;
  }

  private getAccountRepository() {
    // Instantiate repository based on cli flag
    if (process.argv.includes("--file-storage")) {
      const fileAccountRepository = new FileAccountRepository(
        "accountData.json"
      );
      fileAccountRepository.init();
      return fileAccountRepository;
    }

    const inMemoryAccountRepository = new InMemoryAccountRepository();
    return inMemoryAccountRepository;
  }
}