import { task, types } from 'hardhat/config';

task('mint', 'Mint')
  .addOptionalParam(
    'splash',
    'The `Splash` contract address',
    '0xa14EBbd4b00f60942eCE0254e1A400CD567D5B50',
    types.string,
  )
  .setAction(async ({ splash }, { ethers }) => {
    const nftFactory = await ethers.getContractFactory('SplashProject');
    const nftContract = nftFactory.attach(splash);

    let receipt;
    
    // receipt = await nftContract.uri(1);
    // console.log(receipt);

    // receipt = await nftContract.create(0);
    // console.log(receipt);

    receipt = await nftContract.updateURI(5, "ipfs://Qma7mxXjdE5iCPrvqysikF5EuBdj5wMeDFNT2peKcMVCZD");
    console.log(receipt);
  });
