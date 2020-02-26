import { SET_PROVIDER } from "../types";

import { Action, Web3State } from "./IWeb3";

const Web3Reducer = (
  state: Web3State,
  { type, payload }: Action
): Web3State => {
  switch (type) {
    case SET_PROVIDER:
      return { ...state, provider: payload };
    default:
      return state;
  }
};

export default Web3Reducer;
