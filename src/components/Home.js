import React, { Component } from "react";
import { View, AsyncStorage } from "react-native";
import { Container, Content, Text, Row, Col, Grid } from "native-base";
import AppHeader from "./Header";
import Menu from "./Menu";
import axios from "axios";
import { host } from "../../config";

export default class Home extends Component {
  state = {
    showMenu: false,
    home: true,
    current_usage: "",
    today_usage: 0,
    cost: 0,
    key: "",
    mountHome: true
  };
  toggleMenu = () => {
    if (this.state.showMenu) {
      this.setState({ showMenu: false });
    } else {
      this.setState({ showMenu: true });
    }
  };

  stopGetting = () => {
    clearInterval(this.getOne);
    clearInterval(this.getAll);
  };

  async componentWillMount() {
    // await AsyncStorage.getItem("user", (err, result) => {
    //   result = JSON.parse(result);
    //   this.setState({
    //     key: result.device_id
    //   });
    // });
    this.setState({
      key: "123456789key"
    });
    await this.getCurrentUsage();
    await this.getAllUsage();
  }

  componentDidMount() {
    this.getOne = setInterval(() => {
      this.getCurrentUsage();
    }, 1000);

    this.getAll = setInterval(() => {
      this.getAllUsage();
    }, 10000);
  }

  getCurrentUsage = () => {
    // console.log(this.statekey)
    axios
      .get(`${host}/api/data/get/${this.state.key}`)
      .then(resp => {
        if (resp.status === 200) return resp.data[0];
        return null;
      })
      .then(respData => {
        const { data, time } = respData;
        if (time !== this.state.time) {
          this.setState({
            current_usage: data,
            usage_time: time
          });
        } else {
          return null;
        }
      })
      .catch(e => {
        console.log(e);
      });
  };

  getAllUsage = () => {
    const lastMidNight = new Date().setHours(0, 0, 0, 0);
    axios({
      method: "post",
      url: `${host}/api/data/get`,
      data: {
        key: this.state.key,
        time: lastMidNight
      },
      config: { headers: { "Content-Type": "appication/json" } }
    })
      .then(res => {
        if (res.status === 200) return res.data;
        return null;
      })
      .then(res => {
        res = res.map(item => {
          let power = item.measuredPower;
          let duration = (item.end - item.start) / (1000 * 60 * 60);
          return { power, duration };
        });
        return res;
      })
      .then(res => {
        let dataLenght = res.length,
          Power = res.map(item => item.power).reduce((a, b) => a + b, 0),
          totalDuration = res
            .map(item => item.duration)
            .reduce((a, b) => a + b, 0), //time in seconds
          totalPower = Power / dataLenght, //Watt, average power
          totalEnergy = totalPower * totalDuration / 1000; // kWh
        let totalCost = totalEnergy * 24.97;
        this.setState({
          today_usage: totalEnergy.toFixed(2),
          cost: totalCost.toFixed(1)
        });
      })
      .catch(e => {
        console.log(e);
      });
  };

  render() {
    return this.state.mountHome ? (
      <Container>
        <AppHeader
          menuState={this.state.showMenu}
          toggleMenu={this.toggleMenu}
        />
        <View style={{ flex: 1, flexWrap: "wrap" }}>
          {this.state.showMenu ? (
            <Menu
              home={this.state.home}
              toggleMenu={this.toggleMenu}
              stopGetting={this.stopGetting}
            />
          ) : null}
          <View style={{ margin: "10%", width: "80%", minHeight: "81%" }}>
            <Grid>
              <Row style={{ marginBottom: "5%" }} size={1}>
                <Col style={{ height: "100%", backgroundColor: "#7400BC" }}>
                  <Row size={0.8} style={{ paddingTop: 10, paddingLeft: 10 }}>
                    <Text style={{ color: "#fff", fontSize: 22 }}>
                      Current Usage :
                    </Text>
                  </Row>
                  <Row size={3.2}>
                    <Col
                      size={2.5}
                      style={{
                        justifyContent: "flex-start",
                        alignItems: "flex-end"
                      }}
                    >
                      <Text style={{ color: "#fff", fontSize: 70 }}>
                        {this.state.current_usage / 1000 || 0.028}
                      </Text>
                    </Col>
                    <Col
                      size={1.5}
                      style={{
                        justifyContent: "center",
                        alignItems: "flex-start"
                      }}
                    >
                      <Text style={{ color: "#fff", fontSize: 27 }}>KW</Text>
                    </Col>
                  </Row>
                </Col>
              </Row>
              <Row style={{ marginBottom: "5%" }} size={1}>
                <Col style={{ height: "100%", backgroundColor: "#7400BC" }}>
                  <Row size={0.8} style={{ paddingTop: 10, paddingLeft: 10 }}>
                    <Text style={{ color: "#fff", fontSize: 22 }}>
                      Usage Today:
                    </Text>
                  </Row>
                  <Row size={3.2}>
                    <Col
                      size={2.5}
                      style={{
                        justifyContent: "flex-start",
                        alignItems: "flex-end"
                      }}
                    >
                      <Text style={{ color: "#fff", fontSize: 70 }}>
                        {this.state.today_usage
                          ? isNaN(this.state.today_usage)
                            ? 0.01
                            : this.state.today_usage
                          : 0.01}
                      </Text>
                    </Col>
                    <Col
                      size={1.5}
                      style={{
                        justifyContent: "center",
                        alignItems: "flex-start"
                      }}
                    >
                      <Text style={{ color: "#fff", fontSize: 27 }}>KWh</Text>
                    </Col>
                  </Row>
                </Col>
              </Row>
              <Row style={{ marginBottom: "5%" }} size={1}>
                <Col style={{ height: "100%", backgroundColor: "#7400BC" }}>
                  <Row size={0.8} style={{ paddingTop: 10, paddingLeft: 10 }}>
                    <Text style={{ color: "#fff", fontSize: 22 }}>Cost :</Text>
                  </Row>
                  <Row size={3.2}>
                    <Col
                      size={2.5}
                      style={{
                        justifyContent: "flex-start",
                        alignItems: "flex-end"
                      }}
                    >
                      <Text style={{ color: "#fff", fontSize: 70 }}>
                        {this.state.cost
                          ? isNaN(this.state.cost) ? 0.1 : this.state.cost
                          : 0.1}
                      </Text>
                    </Col>
                    <Col
                      size={1.5}
                      style={{
                        justifyContent: "center",
                        alignItems: "flex-start"
                      }}
                    >
                      <Text style={{ color: "#fff", fontSize: 27 }}>NGN</Text>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Grid>
          </View>
        </View>
      </Container>
    ) : null;
  }
}
