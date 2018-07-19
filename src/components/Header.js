import React, { Component } from "react";
import {
  Container,
  Header,
  Title,
  Button,
  Left,
  Right,
  Body,
  Icon
} from "native-base";
export default class AppHeader extends Component {
  render() {
    return (
      <Header style={{ backgroundColor: "#7400BC" }}>
        <Left style={{ left: "7%" }}>
          <Button onPress={() => this.props.toggleMenu()} transparent>
            <Icon
              ios={this.props.menuState ? "ios-close" : "ios-menu"}
              android={this.props.menuState ? "md-close" : "md-menu"}
              style={{ fontSize: 30, color: "#fff" }}
            />
          </Button>
        </Left>
        <Body style={{ justifyContent: "center", marginLeft: "15%" }}>
          <Title>Energy Monitor</Title>
        </Body>
        <Right />
      </Header>
    );
  }
}
