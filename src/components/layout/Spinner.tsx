import React, { Fragment } from "react";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const spinner = require("res/spinner.gif");

const Spinner: React.FC = () => (
  <Fragment>
    <img
      src={spinner.default}
      alt="Loading..."
      style={{ width: "200px", margin: "auto", display: "block" }}
    />
  </Fragment>
);

export default Spinner;
