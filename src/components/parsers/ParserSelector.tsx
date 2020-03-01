import React, { FC } from "react";
import { setType } from "parsers";
import { PARSER_TYPES } from "components/layout/Parser";

interface Props {
  setType: setType;
}

const ParserSelector: FC<Props> = ({ setType }) => (
  <div style={{ display: "flex row" }}>
    <button className="btn m" onClick={() => setType(PARSER_TYPES.txLookup)}>
      Tx Lookup
    </button>
    <button className="btn m" onClick={() => setType(PARSER_TYPES.eventLookup)}>
      Event Lookup
    </button>
  </div>
);
export default ParserSelector;
