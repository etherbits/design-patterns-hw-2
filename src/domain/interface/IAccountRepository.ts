import {Account} from '../model/account'

export interface IAccountRepository {
    get(id: string): Account | null
    add(account: Account): void
    update(account: Account): void
    delete(id: string): void
    getAll(): Account[]
}