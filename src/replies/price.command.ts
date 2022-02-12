import Web3 from 'web3';
import { HLY, HLY_PAIR } from '../values.js';
import HLYAbi from '../resources/HLY.json' assert {type: "json"};
import { AbiItem } from 'web3-utils';

const web3 = new Web3('https://api.harmony.one');

const HLYTokenContract = new web3.eth.Contract(HLYAbi.abi as AbiItem[], HLY);

// global variables for caching
export let priceHLYperONE = 0;
export let priceONEperUSD = 0;
export let priceHLYperUSD = 0;

export const numMinutesCache = 1;

// background async cache every numMinutesCache
(async () => {
  while (true) {
    try {
      const onePerUSD =
        (await HLYTokenContract.methods.getLatestONEPrice().call()) * 1e-8;

      // why does pair address give HLY/USD instead of HLY/ONE?
      const onePerHLY =
        (await HLYTokenContract.methods
          .getLatestTokenPrice(HLY_PAIR, 1)
          .call()) * 1e-18;

      priceONEperUSD = onePerUSD;
      priceHLYperONE = 1 / onePerHLY;
      priceHLYperUSD = priceHLYperONE * priceONEperUSD;
    } catch (error) {
      console.log('pricing error', error);
    }

    await new Promise((resolve) =>
      setTimeout(resolve, 1000 * 60 * numMinutesCache)
    );
  }
})();
