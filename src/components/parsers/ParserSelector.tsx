import React, { FC } from "react";
import { setType } from "parsers";
import { PARSER_TYPES } from "components/layout/Parser";

interface Props {
  setType: setType;
}

const ParserSelector: FC<Props> = ({ setType }) => {
  return (
    <div>
      <button className="btn" onClick={() => setType(PARSER_TYPES.txLookup)}>
        Tx Lookup
      </button>
      <button className="btn">Two</button>
      <button className="btn">Three</button>
    </div>
  );
};

export default ParserSelector;
