import React, { FC } from "react";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const spinner = require("res/spinner.gif");

const Spinner: FC = () => (
  <img
    src={spinner.default}
    alt="Loading..."
    style={{ width: "200px", margin: "auto", display: "block" }}
  />
);

export default Spinner;
