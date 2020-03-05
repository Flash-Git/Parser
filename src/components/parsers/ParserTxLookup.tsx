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
import { zeroPad, isAddress, isENS, validateAddress } from "utils/misc";
import { AddAlert } from "context";

interface Props {
  resetType: resetType;
  etherscanProvider: EtherscanProvider;
  addAlert: AddAlert;
}

const addressPlaceHolder = "example.eth, 0x0000000000...";

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
  const [addressesLoading, setAddressesLoading] = useState(false);

  const [receivingAddresses, setReceivingAddresses] = useState("");
  const [receivingAddressesValid, setReceivingAddressesValid] = useState(true);
  const [receivingAddressesErrors, setReceivingAddressesErrors] = useState("");
  const [receivingAddressesLoading, setReceivingAddressesLoading] = useState(
    false
  );

  const [startBlock, setStartBlock] = useState("9000000"); // TODO accept date
  const [startBlockValid, setStartBlockValid] = useState(true);
  const [startBlockError, setStartBlockError] = useState("");
  const [startBlockLoading, setStartBlockLoading] = useState(false);

  /*
   * State
   */

  const [transactions, setTransactions] = useState<FixedTransactionResponse[]>(
    []
  );

  const [submitted, setSubmitted] = useState(false);

  const addressesCount = useRef(0);
  const receivingAddressesCount = useRef(0);
  const startBlockCount = useRef(0);

  /*
   * Methods
   */

  const splitAddresses = (addresses: string) =>
    addresses.replace(/[^a-zA-Z^\d.,;]/g, "").split(/[,;]/g);

  const getTransactions = async () => {
    let histories: TransactionResponse[] = [];
    setTransactions([]);

    await Promise.all(
      splitAddresses(addresses).map(async address => {
        const addressTxs = await etherscanProvider.getHistory(
          address,
          startBlock,
          "latest"
        );
        histories = [...histories, ...addressTxs];
        return address;
      })
    );

    histories.sort((a, b) => a.blockNumber - b.blockNumber);
    histories.splice(100);

    // TODO add options for incoming, outgoing or both

    // If no receiving addresses are given get all transactions
    if (receivingAddresses.length === 0) {
      setTransactions(txs => [...txs, ...histories]);
      return;
    }

    const filteredTxs = await histories.filter((tx: FixedTransactionResponse) =>
      splitAddresses(receivingAddresses).some(
        add => add.toLowerCase() === tx.to?.toLowerCase()
      )
    );

    setTransactions(txs => [...txs, ...filteredTxs]);
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (
      addressesCount.current !== 0 ||
      receivingAddressesCount.current !== 0 ||
      startBlockCount.current !== 0
    ) {
      console.log("Still validating inputs");
      return;
    }

    setSubmitted(true);

    if (!addressesValid || !receivingAddressesValid || !startBlockValid) return;

    getTransactions();
  };

  // TODO check for duplicates
  const validateAddresses = useCallback(
    async (
      addresses: string,
      setErrors: (errors: string) => void,
      optional = false
    ) => {
      setErrors("");

      // Empty input
      if (addresses.length === 0) {
        if (optional) return true;
        setErrors("Required Field");
        return false;
      }

      const splitAdds = splitAddresses(addresses);

      // Empty input after parsing
      if (splitAdds.length === 0) {
        setErrors("Invalid characters");
        return false;
      }

      const hasError = await new Promise(async resolve => {
        await Promise.all(
          splitAdds.map(async address => {
            return new Promise(async resolveInner => {
              if (!(await validateAddress(address, etherscanProvider)))
                resolve(true);
              else resolveInner();
            });
          })
        );
        resolve(false);
      });

      if (hasError) {
        setErrors("Invalid addresses");
        return false;
      }
      return true;
    },
    [etherscanProvider]
  );

  const validateBlock = useCallback(
    (block: string, setErrors: (errors: string) => void, optional = false) => {
      setErrors("");
      if (block.length === 0) {
        if (optional) return true;
        setErrors("Required Field");
        return false;
      }

      if (block.match(/^\d{0,8}$/g)) return true;
      setErrors("Invalid block number");
      return false;
    },
    []
  );

  /*
   * Input Hooks
   */

  useEffect(() => {
    const val = ++addressesCount.current;
    setTimeout(async () => {
      if (addressesCount.current !== val) return;

      addressesCount.current = 0;
      setAddressesLoading(true);
      const isValid = await validateAddresses(addresses, setAddressesErrors);
      setAddressesLoading(false);
      setAddressesValid(isValid);
    }, 700);
  }, [addresses, validateAddresses]);

  useEffect(() => {
    const val = ++receivingAddressesCount.current;
    setTimeout(async () => {
      if (receivingAddressesCount.current !== val) return;

      receivingAddressesCount.current = 0;
      setReceivingAddressesLoading(true);
      const isValid = await validateAddresses(
        receivingAddresses,
        setReceivingAddressesErrors,
        true
      );
      setReceivingAddressesLoading(false);
      setReceivingAddressesValid(isValid);
    }, 700);
  }, [receivingAddresses, validateAddresses]);

  useEffect(() => {
    const val = ++startBlockCount.current;
    setTimeout(async () => {
      if (startBlockCount.current !== val) return;

      startBlockCount.current = 0;
      setStartBlockLoading(true);
      const isValid = validateBlock(startBlock, setStartBlockError);
      setStartBlockValid(isValid);
      setStartBlockLoading(false);
    }, 700);
  }, [startBlock, validateBlock]);

  /*
   * Rendering
   */

  const Error: FC<{ msg: string }> = ({ msg }) => (
    <div className="mbot" style={{ color: "red", marginTop: "-1rem" }}>
      {msg}
    </div>
  );

  const borderStyle = (isValid: boolean, isLoading: boolean) => {
    if (isLoading) {
      return { borderBottom: "1px solid yellow" }; // or dotted red/green
    } else {
      return !isValid ? { borderBottom: "1px solid red" } : {};
    }
  };
  console.log("render");
  return (
    <Fragment>
      <form className="flex col m px-1 center grow" onSubmit={onSubmit}>
        <div className="px">Your Addresses:</div>

        <textarea
          rows={4}
          value={addresses}
          placeholder={addressPlaceHolder}
          onChange={e => setAddresses(e.target.value)}
          style={{
            resize: "vertical",
            fontSize: "0.85rem",
            maxWidth: "27em",
            ...borderStyle(addressesValid, addressesLoading)
          }}
        />
        {submitted && <Error msg={addressesErrors} />}

        <div className="px">Receiving Addresses:</div>
        <textarea
          rows={4}
          value={receivingAddresses}
          placeholder={addressPlaceHolder} // Kyber
          onChange={e => setReceivingAddresses(e.target.value)}
          style={{
            resize: "vertical",
            fontSize: "0.85rem",
            maxWidth: "27em",
            ...borderStyle(receivingAddressesValid, receivingAddressesLoading)
          }}
        />
        {submitted && <Error msg={receivingAddressesErrors} />}

        <div className="px">Starting Block:</div>
        <input
          type="text"
          value={startBlock}
          className="block-num text-center"
          onChange={e => setStartBlock(e.target.value)}
          style={borderStyle(startBlockValid, startBlockLoading)}
        />
        {submitted && <Error msg={startBlockError} />}

        <div className="center text-center">
          <button className="btn m" type="submit">
            Lookup
          </button>
          <button className="btn m" onClick={() => resetType()}>
            Reset
          </button>
        </div>
      </form>
      <div
        className="my-2 px-1"
        style={{
          display: "grid",
          gridTemplateColumns: "0.5fr 0.5fr 9fr 5fr auto",
          gap: "1rem",
          textAlign: "left",
          maxWidth: "40rem",
          alignSelf: "center",
          fontSize: "0.85rem"
        }}
      >
        {transactions.map((tx, index: number) => (
          <Fragment key={index}>
            <div>{zeroPad(index + 1, 3)}</div>
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
