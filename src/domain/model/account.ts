export class Account {
  private id: string;
  private fullName: string;
  private balance: number;

  constructor(id: string, fullName: string) {
    if (fullName.length > MAX_NAME_LEN || fullName.length < MIN_NAME_LEN) {
      throw Error(
        `Full name must be between [${MIN_NAME_LEN}-${MAX_NAME_LEN}] characters long`
      );
    }

    this.id = id;
    this.fullName = fullName;
    this.balance = 0;
  }

  addBalance(amount: number) {
    this.balance += amount;
  }

  deductBalance(amount: number) {
    const newAmount = this.balance - amount;
    if (newAmount < 0)
      throw Error(
        `Account balance can't go below 0\nYou only have $${this.balance} available at this time`
      );

    this.balance = newAmount;
  }

  getId() {
    return this.id;
  }

  getFullName() {
    return this.fullName;
  }

  getBalance() {
    return this.balance;
  }

  static fromProps(props: AccountProps) {
    if (props.balance < 0) throw Error("Account balance can't be less than 0");
    if (
      props.fullName.length > MAX_NAME_LEN ||
      props.fullName.length < MIN_NAME_LEN
    ) {
      throw Error(
        `Full name must be between [${MIN_NAME_LEN}-${MAX_NAME_LEN}] characters long`
      );
    }

    const account = new Account(props.id, props.fullName);
    account.balance = props.balance;
    return account;
  }

  toProps(): AccountProps {
    return {
      id: this.id,
      fullName: this.fullName,
      balance: this.balance,
    };
  }
}

const MIN_NAME_LEN = 3;
const MAX_NAME_LEN = 64;

export type AccountProps = {
  id: string;
  fullName: string;
  balance: number;
};
