export interface Action {
  payload?: any;
  type: string;
}

export type Alert = {
  msg: string;
  type: string;
  id: string;
};

export type Alerts = Alert[];

export interface AddAlert {
  (
    msg: string,
    type: "primary" | "light" | "dark" | "danger" | "success" | "white",
    timeout?: number
  ): void;
}

export interface ClearAlerts {
  (): void;
}
