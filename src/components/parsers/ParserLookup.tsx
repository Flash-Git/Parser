import React, { FC, useState, FormEvent, useContext } from "react";
import { resetType } from "parsers";
import { ethers } from "ethers";
import { TransactionResponse } from "ethers/providers";
import { useMountEffect } from "utils/hooks";
import { zeroPad } from "utils/misc";
import { Web3Context as IWeb3Context } from "context";

import Web3Context from "context/web3/Web3Context";

interface Props {
  resetType: resetType;
}

interface FixedTransactionResponse extends TransactionResponse {
  creates?: string;
}

const ParserLookup: FC<Props> = ({ resetType }) => {
  const web3Context: IWeb3Context = useContext(Web3Context);
  const { etherscanProvider, setEtherscanProvider } = web3Context;

  // Input
  const [address, setAddress] = useState("");

  // Response
  const [transactions, setTransactions] = useState([]);

  const updateEtherscanProvider = () => {
    setEtherscanProvider(new ethers.providers.EtherscanProvider());
  };

  useMountEffect(() => updateEtherscanProvider());

  const getTransactions = async () => {
    const history = await etherscanProvider.getHistory(address, 0, "latest");
    const txs = history.map((tx: FixedTransactionResponse) => {
      return { to: tx.to, creates: tx.creates, hash: tx.hash, data: tx.data };
    });
    setTransactions(txs);
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    getTransactions();
  };

  return (
    <div>
      <form onSubmit={onSubmit}>
        <input
          type="text"
          value={address}
          onChange={e => setAddress(e.target.value)}
        />
        <div className="center text-center">
          <button className="btn mx" type="submit">
            Lookup
          </button>
          <button className="btn mx" onClick={() => resetType()}>
            Reset Parser
          </button>
        </div>
      </form>
      <div className="m-2">
        {transactions.map((tx, index: number) => (
          <div key={index} style={{ width: "100%" }}>
            {zeroPad(index, 3)}
            {" - Tx Hash: "}
            <a href={`etherscan.com/io/${tx.hash}`}>{`${tx.hash.slice(
              0,
              5
            )}...${tx.hash.slice(-5)}`}</a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ParserLookup;
