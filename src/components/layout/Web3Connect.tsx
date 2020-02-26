import React, { FC, useContext, useState } from "react";
import { getDefaultProvider, providers, utils } from "ethers";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import AlertContext from "context/alert/AlertContext";
import Web3Context from "context/web3/Web3Context";
import { AddAlert } from "context/alert/IAlert";

const Web3Connect: FC = () => {
  const alertContext = useContext(AlertContext);
  const { addAlert }: { addAlert: AddAlert } = alertContext;

  const web3Context = useContext(Web3Context);
  const { provider, setProvider } = web3Context;

  const [balance, setBalance] = useState("0");
  const [address] = useState("jaquinn.eth");

  const setDefaultProvider = async () => {
    // Provider backed by infura and etherscan
    setProvider(await getDefaultProvider());
  };

  const setCurrentProvider = async () => {
    try {
      const provider = await new providers.Web3Provider(
        (window as any).web3.currentProvider
      );
      setProvider(provider);
    } catch (e) {
      addAlert("Failed to get provider", "danger");
      console.log(e);
    }
  };

  const getBalance = async () => {
    if (!provider) return;

    try {
      const bigBalance = await provider.getBalance(address);
      setBalance(utils.formatEther(bigBalance));
    } catch (e) {
      addAlert(`Failed to get balance of ${address}`, "danger");
      console.log(e);
    }
  };

  return (
    <div className="container flex col center">
      <div className="row">
        <button className="btn m" onClick={setDefaultProvider}>
          Connect with Default
        </button>
        <button className="btn m" onClick={setCurrentProvider}>
          Connect with Current
        </button>
      </div>
      <button className="btn m" onClick={getBalance}>
        <FontAwesomeIcon className="mright" icon={["fab", "ethereum"]} />
        {`Balance: ${balance}`}
      </button>
    </div>
  );
};

export default Web3Connect;
