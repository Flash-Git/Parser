import React, { FC } from "react";

interface Props {
  version: string;
}

const About: FC<Props> = ({ version }) => (
  <div className="container flex col p-1">
    <h1>About</h1>
    <p className="my-1">React based application for parsing transactions.</p>
    <p>Created from the Web3 Template.</p>
    <p className="bg-dark p my-1">
      <strong>Version:&nbsp;</strong>
      {version}
    </p>
  </div>
);

export default About;
