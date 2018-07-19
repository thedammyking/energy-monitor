import React, { Component } from "react";
import { View, Picker, AsyncStorage } from "react-native";
import moment from "moment";
import { Container, Content, Text, Row, Col, Grid } from "native-base";
import AppHeader from "./Header";
import axios from "axios";
import Menu from "./Menu";
import { host } from "../../config";

const monthsOfTheYear = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December"
];

export default class History extends Component {
  state = {
    showMenu: false,
    history: true,
    months: [],
    weeks: [],
    selectedMonth: "",
    selectedWeek: "",
    weekOfTheMonth: "",
    weeksToFind: "",
    usage: "",
    cost: "",
    key: "",
    mountHistory: true
  };

  async componentWillMount() {
    // await AsyncStorage.getItem("user", (err, result) => {
    //   result = JSON.parse(result);
    //   this.setState({
    //     key: result.device_id
    //   });
    // });
    await this.setState({
      key: '123456789key'
    });
    await this.initMonths();
  }

  getAllUsage = obj => {
    let { mini, maxi } = obj;
    if (!this.state.selectedMonth) return null;
    axios({
      method: "post",
      url: `${host}/api/data/get`,
      data: {
        key: this.state.key,
        time: mini
      },
      config: { headers: { "Content-Type": "appication/json" } }
    })
      .then(res => {
        if (res.status === 200) return res.data;
        return null;
      })
      .then(res => {
        res = res.filter(item => item.start >= mini && item.end <= maxi);
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
          usage: totalEnergy.toFixed(2),
          cost: totalCost.toFixed(1)
        });
      })
      .catch(e => {
        console.log(e);
      });
  };

  calculateMonthTime = month => {
    //TODO: calculate time for the whole month and get the start and end time
    let thisYear = moment().year();
    let numberofDays = 32 - new Date(thisYear, month, 32).getDate();
    let realMonth = month + 1;
    let theDate = `${thisYear.toString()}${
      realMonth.toString().length === 2 ? "" : "0"
    }${realMonth.toString()}01`;
    let mini = moment(theDate).valueOf();
    let maxi = mini + numberofDays * 24 * 60 * 60 * 1000;
    return { mini, maxi };
  };

  calculateWeekTime = () => {
    //TODO: calculate the time for the whole week and get the start and end time
    let thisYear = moment().year();
    let theDate = `${thisYear.toString()}W${
      this.state.weeksToFind.toString().length === 2 ? "" : "0"
    }${this.state.weeksToFind.toString()}`;
    let mini = moment(theDate).valueOf();
    let maxi = mini + 7 * 24 * 60 * 60 * 1000;

    return { mini, maxi };
  };

  toggleMenu = () => {
    if (this.state.showMenu) {
      this.setState({ showMenu: false });
    } else {
      this.setState({ showMenu: true });
    }
  };

  initMonths = () => {
    let time = moment("2018", "YYYY").valueOf();
    axios({
      method: "post",
      url: `${host}/api/data/get`,
      data: {
        key: this.state.key,
        time: time
      },
      config: { headers: { "Content-Type": "appication/json" } }
    })
      .then(res => {
        if (res.status === 200) return res.data;
        return null;
      })
      .then(data => {
        let startTimeStamp = data[0].start;
        let startMonthIndex = moment(startTimeStamp).month();
        let lastDataIndex = data.length - 1;
        let endTimeStamp = data[lastDataIndex].end;
        let endMonthIndex = moment(endTimeStamp).month();
        let months = [];
        for (let i = startMonthIndex; i <= endMonthIndex; i++) {
          months.push(i);
        }
        this.setState({
          months
        });
      })
      .catch(e => console.log(e));
  };

  changeMonth = month => {
    let thisYear = moment().year();
    let realMonth = month + 1;
    let theDate = `${thisYear.toString()}${
      realMonth.toString().length === 2 ? "" : "0"
    }${realMonth.toString()}01`;
    this.setState(
      {
        selectedMonth: month,
        weekOfTheMonth: moment(theDate).week(),
        selectedWeek: null
      },
      () => {
        let calcResult = this.calculateMonthTime(month);
        this.getAllUsage(calcResult);
        const year = moment().year();
        let numberOfWeeks =
          Math.floor((32 - new Date(year, month, 32).getDate() - 1) / 7) + 1;
        let weeks = [];
        for (let i = 0; i < numberOfWeeks; i++) {
          weeks.push(i);
        }
        this.setState({
          weeks
        });
      }
    );
  };

  changeWeek = week => {
    let theWeek = week || 0;
    let weeksToFind = this.state.weekOfTheMonth + theWeek;
    this.setState(
      {
        selectedWeek: week !== null ? theWeek : null,
        weeksToFind
      },
      () => {
        let calcResult =
          week !== null
            ? this.calculateWeekTime()
            : this.calculateMonthTime(this.state.selectedMonth);
        this.getAllUsage(calcResult);
      }
    );
  };

  render() {
    return this.state.mountHistory ? (
      <Container>
        <AppHeader
          menuState={this.state.showMenu}
          toggleMenu={this.toggleMenu}
        />
        <View style={{ flex: 1, flexWrap: "wrap" }}>
          {this.state.showMenu ? (
            <Menu history={this.state.history} toggleMenu={this.toggleMenu} />
          ) : null}
          <View style={{ margin: "10%", width: "80%", minHeight: "71%" }}>
            <Grid>
              <Row size={0.5}>
                <Col>
                  <Picker
                    selectedValue={this.state.selectedMonth}
                    onValueChange={value => this.changeMonth(value)}
                  >
                    <Picker.Item label="Month" value={null} />
                    {this.state.months.map((month, index) => {
                      return (
                        <Picker.Item
                          key={index}
                          label={monthsOfTheYear[month]}
                          value={month}
                        />
                      );
                    })}
                  </Picker>
                </Col>
                <Col>
                  <Picker
                    selectedValue={this.state.selectedWeek}
                    onValueChange={value => this.changeWeek(value)}
                  >
                    <Picker.Item label="Week" value={null} />
                    {this.state.weeks.map((week, index) => {
                      return (
                        <Picker.Item
                          key={index}
                          label={`Week ${week + 1}`}
                          value={week}
                        />
                      );
                    })}
                  </Picker>
                </Col>
              </Row>
              <Row style={{ marginBottom: "5%" }} size={1.5}>
                <Col style={{ height: "100%", backgroundColor: "#7400BC" }}>
                  <Row size={1.2} style={{ paddingTop: 10, paddingLeft: 10 }}>
                    <Text style={{ color: "#fff", fontSize: 22 }}>Usage:</Text>
                  </Row>
                  <Row size={2.8}>
                    <Col
                      size={2.5}
                      style={{
                        justifyContent: "flex-start",
                        alignItems: "flex-end"
                      }}
                    >
                      <Text style={{ color: "#fff", fontSize: 70 }}>
                        {this.state.usage
                          ? isNaN(this.state.usage) ? 0 : this.state.usage
                          : 0}
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
              <Row style={{ marginBottom: "5%" }} size={1.5}>
                <Col style={{ height: "100%", backgroundColor: "#7400BC" }}>
                  <Row size={1.2} style={{ paddingTop: 10, paddingLeft: 10 }}>
                    <Text style={{ color: "#fff", fontSize: 22 }}>Cost :</Text>
                  </Row>
                  <Row size={2.8}>
                    <Col
                      size={2.5}
                      style={{
                        justifyContent: "flex-start",
                        alignItems: "flex-end"
                      }}
                    >
                      <Text style={{ color: "#fff", fontSize: 70 }}>
                        {this.state.cost
                          ? isNaN(this.state.cost) ? 0 : this.state.cost
                          : 0}
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
