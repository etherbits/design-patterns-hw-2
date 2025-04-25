import { Account } from "../model/account";

export interface IAccountRepository {
  get(id: string): Promise<Account | null>;
  add(account: Account): Promise<void>;
  update(account: Account): Promise<void>;
  delete(id: string): Promise<void>;
  getAll(): Promise<Account[]>;
}
