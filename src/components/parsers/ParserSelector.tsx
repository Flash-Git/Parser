import React, { FC, Fragment } from "react";
import { setType } from "parsers";
import { PARSER_TYPES } from "components/layout/Parser";

interface Props {
  setType: setType;
}

const ParserSelector: FC<Props> = ({ setType }) => (
  <Fragment>
    <button className="btn mx" onClick={() => setType(PARSER_TYPES.txLookup)}>
      Tx Lookup
    </button>
    <button className="btn mx">Two</button>
    <button className="btn mx">Three</button>
  </Fragment>
);
export default ParserSelector;
