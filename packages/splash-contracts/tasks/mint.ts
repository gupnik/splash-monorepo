import { task, types } from 'hardhat/config';

task('mint', 'Mint')
  .addOptionalParam(
    'splash',
    'The `Splash` contract address',
    '0x5FbDB2315678afecb367f032d93F642f64180aa3', //'0xa14EBbd4b00f60942eCE0254e1A400CD567D5B50',
    types.string,
  )
  .setAction(async ({ splash }, { ethers }) => {
    const nftFactory = await ethers.getContractFactory('SplashProject');
    const nftContract = nftFactory.attach(splash);

    const { chainId } = await ethers.provider.getNetwork();

    let receipt;
    
    receipt = await nftContract.uri(0);
    console.log(receipt);

    receipt = await nftContract.create(1);
    console.log(receipt);

    // receipt = await nftContract.updateURI(5, "ipfs://Qma7mxXjdE5iCPrvqysikF5EuBdj5wMeDFNT2peKcMVCZD");
    // console.log(receipt);

    console.log(
      `Splash minted to local node at http://localhost:8545 (Chain ID: ${chainId})`,
    );
  });
