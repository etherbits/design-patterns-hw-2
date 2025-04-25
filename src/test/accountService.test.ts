import { describe, it, expect, beforeEach, afterEach } from "bun:test";
import { AccountService } from "../application/service/accountService";
import { InMemoryAccountRepository } from "../persistence/repository/inMemoryAccountRepository";

describe("AccountService", () => {
  let repo: InMemoryAccountRepository;
  let service: AccountService;

  beforeEach(() => {
    repo = new InMemoryAccountRepository();
    service = new AccountService(repo);
  });

  afterEach(async () => {
    // Cleaning up accounts after every test
    const accounts = await service.getAll();
    accounts.forEach((acc) => service.delete(acc.getId()));
  });

  it("creates and retrieves an account", async () => {
    const account = await service.create("Zura");
    const fetchedAccount = await service.get(account.getId());

    expect(fetchedAccount?.getFullName()).toBe("Zura");
    expect(fetchedAccount?.getBalance()).toBe(0);
  });

  it("deposits money into account", async () => {
    const account = await service.create("Irakli");
    const accountId = account.getId();

    await service.deposit(accountId, 200);
    const updatedAccount = await service.get(account.getId());
    expect(updatedAccount?.getBalance()).toBe(200);
  });

  it("withdraws money from account", async () => {
    const account = await service.create("Giorgi");
    const accountId = account.getId();

    await service.deposit(accountId, 200);
    const updatedAccount = await service.get(account.getId());
    expect(updatedAccount?.getBalance()).toBe(200);
  });

  it("throws if withdrawing more than balance", async () => {
    const account = await service.create("Nika");
    const accountId = account.getId();

    await service.deposit(accountId, 200);
    expect(async () => await service.withdraw(accountId, 300)).toThrow(
      "Account balance can't go below 0"
    );
  });

  it("throws if withdrawing a non-positive amount", async () => {
    const account = await service.create("Nika");
    const accountId = account.getId();

    await service.deposit(accountId, 200);
    expect(async () => await service.withdraw(accountId, 0)).toThrow(
      "The withdraw amount must be a positive number"
    );
  });

  it("transfers money between accounts", async () => {
    const accountFrom = await service.create("ACC1");
    const accountTo = await service.create("ACC2");

    const fromId = accountFrom.getId();
    const toId = accountTo.getId();

    await service.deposit(fromId, 500);
    await service.transfer(fromId, toId, 200);
    
    const updatedAccountFrom = await service.get(accountFrom.getId());
    const updatedAccountTo = await service.get(accountTo.getId());

    expect(updatedAccountFrom?.getBalance()).toBe(300);
    expect(updatedAccountTo?.getBalance()).toBe(200);
  });

  it("throws if transferring to self", async () => {
    const account = await service.create("SomeGuy");
    const accountId = account.getId();

    expect(
      async () => await service.transfer(accountId, accountId, 100)
    ).toThrow(
      "The accounts to transfer from and transfer to should be different"
    );
  });

  it("throws if transferring to non-existent account", async () => {
    const account = await service.create("Somebody");
    const accountId = account.getId();

    expect(
      async () => await service.transfer(accountId, "non-existent-id", 50)
    ).toThrow("Account you want to transfer to does not exist");
  });

  it("throws if transferring from non-existent account", async () => {
    const account = await service.create("Somebody");
    const accountId = account.getId();

    expect(
      async () => await service.transfer("non-existent", accountId, 50)
    ).toThrow("Account you want to transfer from does not exist");
  });
});
