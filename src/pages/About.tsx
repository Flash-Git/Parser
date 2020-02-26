import React, { FC } from "react";

interface Props {
  version: string;
}

const About: FC<Props> = ({ version }) => (
  <div className="container">
    <h1>About</h1>
    <h3>React based application for parsing transactions</h3>
    <p>Create from Web3 Template</p>
    <p>{`Version: ${version}`}</p>
  </div>
);

export default About;
