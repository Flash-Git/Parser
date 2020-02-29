import React, { FC, useState } from "react";
import Selector from "components/parsers/ParserSelector";
import TxLookup from "components/parsers/ParserTxLookup";

export enum PARSER_TYPES {
  undefined,
  txLookup
}

const Parser: FC = () => {
  const [type, setType] = useState(PARSER_TYPES.undefined);

  const resetType = () => {
    setType(PARSER_TYPES.undefined);
  };

  switch (type) {
    case PARSER_TYPES.undefined:
      return <Selector setType={setType} />;
    case PARSER_TYPES.txLookup:
      return <TxLookup resetType={resetType} />;
    default:
      throw new Error(`Unhandled parser type: ${type}`);
  }
};

export default Parser;
