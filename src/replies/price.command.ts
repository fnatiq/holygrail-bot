import Web3 from 'web3';
import {
  HLY,
  WONE_CONTRACT,
  HLY_PAIR,
  USDC_CONTRACT,
  USDC_PAIR,
} from '../values';
import HlyArtefact from '../resources/HLY.json';
import { AbiItem } from 'web3-utils';

const web3 = new Web3('https://api.harmony.one');

const HLYTokenContract = new web3.eth.Contract(
  HlyArtefact.abi as AbiItem[],
  HLY
);

const WoneTokenContract = new web3.eth.Contract(
  HlyArtefact.abi as AbiItem[], // ERC20
  WONE_CONTRACT
);

const UsdcTokenContract = new web3.eth.Contract(
  HlyArtefact.abi as AbiItem[], // ERC20
  USDC_CONTRACT
);

// global variables for caching
export let priceCLNYperONE = 0;
export let priceONEperUSD = 0;
export let priceCLNYperUSD = 0;

export const numMinutesCache = 1;

// background async cache every numMinutesCache
(async () => {
  while (true) {
    try {
      const clnyInLiquidity =
        (await HLYTokenContract.methods.balanceOf(HLY_PAIR).call()) * 1e-18;
      const oneInLiquidity =
        (await WoneTokenContract.methods.balanceOf(HLY_PAIR).call()) * 1e-18;
      const usdcInUsdcLiquidity =
        (await UsdcTokenContract.methods.balanceOf(USDC_PAIR).call()) * 1e-6;
      const oneInUsdcLiquidity =
        (await WoneTokenContract.methods.balanceOf(USDC_PAIR).call()) * 1e-18;

      priceCLNYperONE = oneInLiquidity / clnyInLiquidity;
      priceONEperUSD = usdcInUsdcLiquidity / oneInUsdcLiquidity;
      priceCLNYperUSD = priceCLNYperONE * priceONEperUSD;
    } catch (error) {
      console.log('pricing error', error);
    }

    await new Promise((resolve) =>
      setTimeout(resolve, 1000 * 60 * numMinutesCache)
    );
  }
})();
