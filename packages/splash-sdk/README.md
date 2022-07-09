# @splash/sdk

## Development

### Install dependencies

```sh
yarn
```

### Run tests

```sh
yarn test
```

## Usage

The Splash SDK contains useful tooling for interacting with the YQC protocol.

### Contracts

**Get Contract Addresses**

```ts
import { ChainId, getContractAddressesForChainOrThrow } from '@splash/sdk';

const { splashProjectContract } = getContractAddressesForChainOrThrow(ChainId.Mainnet);
```

**Get Contract Instances**

```ts
import { ChainId, getContractsForChainOrThrow } from '@splash/sdk';

const provider = new providers.JsonRpcProvider(RPC_URL);

const { splashProjectContract } = getContractsForChainOrThrow(ChainId.Mainnet, provider);
```

**Get Contract ABIs**

```ts
import { SplashProjectABI } from '@splash/sdk';
```

