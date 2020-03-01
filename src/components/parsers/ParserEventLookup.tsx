import React, { FC, useState, FormEvent, Fragment } from "react";
import { resetType } from "parsers";
import { ethers } from "ethers";
import { EtherscanProvider } from "ethers/providers";
import { zeroPad } from "utils/misc";

interface Props {
  resetType: resetType;
  etherscanProvider: EtherscanProvider;
}

const ParserEventLookup: FC<Props> = ({ resetType, etherscanProvider }) => {
  // Input
  const [address, setAddress] = useState("");
  // const [receivingAddresses, setReceivingAddresses] = useState("");
  const [topics, setTopics] = useState("transfer(address,uint256)");
  const [startBlock, setStartBlock] = useState("9500000"); // TODO accept date

  // Response
  const [logs, setLogs] = useState([]);

  const getEvents = async () => {
    // const topic = ethers.utils.id("transfer(address,uint256)");
    // const topic = ethers.utils.id("Created(bytes32)");

    const parsedTopics = topics
      .replace(/\s/g, "")
      .split(";")
      .map(topic => ethers.utils.id(topic));
    console.log("parsed", topics.replace(/\s/g, "").split(";"));

    const filter = {
      fromBlock: parseInt(startBlock),
      toBlock: "latest",
      address,
      topics: parsedTopics
    };
    const logs = await etherscanProvider.getLogs(filter);
    setLogs(logs);
    console.log("logs", logs);
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    getEvents();
  };

  return (
    <Fragment>
      <form className="flex col m px-1 center grow" onSubmit={onSubmit}>
        <div className="px">Address:</div>
        <input
          type="text"
          value={address}
          className="address text-center"
          onChange={e => setAddress(e.target.value)}
        />

        {/* <div className="px">Spending Addresses:</div>
          <input
            type="text"
            value={receivingAddresses}
            onChange={e => setReceivingAddresses(e.target.value)}
          /> */}

        <div className="px">Topics:</div>
        <textarea
          rows={4}
          value={topics}
          onChange={e => setTopics(e.target.value)}
          style={{ resize: "vertical", fontSize: "0.85rem", maxWidth: "27em" }}
        />

        <div className="px">Starting Block:</div>
        <input
          type="text"
          value={startBlock}
          className="block-num text-center"
          onChange={e => setStartBlock(e.target.value)}
        />

        <div className="center text-center">
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
          gridTemplateColumns: "0.5fr 0.5fr 9fr 5fr 7fr",
          gap: "1rem",
          textAlign: "left",
          maxWidth: "40rem",
          alignSelf: "center",
          fontSize: "0.85rem"
        }}
      >
        {logs.map((log, index: number) => (
          <Fragment key={index}>
            <div>{zeroPad(index, 3)}</div>
            <div>{` - `}</div>
            <div>{log}</div>
            <div>{new Date(log.timestamp * 1000).toDateString()}</div>
          </Fragment>
        ))}
      </div>
    </Fragment>
  );
};

export default ParserEventLookup;
