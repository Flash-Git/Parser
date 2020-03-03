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

export const validateAddress = async (address: string, provider: Provider) => {
  if (address.length === 0) return false;
  if (isAddress(address)) return true;
  if (await isENS(provider, address)) return true;
  return false;
};
