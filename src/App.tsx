import React, { FC } from "react";
import { library } from "@fortawesome/fontawesome-svg-core";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { faInfoCircle, faTimesCircle } from "@fortawesome/free-solid-svg-icons";
import { faEthereum } from "@fortawesome/free-brands-svg-icons";
import "./App.css";

import Alerts from "components/layout/Alerts";
import Home from "pages/Home";
import About from "pages/About";
import NotFound from "pages/NotFound";

import AlertState from "context/alert/AlertState";
import Web3State from "context/web3/Web3State";

library.add(faInfoCircle, faTimesCircle, faEthereum);

const version = "0.1.0";

const App: FC = () => (
  <AlertState>
    <Web3State>
      <Router>
        <Alerts />
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/about">
            <About version={version} />
          </Route>
          <Route component={NotFound} />
        </Switch>
      </Router>
    </Web3State>
  </AlertState>
);

export default App;
