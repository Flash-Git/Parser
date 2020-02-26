import React, { FC, useContext, useState } from "react";
import Web3Connect from "components/layout/Web3Connect";

const Home: FC = () => {
  return (
    <div className="container flex col center">
      <h1>Transaction Parser</h1>
      <Web3Connect />
    </div>
  );
};

export default Home;
