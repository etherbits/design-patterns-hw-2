import { randomUUIDv7 } from "bun";
import type { IAccountRepository } from "../../domain/interface/accountRepository";
import { Account } from "../../domain/model/account";

export class AccountService {
  constructor(private readonly accountRepository: IAccountRepository) {}

  async get(id: string) {
    return await this.accountRepository.get(id);
  }

  async getAll() {
    return await this.accountRepository.getAll();
  }

  async create(fullName: string) {
    const accountId = randomUUIDv7()
    const account = new Account(accountId, fullName);
    await this.accountRepository.add(account);
    return account
  }

  async delete(id: string) {
    await this.accountRepository.delete(id);
  }

  async deposit(accountId: string, amount: number) {
    const account = await this.accountRepository.get(accountId);
    if (!account) throw Error("Account does not exist");

    account.addBalance(amount);
    await this.accountRepository.update(account);
  }

  async withdraw(accountId: string, amount: number) {
    if (amount <= 0)
      throw Error("The withdraw amount must be a positive number");

    const account = await this.accountRepository.get(accountId);
    if (!account) throw Error("Account does not exist");

    account.deductBalance(amount);
    await this.accountRepository.update(account);
  }

  async transfer(accountFromId: string, accountToId: string, amount: number) {
    if (amount <= 0)
      throw Error("The transfer amount must be a positive number");

    if (accountFromId === accountToId)
      throw Error(
        "The accounts to transfer from and transfer to should be different"
      );

    const accountFrom = await this.accountRepository.get(accountFromId);
    if (!accountFrom)
      throw Error("Account you want to transfer from does not exist");

    const accountTo = await this.accountRepository.get(accountToId);
    if (!accountTo)
      throw Error("Account you want to transfer to does not exist");

    // This being first is important as it will throw an error if the funds are insufficient
    accountFrom.deductBalance(amount);
    await this.accountRepository.update(accountFrom);

    accountTo.addBalance(amount);
    await this.accountRepository.update(accountTo);
  }
}
