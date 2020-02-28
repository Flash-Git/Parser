declare module "context" {
  import { Provider } from "ethers/providers";

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
  export type Action = {
    payload?: any;
    type: string;
  };

  export type Web3State = { provider: Provider };
}
