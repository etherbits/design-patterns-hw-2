import { describe, it, expect, beforeEach } from "bun:test";
import { InMemoryAccountRepository } from "../persistence/repository/inMemoryAccountRepository";
import { Account } from "../domain/model/account";

const createAccount = (id: string, fullName = "Test User", balance = 1000) => {
  return Account.fromProps({ id, fullName, balance });
};

describe("InMemoryAccountRepository", () => {
  let repo: InMemoryAccountRepository;

  beforeEach(() => {
    repo = new InMemoryAccountRepository();
  });

  it("adds and retrieves an account", async () => {
    const account = createAccount("1");
    await repo.add(account);

    const fetched = await repo.get("1");
    expect(fetched?.toProps()).toEqual(account.toProps());
  });

  it("returns null for nonexistent account", async () => {
    const fetched = await repo.get("nonexistent");
    expect(fetched).toBeNull();
  });

  it("updates an existing account", async () => {
    const account = createAccount("1", "Initial Name", 500);
    await repo.add(account);

    const updated = createAccount("1", "Updated Name", 999);
    await repo.update(updated);

    const fetched = await repo.get("1");
    expect(fetched?.toProps()).toEqual(updated.toProps());
  });

  it("deletes an account", async () => {
    const account = createAccount("1");
    await repo.add(account);
    await repo.delete("1");

    const fetched = await repo.get("1");
    expect(fetched).toBeNull();
  });

  it("retrieves all accounts", async () => {
    const account1 = createAccount("1", "User One", 100);
    const account2 = createAccount("2", "User Two", 200);
    await repo.add(account1);
    await repo.add(account2);

    const all = await repo.getAll();
    const ids = all.map((a) => a.toProps().id);
    expect(ids.sort()).toEqual(["1", "2"]);
  });
});
