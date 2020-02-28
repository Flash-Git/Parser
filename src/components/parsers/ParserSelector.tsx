import React, { FC } from "react";
import { PARSER_TYPES } from "components/layout/Parser";

interface Props {
  setType: (type: PARSER_TYPES) => void;
}

const ParserSelector: FC<Props> = ({ setType }) => {
  return (
    <div>
      <button className="btn" onClick={() => setType(PARSER_TYPES.lookup)}>
        One
      </button>
      <button className="btn">Two</button>
      <button className="btn">Three</button>
    </div>
  );
};

export default ParserSelector;
