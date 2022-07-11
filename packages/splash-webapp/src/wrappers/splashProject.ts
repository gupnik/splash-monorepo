import { useContractCall } from "@usedapp/core"
import { BigNumber as EthersBN, utils } from 'ethers';
import { SplashProjectABI } from '@splash/contracts';
import config from "../config";

const abi = new utils.Interface(SplashProjectABI);

export const useUserProjects = () => {
  const numProjects = useContractCall<EthersBN>({
    abi,
    address: config.addresses.splashProject,
    method: 'numProjects',
    args: [],
  });
}