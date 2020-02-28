import React, { FC, useReducer } from "react";
import { Web3State, SetEtherscanProvider, SetProvider } from "context";

import Web3Context from "./Web3Context";
import Web3Reducer from "./Web3Reducer";

import { SET_PROVIDER, SET_ETHERSCAN_PROVIDER } from "../types";

const Web3State: FC = props => {
  const initialState: Web3State = { provider: null, etherscanProvider: null };

  const [state, dispatch] = useReducer(Web3Reducer, initialState);

  /*
   * Actions
   */

  const setProvider: SetProvider = provider => {
    dispatch({
      type: SET_PROVIDER,
      payload: provider
    });
  };

  const setEtherscanProvider: SetEtherscanProvider = provider => {
    dispatch({
      type: SET_ETHERSCAN_PROVIDER,
      payload: provider
    });
  };

  return (
    <Web3Context.Provider
      value={{
        provider: state.provider,
        etherscanProvider: state.etherscanProvider,
        setProvider,
        setEtherscanProvider
      }}
    >
      {props.children}
    </Web3Context.Provider>
  );
};

export default Web3State;
