declare module "context" {
  import { Provider, EtherscanProvider } from "ethers/providers";

  export type Action = {
    payload?: any;
    type: string;
  };

  // Alert
  export type Alert = {
    msg: string;
    type: string;
    id: string;
  };

  export type Alerts = Alert[];

  export type AddAlert = (
    msg: string,
    type: "primary" | "light" | "dark" | "danger" | "success" | "white",
    timeout?: number
  ) => void;

  export type ClearAlerts = () => void;

  // Web3
  export interface Web3State {
    provider: Provider;
    etherscanProvider: EtherscanProvider;
  }

  export type SetProvider = (provider: Provider) => void;

  export type SetEtherscanProvider = (provider: EtherscanProvider) => void;

  export interface Web3Context extends Web3State {
    setProvider: SetProvider;
    setEtherscanProvider: SetEtherscanProvider;
  }
}
