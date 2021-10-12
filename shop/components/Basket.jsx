import React, { Component } from "react";
import axios from "axios";
import AsyncStorage from "@react-native-community/async-storage";
import { Text, View, Image, StyleSheet, Button, Alert } from "react-native";
import AuthenticationService from "../Authentication/AuthenticationService";

const styles = StyleSheet.create({
  stretch: {
    width: 50,
    height: 50,
  },
  button: {
    alignItems: "center",
  },
  header: {
    alignItems: "center",
    fontSize: 25,
    fontFamily: "sans-serif-thin",
  },
});

class Basket extends React.Component {
  constructor() {
    super();
    this.state = {
      items: [], // tutaj sa wszystkie dostepne w sklepie przedmioty
      isUserLoggedIn: true,
    };
  }
  createBasicAuthToken(username, password) {
    return "Basic " + window.btoa(username + ":" + password);
  }
  async componentDidMount() {
    var isLoggedIn = await AuthenticationService.isUserLoggedIn();
    this.setState({ isUserLoggedIn: isLoggedIn });
    console.log(isLoggedIn);
    AsyncStorage.getItem("basket").then((res) => {
      this.setState({ items: JSON.parse(res) });
    });
  }
  async proceed() {
    //var username = AuthenticationService.getLoggedInUserName();
    axios
      .post(
        "http://192.168.0.23:8080/api/basketfromfront",
        {
          items: this.state.items,
          user: await AuthenticationService.getLoggedInUserName(),
        },
        {
          headers: {
            authorization: await AuthenticationService.getLoggedInToken(),
          },
        }
      )
      .then((response) => {
        AsyncStorage.removeItem("basket");
        this.props.history.push("/summary");
      })
      .catch((ResourceNotFoundException) => {
        console.log(this.state.items);
        this.props.history.push("/products");
        alert("The next time you have to be faster, bud!");
        AsyncStorage.removeItem("basket");
      });
  }

  render() {
    if (this.state.items != null)
      return (
        <View>
          <Text style={styles.header}>{"\n"}Hello,</Text>
          <Text key={this.state.items.id}>
            {this.state.items.map((item) => (
              <Text key={item.id}>
                {item.name}, {item.price}PLN, quantity: {item.quantity}
                <Image style={styles.stretch} source={{ uri: item.url }} />
                {"\n"}
              </Text>
            ))}
          </Text>
          <Text>
            {this.state.isUserLoggedIn === true ? (
              this.state.items.length > 0 ? (
                <Button
                  onPress={() => this.proceed()}
                  title="Buy"
                  color="#841584"
                />
              ) : (
                <Text style={styles.header}>Such empty here buddy</Text>
              )
            ) : (
              Alert.alert(
                "You are not logged in",
                "You have to sign in before creating order",
                [
                  {
                    text: "Register",
                    onPress: () => this.props.history.push("/register"),
                    style: "cancel",
                  },
                  {
                    text: "Login",
                    onPress: () => this.props.history.push("/login"),
                  },
                ]
              )
            )}
          </Text>
        </View>
      );
    else
      return (
        <View style={styles.header}>
          <Text style={styles.header}>Such empty here buddy</Text>
        </View>
      );
  }
}
export default Basket;
