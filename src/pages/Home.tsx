import React, { FC, useContext, useState } from "react";
import Parser from "components/layout/Parser";

const Home: FC = () => {
  return (
    <div className="container flex col center p-1">
      <h1>Transaction Parser</h1>
      <Parser />
    </div>
  );
};

export default Home;
