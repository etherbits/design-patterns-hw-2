import { View } from ".";
import { accountDeleteConfirmationView } from "./accountDeleteConfirmation";
import { accountDetailsView } from "./accountDetails";
import { createAccountView } from "./createAccount";
import { depositAmountView } from "./depositAmount";
import { singleSelectAccountView } from "./singleSelectAccountView";
import { transferAmountView } from "./transferAmount";
import { withdrawAmountView } from "./withdrawAmount";

export function homeView() {
  const view = new View("Home");

  view.addActions([
    {
      trigger: "c",
      label: "Create a new bank account",
      callback: async () => createAccountView,
    },
    {
      trigger: "+",
      label: "Deposit to a bank account",
      callback: async () =>
        singleSelectAccountView(
          "Select account for deposit",
          "accountId",
          depositAmountView
        ),
    },
    {
      trigger: "-",
      label: "Withdraw from a bank account",
      callback: async () =>
        singleSelectAccountView(
          "Select account for withdrawal",
          "accountId",
          withdrawAmountView
        ),
    },
    {
      trigger: "d",
      label: "Go to account details",
      callback: async () =>
        singleSelectAccountView(
          "Select account to view details",
          "accountId",
          accountDetailsView
        ),
    },
    {
      trigger: "r",
      label: "Remove account",
      callback: async () =>
        singleSelectAccountView(
          "Select the account to delete",
          "accountId",
          accountDeleteConfirmationView
        ),
    },
    {
      trigger: "t",
      label: "Transfer from one account to another",
      callback: async () =>
        singleSelectAccountView(
          "Select the account to transfer from",
          "accountFromId",
          singleSelectAccountView(
            "Select the account to transfer to",
            "accountToId",
            transferAmountView
          )
        ),
    },
  ]);

  return view;
}
