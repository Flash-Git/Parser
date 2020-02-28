import React, { FC, useState } from "react";
import ParserSelector from "components/parsers/ParserSelector";
import ParserLookup from "components/parsers/ParserLookup";

export enum PARSER_TYPES {
  undefined,
  lookup
}

const Parser: FC = () => {
  const [type, setType] = useState(PARSER_TYPES.undefined);

  const resetType = () => {
    setType(PARSER_TYPES.undefined);
  };

  switch (type) {
    case PARSER_TYPES.undefined:
      return <ParserSelector setType={setType} />;
    case PARSER_TYPES.lookup:
      return <ParserLookup resetType={resetType} />;
    default:
      throw new Error(`Unhandled parser type: ${type}`);
  }

  return <div>Parser</div>;
};

export default Parser;
