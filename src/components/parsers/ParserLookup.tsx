import React, { FC, useState, FormEvent, useContext } from "react";
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

const ParserLookup: FC<Props> = ({ resetType }) => {
  const web3Context: IWeb3Context = useContext(Web3Context);
  const { etherscanProvider, setEtherscanProvider } = web3Context;

  // Input
  const [address, setAddress] = useState("");
  const [receivingAddresses, setReceivingAddresses] = useState("");
  // const [topics, setTopics] = useState("transfer(address,uint256)");
  const [startBlock, setStartBlock] = useState("9500000");

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

  // const getEvents = async () => {
  //   // const topic = ethers.utils.id("transfer(address,uint256)");
  //   // const topic = ethers.utils.id("Created(bytes32)");

  //   const parsedTopics = topics
  //     .replace(/\s/g, "")
  //     .split(";")
  //     .map(topic => ethers.utils.id(topic));
  //   console.log(topics.replace(/\s/g, "").split(";"));

  //   const filter = {
  //     fromBlock: parseInt(startBlock),
  //     toBlock: "latest",
  //     address,
  //     topics: parsedTopics
  //   };
  //   const logs = await etherscanProvider.getLogs(filter);
  //   setLogs(logs);
  //   console.log(logs);
  // };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    getTransactions();
  };

  return (
    <div>
      <form onSubmit={onSubmit} className="flex col grow">
        <div className="flex col center grow">
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
          {/* <div className="px">Topics:</div>
          <input
            type="text"
            value={topics}
            onChange={e => setTopics(e.target.value)}
          /> */}
          <div className="px">Starting Block:</div>
          <input
            type="text"
            value={startBlock}
            onChange={e => setStartBlock(e.target.value)}
          />
        </div>
        <div className="center text-center">
          <button className="btn mx" type="submit">
            Lookup
          </button>
          <button className="btn mx" onClick={() => resetType()}>
            Reset Parser
          </button>
        </div>
      </form>
      <div className="m-2" style={{ width: "100%" }}>
        {transactions.map((tx, index: number) => (
          <div key={index} className="grid-3">
            {zeroPad(index, 3)}
            {" - Tx Hash: "}
            <a href={`https://etherscan.io/tx/${tx.hash}`}>{`${tx.hash.slice(
              0,
              5
            )}...${tx.hash.slice(-5)}`}</a>
            {`Value: ${utils.formatUnits(tx.value, "ether").substr(0, 8)}`}
          </div>
        ))}
        {/* {logs.map((log, index: number) => (
          <div key={index} style={{ width: "100%" }}></div>
        ))} */}
      </div>
    </div>
  );
};

export default ParserLookup;
