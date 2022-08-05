import { SplashAccount, SplashProject } from '../types/schema';
import { ZERO_ADDRESS, BIGINT_ZERO, BIGINT_ONE } from './constants';

export function getOrCreateAccount(
  id: string,
  createIfNotFound: boolean = true,
  save: boolean = true,
): SplashAccount {
  let holder = SplashAccount.load(id);

  if (holder == null && createIfNotFound) {
    holder = new SplashAccount(id);

    if (save) {
      holder.save();
    }
  }

  return holder as SplashAccount;
}

export function getOrCreateProject(
  id: string,
  createIfNotFound: boolean = true,
  save: boolean = true,
): SplashProject {
  let holder = SplashProject.load(id);

  if (holder == null && createIfNotFound) {
    holder = new SplashProject(id);

    if (save) {
      holder.save();
    }
  }

  return holder as SplashProject;
}
