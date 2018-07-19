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

export default class Login extends Component {
  state = {
    email: "",
  };

  componentDidMount() {}

  handle_password_reset = () => {
    if (!this.state.email) {
      Toast.show({
        text: "Enter Valid Email to Reset Password",
        position: "top",
        buttonText: "OK",
        duration: 5000,
        type: "warning"
      });

      return null;
    }
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
            <Row style={{ marginLeft: 20, marginRight: 20, paddingTop: 10 }}>
              <Col>
                <Button
                  block
                  onPress={() => this.handle_password_reset()}
                  style={{ backgroundColor: "#240039", borderRadius: 2 }}
                >
                  <Text style={{ color: "#fff", fontSize: 15 }}>Reset Password</Text>
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
  },
});
