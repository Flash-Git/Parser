import { SET_PROVIDER, SET_ETHERSCAN_PROVIDER } from "../types";
import { Web3State, Action } from "context";

const Web3Reducer = (
  state: Web3State,
  { type, payload }: Action
): Web3State => {
  switch (type) {
    case SET_PROVIDER:
      return { ...state, provider: payload };
    case SET_ETHERSCAN_PROVIDER:
      return { ...state, etherscanProvider: payload };
    default:
      return state;
  }
};

export default Web3Reducer;
