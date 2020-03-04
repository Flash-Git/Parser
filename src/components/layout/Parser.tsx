import React, { FC, useState, useContext } from "react";
import { ethers } from "ethers";

import Selector from "components/parsers/ParserSelector";
import TxLookup from "components/parsers/ParserTxLookup";
import EventLookup from "components/parsers/ParserEventLookup";
import { useMountEffect } from "utils/hooks";

import Web3Context from "context/web3/Web3Context";
import { Web3Context as IWeb3Context } from "context";
import AlertContext from "context/alert/AlertContext";
import { AlertContext as IAlertContext } from "context";

export enum PARSER_TYPES {
  undefined,
  txLookup,
  eventLookup
}

const Parser: FC = () => {
  /*
   * Context
   */

  const web3Context: IWeb3Context = useContext(Web3Context);
  const { etherscanProvider, setEtherscanProvider } = web3Context;

  const alertContext: IAlertContext = useContext(AlertContext);
  const { addAlert } = alertContext;

  /*
   * State
   */

  const [type, setType] = useState(PARSER_TYPES.undefined);

  /*
   * Hooks
   */

  const updateEtherscanProvider = () => {
    setEtherscanProvider(new ethers.providers.EtherscanProvider());
  };

  useMountEffect(() => updateEtherscanProvider());

  /*
   * Methods
   */

  const resetType = () => {
    setType(PARSER_TYPES.undefined);
  };

  switch (type) {
    case PARSER_TYPES.undefined:
      return <Selector setType={setType} />;
    case PARSER_TYPES.txLookup:
      return (
        <TxLookup
          resetType={resetType}
          etherscanProvider={etherscanProvider}
          addAlert={addAlert}
        />
      );
    case PARSER_TYPES.eventLookup:
      return (
        <EventLookup
          resetType={resetType}
          etherscanProvider={etherscanProvider}
          addAlert={addAlert}
        />
      );
    default:
      throw new Error(`Unhandled parser type: ${type}`);
  }
};

export default Parser;
