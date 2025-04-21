import { type BunFile } from "bun";
import type { IAccountRepository } from "../../domain/interface/accountRepository";
import { Account } from "../../domain/model/account";

export class FileAccountRepository implements IAccountRepository {
  private storeHandle?: BunFile;

  constructor(private readonly filePath: string) {}

  async get(id: string) {
    const store = await this.retrieveFileStore();
    const accountData = store[id];
    if (!accountData) return null;

    const account = Account.fromProps({ id, ...accountData });
    return account;
  }

  async add(account: Account) {
    const store = await this.retrieveFileStore();
    const props = account.toProps();
    store[props.id] = { fullName: props.fullName, balance: props.balance };
    await this.write(store);
  }

  async update(account: Account) {
    // For now the implementations of these methods require the same code, so this works
    await this.add(account);
  }

  async delete(id: string) {
    const store = await this.retrieveFileStore();
    delete store[id];
    this.write(store);
  }

  async getAll() {
    const store = await this.retrieveFileStore();
    const accountProps = Object.entries(store)
      .map(([id, accountData]) => {
        if (!accountData) return null;
        return { id, ...accountData };
      })
      .filter((x) => x !== null);

    const accounts = accountProps.map((props) => Account.fromProps(props));

    return accounts;
  }

  async init() {
    this.storeHandle = Bun.file(this.filePath);
    if (!(await this.storeHandle.exists())) {
      await Bun.write(this.filePath, JSON.stringify({}));
      this.storeHandle = Bun.file(this.filePath);
    }
  }

  private async retrieveFileStore(): Promise<AccountStore> {
    if (!this.storeHandle) {
      throw Error(
        "The FileAccountRepository needs to be initialized before use"
      );
    }

    const accountStore = (await this.storeHandle?.json()) as unknown;

    return this.parseData(accountStore);
  }

  // To make sure invalid data gets rejected
  private parseData(data: unknown): AccountStore {
    if (
      typeof data !== "object" ||
      data == null ||
      Object.values(data).some((values) => {
        if (typeof values !== "object" || values === null) {
          return true;
        }

        if (!("fullName" in values) || typeof values.fullName !== "string") {
          return true;
        }

        if (!("balance" in values) || typeof values.balance !== "number") {
          return true;
        }
      })
    ) {
      throw Error("Invalid account data");
    }

    return data as AccountStore;
  }

  private async write(store: AccountStore) {
    await Bun.write(this.filePath, JSON.stringify(store));
    this.storeHandle = Bun.file(this.filePath);
  }
}

type AccountStore = Record<
  string,
  | {
      fullName: string;
      balance: number;
    }
  | undefined
>;