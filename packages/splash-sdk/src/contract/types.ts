import {
  SplashProjectFactory,
} from '@splash/contracts';

export interface ContractAddresses {
  splashProject: string;
}

export interface Contracts {
  splashProjectContract: ReturnType<typeof SplashProjectFactory.connect>;
}

export enum ChainId {
  Mainnet = 1,
  Ropsten = 3,
  Rinkeby = 4,
  Kovan = 42,
  Mumbai = 80001,
  Local = 31337,
}
