import { Provider } from "ethers/providers";

export interface Action {
  payload?: any;
  type: string;
}

export interface Web3State {
  provider: Provider;
}
