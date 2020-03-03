import React, {
  FC,
  useState,
  FormEvent,
  Fragment,
  useEffect,
  useRef,
  useCallback
} from "react";
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
  const [addressesValid, setAddressesValid] = useState(false);
  const [addressesErrors, setAddressesErrors] = useState("");

  const [receivingAddresses, setReceivingAddresses] = useState("");
  const [receivingAddressesValid, setReceivingAddressesValid] = useState(false);
  const [receivingAddressesErrors, setReceivingAddressesErrors] = useState("");

  const [startBlock, setStartBlock] = useState("4000000"); // TODO accept date
  const [startBlockValid, setStartBlockValid] = useState(false);
  const [startBlockError, setStartBlockError] = useState("");

  /*
   * State
   */

  const [transactions, setTransactions] = useState<FixedTransactionResponse[]>(
    []
  );

  /*
   * Methods
   */

  const splitAddresses = (addresses: string) =>
    addresses.replace(/[^a-zA-Z^\d.,;]/g, "").split(/[,;]/g);

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

    const checkedAddresses = async (addresses: string) => {
      if (splitAddresses(addresses).length === 0) return [];

      const checkedAdds = await Promise.all(
        splitAddresses(addresses).map(async address => {
          if (address.length === 0) return null;

          if (await validateAddress(address)) return address;
          addAlert(`Failed to validate "${address}"`, "danger");
          return null;
        })
      );
      return checkedAdds.filter(address => address !== null);
    };

    const checkedBlock = (block: string) => {
      if (block.match(/^\d{0,8}$/g)) return true;
      addAlert(`Failed to validate "${block}" as a block number`, "danger");
      return false;
    };

    const validAddresses = await checkedAddresses(addresses);
    const validReceivingAddresses = await checkedAddresses(receivingAddresses);
    const validStartBlock = checkedBlock(startBlock);

    if (validAddresses.length !== splitAddresses(addresses).length) {
      setAddressesErrors("Failed to validate addresses.");
      return false;
    } else setAddressesErrors("");
    if (
      validReceivingAddresses.length !==
      splitAddresses(receivingAddresses).length
    ) {
      setReceivingAddressesErrors("Failed to validate receiving addresses.");

      return false;
    } else setReceivingAddressesErrors("");
    if (!validStartBlock) {
      setStartBlockError("Failed to validate starting block number.");
      return false;
    } else setStartBlockError("");
    return true;
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateInput()) return;
    getTransactions();
  };

  const addressesCount = useRef(0);
  const receivingAddressesCount = useRef(0);
  const startBlockCount = useRef(0);

  // TODO check for duplicates
  const validateAddresses = useCallback(
    async (addresses: string, setErrors: (errors: string) => void) => {
      setErrors("");

      if (addresses.length === 0) {
        setErrors("Required Field");
        //empty input
        return false;
      }

      const splitAdds = splitAddresses(addresses);

      if (splitAdds.length === 0) {
        setErrors("Need valid address or ens name");
        //empty input
        return false;
      }

      const parsedAdds = await Promise.all(
        splitAdds.map(async address => {
          if (address.length === 0) {
            //empty input
            return null;
          }

          const validateAddress = async (address: string) => {
            if (address.length === 0) return false;
            if (isAddress(address)) return true;
            if (await isENS(etherscanProvider, address)) return true;
            return false;
          };

          const isValid = await validateAddress(address);
          if (!isValid) {
            // INVALID
            return null;
          }

          // VALID
          return address;
        })
      );

      if (parsedAdds.some(address => address === null)) {
        setErrors("One or more addresses is invalid");
        // Contains invalid address
        return false;
      }

      return true;
    },
    [etherscanProvider]
  );

  useEffect(() => {
    const val = ++addressesCount.current;
    setTimeout(async () => {
      if (addressesCount.current !== val) return;

      addressesCount.current = 0;
      const isValid = await validateAddresses(addresses, setAddressesErrors);
      setAddressesValid(isValid);
    }, 700);
  }, [addresses, validateAddresses]);

  useEffect(() => {
    const val = ++receivingAddressesCount.current;
    setTimeout(async () => {
      if (receivingAddressesCount.current !== val) return;

      receivingAddressesCount.current = 0;
      const isValid = await validateAddresses(
        receivingAddresses,
        setReceivingAddressesErrors
      );
      setReceivingAddressesValid(isValid);
    }, 700);
  }, [receivingAddresses, validateAddresses]);

  useEffect(() => {
    const val = ++startBlockCount.current;
    setTimeout(async () => {
      if (startBlockCount.current !== val) return;

      // const isValid = await validateAddresses(addresses);
      startBlockCount.current = 0;
      const isValid = true; // TODO
      setStartBlockValid(isValid);
    }, 700);
  }, [startBlock, validateAddresses]);

  const Error: FC<{ msg: string }> = ({ msg }) => {
    return (
      <div className="mbot" style={{ color: "red", marginTop: "-1rem" }}>
        {/* TEMP STYLING */}
        {msg}
      </div>
    );
  };

  return (
    <Fragment>
      <form className="flex col m px-1 center grow" onSubmit={onSubmit}>
        <div className="px">Your Addresses:</div>

        <textarea
          rows={4}
          value={addresses}
          placeholder={"quinn.eth, anotheraddress.eth"}
          onChange={e => setAddresses(e.target.value)}
          style={{ resize: "vertical", fontSize: "0.85rem", maxWidth: "27em" }}
        />
        <Error msg={addressesErrors} />

        <div className="px">Receiving Addresses:</div>
        <textarea
          rows={4}
          value={receivingAddresses}
          placeholder={
            "bitfinex.eth, 0x818e6fecd516ecc3849daf6845e3ec868087b755"
          } // Kyber
          onChange={e => setReceivingAddresses(e.target.value)}
          style={{ resize: "vertical", fontSize: "0.85rem", maxWidth: "27em" }}
        />
        <Error msg={receivingAddressesErrors} />

        <div className="px">Starting Block:</div>
        <input
          type="text"
          value={startBlock}
          className="block-num text-center"
          onChange={e => setStartBlock(e.target.value)}
        />
        <Error msg={startBlockError} />

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
