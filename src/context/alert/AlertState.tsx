import React, { FC, useReducer } from "react";
import uuid from "uuid";

import AlertContext from "./AlertContext";
import AlertReducer from "./AlertReducer";

import { ADD_ALERT, REMOVE_ALERT, CLEAR_ALERTS } from "../types";

import { Alerts, AddAlert } from "./IAlert";

const AlertState: FC = props => {
  const initialState: Alerts = [];

  const [state, dispatch] = useReducer(AlertReducer, initialState);

  /*
   * Actions
   */

  const addAlert: AddAlert = (msg, type, timeout = 5000) => {
    const id = uuid.v4();
    dispatch({
      type: ADD_ALERT,
      payload: { msg, type, id }
    });

    setTimeout(() => dispatch({ type: REMOVE_ALERT, payload: id }), timeout);
  };

  const removeAlert = (id: string) =>
    dispatch({ type: REMOVE_ALERT, payload: id });

  const clearAlerts = () => dispatch({ type: CLEAR_ALERTS });

  return (
    <AlertContext.Provider
      value={{
        alerts: state,
        addAlert,
        removeAlert,
        clearAlerts
      }}
    >
      {props.children}
    </AlertContext.Provider>
  );
};

export default AlertState;
