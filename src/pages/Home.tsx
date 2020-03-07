import React, { FC } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Parser from "components/layout/Parser";

const Home: FC = () => (
  <div
    className="container flex col center p-1"
    style={{ alignItems: "stretch" }}
  >
    <h1>
      <FontAwesomeIcon className="mright" icon={["fab", "ethereum"]} />
      Transaction Parser
    </h1>
    <Parser />
  </div>
);

export default Home;
