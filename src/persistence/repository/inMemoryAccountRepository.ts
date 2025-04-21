import type { IAccountRepository } from "../../domain/interface/accountRepository";
import { Account } from "../../domain/model/account";

export class InMemoryAccountRepository implements IAccountRepository {
  private store: AccountStore;

  constructor() {
    this.store = new Map();
  }

  async get(id: string) {
    const accountData = this.store.get(id);
    if (!accountData) return null;

    const account = Account.fromProps({ id, ...accountData });
    return account;
  }

  async add(account: Account) {
    const props = account.toProps();
    this.store.set(props.id, {
      fullName: props.fullName,
      balance: props.balance,
    });
  }

  async update(account: Account) {
    // For now the implementations of these methods require the same code, so this works
    this.add(account);
  }

  async delete(id: string) {
    this.store.delete(id);
  }

  async getAll() {
    const accountProps = Array.from(this.store.entries())
      .map(([id, accountData]) => {
        if (!accountData) return null;
        return { id, ...accountData };
      })
      .filter((x) => x !== null);

    const accounts = accountProps.map((props) => Account.fromProps(props));

    return accounts;
  }
}

type AccountStore = Map<
  string,
  {
    fullName: string;
    balance: number;
  }
>;
