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
  const [startBlockValid, setStartBlockValid] = useState(true);
  const [startBlockError, setStartBlockError] = useState("");

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
        setReceivingAddressesErrors,
        true
      );
      setReceivingAddressesValid(isValid);
    }, 700);
  }, [receivingAddresses, validateAddresses]);

  useEffect(() => {
    const val = ++startBlockCount.current;
    setTimeout(async () => {
      if (startBlockCount.current !== val) return;

      startBlockCount.current = 0;
      const isValid = validateBlock(startBlock, setStartBlockError);
      setStartBlockValid(isValid);
    }, 700);
  }, [startBlock, validateBlock]);

  const Error: FC<{ msg: string }> = ({ msg }) => (
    <div className="mbot" style={{ color: "red", marginTop: "-1rem" }}>
      {msg}
    </div>
  );

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
        {submitted && <Error msg={addressesErrors} />}

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
        {submitted && <Error msg={receivingAddressesErrors} />}

        <div className="px">Starting Block:</div>
        <input
          type="text"
          value={startBlock}
          className="block-num text-center"
          onChange={e => setStartBlock(e.target.value)}
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
