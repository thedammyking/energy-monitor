import React, { Component } from "react";
import Route from "../routes";
import { Root } from "native-base";

export default class App extends Component {
  render() {
    return (
      <Root>
        <Route />
      </Root>
    );
  }
}
