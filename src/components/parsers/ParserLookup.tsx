import React, { FC } from "react";
import { resetType } from "parsers";

interface Props {
  resetType: resetType;
}

const ParserLookup: FC<Props> = ({ resetType }) => {
  return (
    <div>
      <button className="btn" onClick={() => resetType()}>
        Reset Parser
      </button>
    </div>
  );
};

export default ParserLookup;
