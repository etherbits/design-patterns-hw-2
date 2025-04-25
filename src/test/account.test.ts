import { beforeEach, describe, expect, it } from "bun:test";
import { Account, type AccountProps } from "../domain/model/account";

// Mock uuid for tests
const mockUUID = "123e4567-e89b-12d3-a456-426614174000";

describe("Account", () => {
  describe("constructor", () => {
    it("should create an account with valid full name", () => {
      const account = new Account(mockUUID, "John Doe");
      expect(account.getFullName()).toBe("John Doe");
      expect(account.getId()).toBe(mockUUID);
      expect(account.getBalance()).toBe(0);
    });

    it("should throw an error if full name is too short", () => {
      expect(() => new Account(mockUUID, "Jo")).toThrow(
        `Full name must be between [3-64] characters long`
      );
    });

    it("should throw an error if full name is too long", () => {
      const longName = "A".repeat(65);
      expect(() => new Account(mockUUID, longName)).toThrow(
        `Full name must be between [3-64] characters long`
      );
    });

    it("should accept a name at minimum length", () => {
      const account = new Account(mockUUID, "Bob");
      expect(account.getFullName()).toBe("Bob");
    });

    it("should accept a name at maximum length", () => {
      const maxLengthName = "A".repeat(64);
      const account = new Account(mockUUID, maxLengthName);
      expect(account.getFullName()).toBe(maxLengthName);
    });
  });

  describe("addBalance", () => {
    let account: Account;

    beforeEach(() => {
      account = new Account(mockUUID, "John Doe");
    });

    it("should add a positive amount to the balance", () => {
      account.addBalance(100);
      expect(account.getBalance()).toBe(100);
    });

    it("should handle adding zero to the balance", () => {
      account.addBalance(0);
      expect(account.getBalance()).toBe(0);
    });

    it("should handle adding multiple amounts", () => {
      account.addBalance(100);
      account.addBalance(50);
      account.addBalance(25);
      expect(account.getBalance()).toBe(175);
    });
  });

  describe("deductBalance", () => {
    let account: Account;

    beforeEach(() => {
      account = new Account(mockUUID, "John Doe");
      account.addBalance(100);
    });

    it("should deduct an amount from the balance", () => {
      account.deductBalance(30);
      expect(account.getBalance()).toBe(70);
    });

    it("should allow deducting the entire balance", () => {
      account.deductBalance(100);
      expect(account.getBalance()).toBe(0);
    });

    it("should throw an error when trying to deduct more than the balance", () => {
      expect(() => account.deductBalance(101)).toThrow(
        "Account balance can't go below 0\nYou only have $100 available at this time"
      );
    });

    it("should not change the balance when deduction fails", () => {
      try {
        account.deductBalance(101);
      } catch (error) {
        // Ignore the error
      }
      expect(account.getBalance()).toBe(100);
    });
  });

  describe("getId", () => {
    it("should return the account ID", () => {
      const account = new Account(mockUUID, "John Doe");
      expect(account.getId()).toBe(mockUUID);
    });
  });

  describe("getFullName", () => {
    it("should return the account full name", () => {
      const account = new Account(mockUUID, "John Doe");
      expect(account.getFullName()).toBe("John Doe");
    });
  });

  describe("getBalance", () => {
    it("should return the account balance", () => {
      const account = new Account(mockUUID, "John Doe");
      expect(account.getBalance()).toBe(0);

      account.addBalance(50);
      expect(account.getBalance()).toBe(50);
    });
  });

  describe("fromProps", () => {
    it("should create an account from valid props", () => {
      const props: AccountProps = {
        id: mockUUID,
        fullName: "John Doe",
        balance: 100,
      };

      const account = Account.fromProps(props);

      expect(account.getId()).toBe(mockUUID);
      expect(account.getFullName()).toBe("John Doe");
      expect(account.getBalance()).toBe(100);
    });

    it("should throw an error if balance is negative", () => {
      const props: AccountProps = {
        id: "test-id",
        fullName: "John Doe",
        balance: -10,
      };

      expect(() => Account.fromProps(props)).toThrow(
        "Account balance can't be less than 0"
      );
    });

    it("should throw an error if full name is too short", () => {
      const props: AccountProps = {
        id: "test-id",
        fullName: "Jo",
        balance: 100,
      };

      expect(() => Account.fromProps(props)).toThrow(
        `Full name must be between [3-64] characters long`
      );
    });

    it("should throw an error if full name is too long", () => {
      const props: AccountProps = {
        id: "test-id",
        fullName: "A".repeat(65),
        balance: 100,
      };

      expect(() => Account.fromProps(props)).toThrow(
        `Full name must be between [3-64] characters long`
      );
    });
  });

  describe("toProps", () => {
    it("should convert an account to props", () => {
      const account = new Account(mockUUID, "John Doe");
      account.addBalance(150);

      const props = account.toProps();

      expect(props).toEqual({
        id: mockUUID,
        fullName: "John Doe",
        balance: 150,
      });
    });
  });
});
