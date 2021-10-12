import React, { Component } from "react";
import ListProductsComponent from "./ListProductsComponent";
import axios from "axios";
import {
  Text,
  View,
  TextInput,
  Image,
  StyleSheet,
  Button,
  Alert,
} from "react-native";
import AuthenticationService from "../Authentication/AuthenticationService";
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";

const styles = StyleSheet.create({
  stretch: {
    width: 20,
    height: 20,
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

class Summary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      baskets: [],
      details: [],
      city: "",
      street: "",
      zip: "",
      state: "",
      nameAndSurname: "",
    };
    this.handleChange = this.handleChange.bind(this);
  }
  async componentDidMount() {
    var basketDistinct = [];
    var basketIds = [];
    var temp;
    const url =
      "http://192.168.0.23:8080/api/getalluserscarts/" +
      (await AuthenticationService.getLoggedInUserName());
    axios
      .get(url, {
        headers: {
          authorization: await AuthenticationService.getLoggedInToken(),
        },
      })
      .then((response) => {
        console.log(response.data);
        this.setState({ details: response.data });
        for (var i = 0; i < response.data.length; i++) {
          temp = response.data[i].basket;

          if (basketIds.indexOf(temp.id) < 0) {
            basketDistinct.push(temp);
            basketIds.push(temp.id);
          }
        }

        for (var i = 0; i < basketDistinct.length; i++) {
          for (var j = 0; j < response.data.length; j++) {
            for (var z = 0; z < basketDistinct[i].items.length; z++) {
              if (
                basketDistinct[i].id == this.state.details[j].basket.id &&
                basketDistinct[i].items[z].id == this.state.details[j].item.id
              )
                basketDistinct[i].items[z].quantity =
                  this.state.details[j].quantity;
            }
          }
        }

        console.log(basketDistinct);
        this.setState({ baskets: basketDistinct });
      });
  }

  createBasicAuthToken(username, password) {
    return "Basic " + window.btoa(username + ":" + password);
  }

  async pay(id) {
    var newBaskets = this.state.baskets;
    var token = 1;
    var state = this.state.state;
    var city = this.state.city;
    var street = this.state.street;
    var zip = this.state.zip;
    var nameAndSurname = this.state.nameAndSurname;
    const url =
      "http://192.168.0.23:8080/api/payfororder/" +
      id +
      "/" +
      token +
      "/" +
      state +
      "/" +
      city +
      "/" +
      street +
      "/" +
      zip +
      "/" +
      nameAndSurname;
    for (var i = 0; i < this.state.baskets.length; i++) {
      if (id === newBaskets[i].id) {
        if (
          city.length === 0 ||
          street.length === 0 ||
          state.length === 0 ||
          zip.length === 0
        ) {
          Alert.alert(
            "Shipment error",
            "You have not specified shipping details"
          );
          return;
        } else {
          axios.put(url, {
            headers: {
              authorization: await AuthenticationService.getLoggedInToken(),
            },
          });
          newBaskets[i].isPaid = 1;
          token = newBaskets[i].isPaid;
        }

        //implementacja tokenu zwrotnego np. z PayU bedzie unikalny integer dla kazdej transkacji
        // teraz 1 znaczy ze zaplacony
      }
    }
    this.setState({ baskets: newBaskets });
    console.log(newBaskets);
  }
  async delete(id) {
    const url = "http://192.168.0.23:8080/api/deleteorder/" + id;
    axios.get(url, {
      headers: {
        authorization: await AuthenticationService.getLoggedInToken(),
      },
    });
  }
  handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value,
    });
  }

  render() {
    return (
      <View style={{ alignItems: "center" }}>
        <Text>
          {"\n"}
          <View>
            <Text style={styles.header}>Specify shipping details</Text>
            <TextInput
              placeholder="Name and surname"
              onChangeText={(text) => this.setState({ nameAndSurname: text })}
            />
            <TextInput
              placeholder="City"
              onChangeText={(text) => this.setState({ city: text })}
            />
            <TextInput
              placeholder="State"
              onChangeText={(text) => this.setState({ state: text })}
            />
            <TextInput
              placeholder="Street"
              onChangeText={(text) => this.setState({ street: text })}
            />
            <TextInput
              placeholder="Zip"
              onChangeText={(text) => this.setState({ zip: text })}
            />
          </View>
        </Text>
        <Text key={this.state.baskets.id}>
          {this.state.baskets.map((basket) => (
            <Text key={basket.id}>
              {basket.deleted === false ? (
                <Text>
                  <Text key={basket.id}>
                    {basket.items.map((item) => (
                      <Text key={item.id}>
                        {"\n"}
                        <Image style={styles.stretch} source={{ uri: item.url }} /> {item.name}, {item.price}, quantity {item.quantity}
                        {"\n"}
                      </Text>
                    ))}
                  </Text>
                </Text>
              ) : (
                <Text></Text>
              )}
              {basket.isPaid === 0 && basket.deleted === false ? (
                <Text>
                  <Button
                    onPress={() => this.pay(basket.id)}
                    title="Pay"
                    color="#841584"
                  />
                  
                </Text>
              ) : (
                <Text>
                  {basket.deleted === true
                    ? ""
                    : "This order has already been paid" + "\n" + "\n"}
                    
                </Text>
                
              )}
              {basket.deleted === false && basket.isPaid === 0 ? (
                <Text>
                  <Button
                    onPress={() => this.delete(basket.id)}
                    title="Delete"
                    color="#841584"
                  />
                </Text>
              ) : (
                <Text></Text>
              )}
            </Text>
          ))}
        </Text>
      </View>
    );
  }
}
export default Summary;
