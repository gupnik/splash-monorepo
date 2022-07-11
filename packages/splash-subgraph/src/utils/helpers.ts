import { SplashAccount } from '../types/schema';
import { ZERO_ADDRESS, BIGINT_ZERO, BIGINT_ONE } from './constants';

export function getOrCreateAccount(
  id: string,
  createIfNotFound: boolean = true,
  save: boolean = true,
): SplashAccount {
  let holder = SplashAccount.load(id);

  if (holder == null && createIfNotFound) {
    holder = new SplashAccount(id);
    holder.projects = []

    if (save) {
      holder.save();
    }
  }

  return holder as SplashAccount;
}
