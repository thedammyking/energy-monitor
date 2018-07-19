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

export default class SignUp extends Component {
  state = {
    device_id: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  };


  componentDidMount() {}

  handle_signup = () => {
    if (!this.state.email || !this.state.device_id || !this.state.username || !this.state.password) {
      Toast.show({
        text: "Enter Device ID, Username, Email or Password to Register",
        position: "top",
        buttonText: "OK",
        duration: 5000,
        type: "warning"
      });

      return null;
    }
    else if ( this.state.password !== this.state.confirmPassword) {
      Toast.show({
        text: "Passwords not match, please try again",
        position: "top",
        buttonText: "OK",
        duration: 5000,
        type: "warning"
      });

      return null;
    }
    axios.post(`${host}/api/user/add`, { 
      username: this.state.username,
      password: this.state.password,
      email: this.state.email,
      key: this.state.device_id
    })
    .then(resp => {
      if (resp.data.status === 1) {
        return Actions.login();
      }
      else {
        Toast.show({
          text: "The user already exist, Login with the username",
          position: "top",
          buttonText: "OK",
          duration: 5000,
          type: "warning"
        });
      }
    });
    
  };

  render() {
    return (
      <Container style={[styles.container]}>
        <Content>
          <Grid>
            <Row>
              <Col
                style={{
                  height: 220,
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
                  placeholder="Device ID"
                  onChangeText={text => this.setState({ device_id: text })}
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
                  returnKeyType="next"
                  placeholder="Username"
                  onChangeText={text => this.setState({ username: text })}
                  defaultValue={this.props.username || ""}
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
                  returnKeyType="next"
                  placeholder="Email"
                  onChangeText={text => this.setState({ email: text })}
                  keyboardType="email-address"
                  defaultValue={this.props.email || ""}
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
            <Row>
              <Col>
                <TextInput
                  style={styles.input}
                  placeholder="Confirm Password"
                  secureTextEntry
                  returnKeyType="go"
                  underlineColorAndroid="transparent"
                  onChangeText={text => this.setState({ confirmPassword: text })}
                  autoCorrect={false}
                  autoCapitalize="none"
                />
              </Col>
            </Row>
            <Row style={{ marginLeft: 20, marginRight: 20, paddingTop: 10 }}>
              <Col>
                <Button
                  block
                  onPress={() => this.handle_signup()}
                  style={{ backgroundColor: "#240039", borderRadius: 2 }}
                >
                  <Text style={{ color: "#fff", fontSize: 15 }}>Register</Text>
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
                <Button
                  transparent
                  block
                  onPress={() => Actions.login()}
                >
                  <Text style={{ color: "white" }}>Back to Login</Text>
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
