import {
  ContractAddresses as SplashContractAddresses,
  getContractAddressesForChainOrThrow,
} from '@splash/sdk';
import { ChainId } from '@usedapp/core';

interface ExternalContractAddresses {
}

export type ContractAddresses = SplashContractAddresses & ExternalContractAddresses;

interface AppConfig {
  jsonRpcUri: string;
  wsRpcUri: string;
  subgraphApiUri: string;
  enableHistory: boolean;
}

console.log(process.env)

type SupportedChains = ChainId.Mumbai | ChainId.Hardhat;

export const CHAIN_ID: SupportedChains = parseInt(process.env.REACT_APP_CHAIN_ID ?? '80001');

export const ETHERSCAN_API_KEY = process.env.REACT_APP_ETHERSCAN_API_KEY ?? '';

const INFURA_PROJECT_ID = process.env.REACT_APP_INFURA_PROJECT_ID;

export const createNetworkHttpUrl = (network: string): string => {
  const custom = process.env[`REACT_APP_${network.toUpperCase()}_JSONRPC`];
  return custom || `https://polygon-mumbai.g.alchemy.com/v2/${process.env.REACT_APP_ALCHEMY_API_KEY}`;
};

export const createNetworkWsUrl = (network: string): string => {
  const custom = process.env[`REACT_APP_${network.toUpperCase()}_WSRPC`];
  return custom || `wss:////polygon-mumbai.g.alchemy.com/v2/${process.env.REACT_APP_ALCHEMY_API_KEY}`;
};

const app: Record<SupportedChains, AppConfig> = {
  [ChainId.Mumbai]: {
    jsonRpcUri: createNetworkHttpUrl('polygon-mumbai'),
    wsRpcUri: createNetworkWsUrl('polygon-mumbai'),
    subgraphApiUri: 'https://api.thegraph.com/subgraphs/name/gupnik/splash',
    enableHistory: process.env.REACT_APP_ENABLE_HISTORY === 'true',
  },
  [ChainId.Hardhat]: {
    jsonRpcUri: 'http://localhost:8545',
    wsRpcUri: 'ws://localhost:8545',
    subgraphApiUri: '',
    enableHistory: false,
  },
};

const externalAddresses: Record<SupportedChains, ExternalContractAddresses> = {
  [ChainId.Mumbai]: {
  },
  [ChainId.Hardhat]: {
    lidoToken: undefined,
  },
};

const getAddresses = (): ContractAddresses => {
  let splashAddresses = {} as SplashContractAddresses;
  try {
    splashAddresses = getContractAddressesForChainOrThrow(CHAIN_ID);
  } catch {}
  return { ...splashAddresses, ...externalAddresses[CHAIN_ID] };
};

const config = {
  app: app[CHAIN_ID],
  addresses: getAddresses(),
};

export default config;
