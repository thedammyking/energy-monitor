import React, { Component } from "react";
import { Platform, AsyncStorage } from "react-native";
import { Actions, Router, Scene, Stack } from "react-native-router-flux";
import Login from "./src/components/Login";
import SignUp from "./src/components/SignUp";
import ForgotPassword from "./src/components/ForgotPassword";
import Home from "./src/components/Home";
import History from "./src/components/History";


export default class Route extends Component {
  state = {
    hideNavBar: Platform.select({
      ios: true,
      android: true
    }),
  };

  render() {
    return <Router>
        <Stack key="root">
          <Scene key="login" component={Login} hideNavBar={this.state.hideNavBar} initial={false} />
          <Scene key="signup" component={SignUp} hideNavBar={this.state.hideNavBar} initial={false} />
          <Scene key="forgot_password" component={ForgotPassword} hideNavBar={this.state.hideNavBar} initial={false} />
          <Scene key="home" component={Home} hideNavBar={this.state.hideNavBar} initial={false} />
          <Scene key="history" component={History} hideNavBar={this.state.hideNavBar} initial={false} />
        </Stack>
      </Router>;
  }
}

