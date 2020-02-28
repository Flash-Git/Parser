import React, { FC, useReducer } from "react";
import { Provider } from "ethers/providers";
import { Web3State } from "context";

import Web3Context from "./Web3Context";
import Web3Reducer from "./Web3Reducer";

import { SET_PROVIDER } from "../types";

const Web3State: FC = props => {
  const initialState: Web3State = { provider: null };

  const [state, dispatch] = useReducer(Web3Reducer, initialState);

  /*
   * Actions
   */

  const setProvider = (provider: Provider) => {
    dispatch({
      type: SET_PROVIDER,
      payload: provider
    });
  };

  return (
    <Web3Context.Provider value={{ provider: state.provider, setProvider }}>
      {props.children}
    </Web3Context.Provider>
  );
};

export default Web3State;
