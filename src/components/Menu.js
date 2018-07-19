import React, { Component } from "react";
import { View, TouchableOpacity, AsyncStorage } from "react-native";
import { Button, Icon, Text, Row, Col, Grid } from "native-base";
import { Actions } from "react-native-router-flux";

export default class Menu extends Component {
  render() {
    return (
      <View
        style={{ width: "57%", height: "100%", backgroundColor: "#7400BC" }}
      >
        <Grid style={{ marginTop: "15%", maxHeight: "22%" }}>
          <Row style={this.props.home ? { backgroundColor: "#240039" } : {}}>
            <TouchableOpacity
              onPress={() => {
                Actions.home();
                this.props.toggleMenu();
              }}
              style={{ width: "100%" }}
            >
              <Row>
                <Col
                  size={1}
                  style={{ justifyContent: "center", alignItems: "center" }}
                >
                  <Icon
                    ios="ios-home"
                    android="md-home"
                    style={
                      this.props.home
                        ? { fontSize: 30, color: "#7400BC" }
                        : { fontSize: 30, color: "#fff" }
                    }
                  />
                </Col>
                <Col
                  size={3}
                  style={{ justifyContent: "center", alignItems: "flex-start" }}
                >
                  <Text
                    style={
                      this.props.home
                        ? { fontSize: 20, color: "#7400BC" }
                        : { fontSize: 20, color: "#fff" }
                    }
                  >
                    {" "}
                    Home{" "}
                  </Text>
                </Col>
              </Row>
            </TouchableOpacity>
          </Row>
          <Row style={this.props.history ? { backgroundColor: "#240039" } : {}}>
            <TouchableOpacity
              onPress={() => {
                Actions.history();
                this.props.toggleMenu();
                this.props.home ? this.props.stopGetting() : null;
              }}
              style={{ width: "100%" }}
            >
              <Row>
                <Col
                  size={1}
                  style={{ justifyContent: "center", alignItems: "center" }}
                >
                  <Icon
                    ios="ios-paper-outline"
                    android="md-paper"
                    style={
                      this.props.history
                        ? { fontSize: 30, color: "#7400BC" }
                        : { fontSize: 30, color: "#fff" }
                    }
                  />
                </Col>
                <Col
                  size={3}
                  style={{ justifyContent: "center", alignItems: "flex-start" }}
                >
                  <Text
                    style={
                      this.props.history
                        ? { fontSize: 20, color: "#7400BC" }
                        : { fontSize: 20, color: "#fff" }
                    }
                  >
                    {" "}
                    History{" "}
                  </Text>
                </Col>
              </Row>
            </TouchableOpacity>
          </Row>

          <Row>
            <TouchableOpacity
              onPress={() => {
                Actions.login();
                this.props.home ? this.props.stopGetting() : null;
                AsyncStorage.setItem("user", "");
              }}
              style={{ width: "100%" }}
            >
              <Row>
                <Col
                  size={1}
                  style={{ justifyContent: "center", alignItems: "center" }}
                >
                  <Icon
                    ios="ios-log-out"
                    android="md-log-out"
                    style={{ fontSize: 30, color: "#fff" }}
                  />
                </Col>
                <Col
                  size={3}
                  style={{ justifyContent: "center", alignItems: "flex-start" }}
                >
                  <Text style={{ fontSize: 20, color: "#fff" }}> Exit </Text>
                </Col>
              </Row>
            </TouchableOpacity>
          </Row>
        </Grid>
      </View>
    );
  }
}
