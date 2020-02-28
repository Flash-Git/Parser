import React, { FC } from "react";

interface Props {
  resetType: () => void;
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
