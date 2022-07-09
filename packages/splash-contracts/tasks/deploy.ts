import { Interface } from 'ethers/lib/utils';
import { task, types } from 'hardhat/config';
import promptjs from 'prompt';

promptjs.colors = false;
promptjs.message = '> ';
promptjs.delimiter = '';

type ContractName =
  | 'SplashProject';

interface Contract {
  args?: (string | number | (() => string | undefined))[];
  address?: string;
  libraries?: () => Record<string, string>;
  waitForConfirmation?: boolean;
}

task('deploy', 'Deploys SplashProject')
  .setAction(async (args, { ethers }) => {
    const network = await ethers.provider.getNetwork();
    const proxyRegistryAddress =
      network.chainId === 1
        ? '0x58807baD0B376efc12F5AD86aAc70E78ed67deaE'
        : '0xff7Ca10aF37178BdD056628eF42fD7F799fAc77c';

    const [deployer] = await ethers.getSigners();
    const nonce = await deployer.getTransactionCount();

    const contracts: Record<ContractName, Contract> = {
      SplashProject: {
        args: [
          "Splash",
          "SP",
          proxyRegistryAddress
        ],
      },
    };

    let gasPrice = await ethers.provider.getGasPrice();
    const gasInGwei = Math.round(Number(ethers.utils.formatUnits(gasPrice, 'gwei')));

    // promptjs.start();

    // let result = await promptjs.get([
    //   {
    //     properties: {
    //       gasPrice: {
    //         type: 'integer',
    //         required: true,
    //         description: 'Enter a gas price (gwei)',
    //         default: gasInGwei,
    //       },
    //     },
    //   },
    // ]);

    // gasPrice = ethers.utils.parseUnits(result.gasPrice.toString(), 'gwei');

    for (const [name, contract] of Object.entries(contracts)) {
      const factory = await ethers.getContractFactory(name, {
        libraries: contract?.libraries?.(),
      });

      // const deploymentGas = await factory.signer.estimateGas(
      //   factory.getDeployTransaction(
      //     ...(contract.args?.map(a => (typeof a === 'function' ? a() : a)) ?? []),
      //     {
      //       gasPrice,
      //     },
      //   ),
      // );
      // const deploymentCost = deploymentGas.mul(gasPrice);

      // console.log(
      //   `Estimated cost to deploy ${name}: ${ethers.utils.formatUnits(
      //     deploymentCost,
      //     'ether',
      //   )} ETH`,
      // );

      // result = await promptjs.get([
      //   {
      //     properties: {
      //       confirm: {
      //         type: 'string',
      //         description: 'Type "DEPLOY" to confirm:',
      //       },
      //     },
      //   },
      // ]);

      // if (result.confirm != 'DEPLOY') {
      //   console.log('Exiting');
      //   return;
      // }

      console.log('Deploying...');

      const deployedContract = await factory.deploy(
        ...(contract.args?.map(a => (typeof a === 'function' ? a() : a)) ?? []),
        {
          // gasPrice,
        },
      );

      if (contract.waitForConfirmation) {
        await deployedContract.deployed();
      }

      contracts[name as ContractName].address = deployedContract.address;

      console.log(`${name} contract deployed to ${deployedContract.address}`);
    }

    return contracts;
  });
