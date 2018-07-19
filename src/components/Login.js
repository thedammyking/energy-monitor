import React, { Component } from "react";
import {
  Modal,
  Text,
  TouchableHighlight,
  View,
  TouchableOpacity,
  StyleSheet,
  Image,
  TextInput,
  AsyncStorage
} from "react-native";
import { Actions } from "react-native-router-flux";
import { Grid, Col, Row } from "react-native-easy-grid";
import {
  Toast,
  Container,
  Content,
  Thumbnail,
  Button,
  Icon
} from "native-base";
import axios from "axios";
import { host } from "../../config";

export default class Login extends Component {
  state = {
    username: "",
    password: ""
  };

  async componentWillMount() {
    // await AsyncStorage.getItem("user", (err, result) => {
    //   if (result) {
    //     result = JSON.parse(result);
    //     axios
    //       .post(`${host}/api/user/get`, { username: result.username })
    //       .then(res => {
    //         const { key } = res.data;
    //         if (key === result.device_id) {
    //           Actions.home();
    //         }
    //       });
    //   } else {
    //     return null;
    //   }
    // }).catch(e => console.log(e));
  }

  handle_login = () => {
    if (!this.state.username || !this.state.password) {
      Toast.show({
        text: "Enter Username or Password to Login",
        position: "top",
        buttonText: "OK",
        duration: 5000,
        type: "warning"
      });

      return null;
    }
    axios
      .post(`${host}/api/user/get`, { username: this.state.username })
      .then(resp => {
        const { password, key } = resp.data;
        if (password === this.state.password) {
          // let user = { device_id: key, username: this.state.username },
          //   userDetails = JSON.stringify(user);
          // AsyncStorage.setItem("user", userDetails);
          return Actions.home({
            device_id: key
          });
        } else {
          return Toast.show({
            text: "Incorrect Username or Password",
            position: "top",
            buttonText: "OK",
            duration: 5000,
            type: "warning"
          });
        }
      })
      .catch(e => console.log(e));
  };

  render() {
    return (
      <Container style={[styles.container]}>
        <Content>
          <Grid>
            <Row>
              <Col
                style={{
                  height: 250,
                  justifyContent: "center",
                  alignItems: "center"
                }}
              >
                <Text
                  style={{ color: "white", fontSize: 45, fontWeight: "400" }}
                >
                  Energy Monitor
                </Text>
              </Col>
            </Row>
            <Row>
              <Col>
                <TextInput
                  style={styles.input}
                  returnKeyType="next"
                  placeholder="Username"
                  onChangeText={text => this.setState({ username: text })}
                  defaultValue={this.props.device_id || ""}
                  autoCapitalize="none"
                  autoCorrect={false}
                  underlineColorAndroid="transparent"
                />
              </Col>
            </Row>
            <Row>
              <Col>
                <TextInput
                  style={styles.input}
                  placeholder="Password"
                  secureTextEntry
                  returnKeyType="go"
                  underlineColorAndroid="transparent"
                  onChangeText={text => this.setState({ password: text })}
                  autoCorrect={false}
                  autoCapitalize="none"
                />
              </Col>
            </Row>
            <Row style={{ marginLeft: 20, marginRight: 20, paddingTop: 10 }}>
              <Col>
                <Button
                  block
                  onPress={() => this.handle_login()}
                  style={{ backgroundColor: "#240039", borderRadius: 2 }}
                >
                  <Text style={{ color: "#fff", fontSize: 15 }}>Login</Text>
                </Button>
              </Col>
            </Row>
            <Row>
              <Col
                style={{
                  height: 60,
                  justifyContent: "center",
                  alignItems: "flex-start"
                }}
              >
                <Button transparent block onPress={() => Actions.signup()}>
                  <Text style={{ color: "white" }}>Register your device</Text>
                </Button>
              </Col>
            </Row>
          </Grid>
        </Content>
      </Container>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: "#7400BC"
  },
  input: {
    height: 40,
    backgroundColor: "rgba(255,255,255,0.9)",
    paddingHorizontal: 20,
    marginBottom: 20,
    marginLeft: 20,
    marginRight: 20,
    color: "#7400BC",
    borderRadius: 2
  }
});
