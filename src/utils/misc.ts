import { utils } from "ethers";
import { Provider } from "ethers/providers";

export const zeroPad = (num: any, places: number) =>
  String(num).padStart(places, "0");

export const isAddress = (address: string) => {
  try {
    utils.getAddress(address);
  } catch (e) {
    return false;
  }
  return true;
};

export const isENS = async (provider: Provider, name: string) => {
  try {
    if ((await provider.resolveName(name)) === null) throw new Error();
  } catch (e) {
    return false;
  }
  return true;
};
