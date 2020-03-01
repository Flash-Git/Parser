import React, { FC, useState, FormEvent, Fragment } from "react";
import { resetType, FixedTransactionResponse } from "parsers";
import { utils } from "ethers";
import { TransactionResponse, EtherscanProvider } from "ethers/providers";
import { zeroPad, isAddress, isENS } from "utils/misc";
import { AddAlert } from "context";

interface Props {
  resetType: resetType;
  etherscanProvider: EtherscanProvider;
  addAlert: AddAlert;
}

const ParserTxLookup: FC<Props> = ({
  resetType,
  etherscanProvider,
  addAlert
}) => {
  /*
   * Input
   */

  const [addresses, setAddresses] = useState("");
  const [receivingAddresses, setReceivingAddresses] = useState("");
  const [startBlock, setStartBlock] = useState("4000000"); // TODO accept date

  /*
   * State
   */

  const [transactions, setTransactions] = useState<FixedTransactionResponse[]>(
    []
  );

  /*
   * Methods
   */

  const splitAddresses = (addresses: string) => {
    return addresses.replace(/\s/g, "").split(",");
  };

  const getTransactions = async () => {
    const histories: Promise<TransactionResponse[]>[] = [];

    setTransactions([]);

    splitAddresses(addresses).map(address =>
      histories.push(
        etherscanProvider.getHistory(address, startBlock, "latest")
      )
    );

    // histories.sort(history) TODO
    await histories.map(async history => {
      const filteredTxs = await (
        await history
      ).filter((tx: FixedTransactionResponse) =>
        splitAddresses(receivingAddresses).some(
          add => add.toLowerCase() === tx.to?.toLowerCase()
        )
      );

      setTransactions(txs => [...txs, ...filteredTxs]);
    });
  };

  const validateInput = async () => {
    const validateAddress = async (address: string) => {
      if (isAddress(address)) return true;
      if (await isENS(etherscanProvider, address)) return true;
      return false;
    };

    const validAddresses = await Promise.all(
      splitAddresses(addresses)
        .map(async address => {
          if (await validateAddress(address)) return address;
          addAlert(`Failed to validate ${address}`, "danger");
          return null;
        })
        .filter(address => {
          if (address !== null) return true;
        })
    );

    return validAddresses.length === addresses.length;
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateInput()) return;
    getTransactions();
  };

  return (
    <Fragment>
      <form className="flex col m px-1 center grow" onSubmit={onSubmit}>
        <div className="px">Your Addresses:</div>

        <textarea
          rows={4}
          value={addresses}
          onChange={e => setAddresses(e.target.value)}
          style={{ resize: "vertical", fontSize: "0.85rem", maxWidth: "27em" }}
        />

        <div className="px">Receiving Addresses:</div>
        <textarea
          rows={4}
          value={receivingAddresses}
          onChange={e => setReceivingAddresses(e.target.value)}
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
            <div>{new Date(tx.timestamp * 1000).toDateString()}</div>
          </Fragment>
        ))}
      </div>
    </Fragment>
  );
};

export default ParserTxLookup;

// <input
// type="text"
// value={addresses}
// className="address text-center"
// onChange={e => setAddresses(e.target.value)}
// />
