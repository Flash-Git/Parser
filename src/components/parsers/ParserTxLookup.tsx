import React, { FC, useState, FormEvent, useContext, Fragment } from "react";
import { resetType } from "parsers";
import { ethers, utils } from "ethers";
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

const ParserTxLookup: FC<Props> = ({ resetType }) => {
  const web3Context: IWeb3Context = useContext(Web3Context);
  const { etherscanProvider, setEtherscanProvider } = web3Context;

  // Input
  const [address, setAddress] = useState("");
  const [receivingAddresses, setReceivingAddresses] = useState("");
  const [startBlock, setStartBlock] = useState("9500000"); // TODO accept date

  // Response
  const [transactions, setTransactions] = useState([]);
  const [logs, setLogs] = useState([]);

  const updateEtherscanProvider = () => {
    setEtherscanProvider(new ethers.providers.EtherscanProvider());
  };

  useMountEffect(() => updateEtherscanProvider());

  const getTransactions = async () => {
    const history = await etherscanProvider.getHistory(
      address,
      startBlock,
      "latest"
    );

    console.log(receivingAddresses.replace(/\s/g, "").split(","));

    const filteredTxs = history.filter((tx: FixedTransactionResponse) =>
      receivingAddresses
        .replace(/\s/g, "")
        .split(",")
        .some(add => add.toLowerCase() === tx.to.toLowerCase())
    );

    const txs = filteredTxs.map((tx: FixedTransactionResponse) => {
      return { to: tx.to, creates: tx.creates, hash: tx.hash, data: tx.data };
    });

    setTransactions(filteredTxs);
    console.log(filteredTxs);
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    getTransactions();
  };

  return (
    <Fragment>
      <form
        className="col address m px-1"
        style={{ display: "inline-flex" }}
        onSubmit={onSubmit}
      >
        <div className="px">Address:</div>
        <input
          type="text"
          value={address}
          onChange={e => setAddress(e.target.value)}
        />
        <div className="px">Spending Addresses:</div>
        <input
          type="text"
          value={receivingAddresses}
          onChange={e => setReceivingAddresses(e.target.value)}
        />
        <div className="px">Starting Block:</div>
        <input
          type="text"
          value={startBlock}
          onChange={e => setStartBlock(e.target.value)}
        />
        <div className="center text-center no-wrap">
          <button className="btn m" type="submit">
            Lookup
          </button>
          <button className="btn m" onClick={() => resetType()}>
            Reset Parser
          </button>
        </div>
      </form>
      <div
        className="my-2 px-1"
        style={{
          display: "grid",
          gridTemplateColumns: "0.5fr 0.5fr 7fr 5fr",
          gap: "1rem",
          textAlign: "left"
        }}
      >
        {transactions.map((tx, index: number) => (
          <Fragment key={index}>
            <div>{zeroPad(index, 3)}</div>
            <div>{` - `}</div>
            <div>
              {"Tx Hash: "}
              <a href={`https://etherscan.io/tx/${tx.hash}`}>{`${tx.hash.slice(
                0,
                7
              )}...${tx.hash.slice(-6)}`}</a>
            </div>
            <div>
              {`Value: ${utils.formatUnits(tx.value, "ether").substr(0, 8)}`}
            </div>
          </Fragment>
        ))}
      </div>
    </Fragment>
  );
};

export default ParserTxLookup;
