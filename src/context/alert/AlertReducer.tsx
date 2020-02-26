import { ADD_ALERT, REMOVE_ALERT, CLEAR_ALERTS } from "../types";
import { Alerts, Action } from "context";

const AlertReducer = (state: Alerts, { type, payload }: Action): Alerts => {
  switch (type) {
    case ADD_ALERT:
      return [...state, payload];
    case REMOVE_ALERT:
      return state.filter(alert => alert.id !== payload);
    case CLEAR_ALERTS:
      return [];
    default:
      return state;
  }
};

export default AlertReducer;
