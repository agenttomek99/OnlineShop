import React, { Component } from "react";
import { TouchableOpacity, Text, TouchableHighlightBase } from "react-native";
import ProductsService from "../services/ProductsService";
import { Router, Route, Link } from "react-router";
import { View, Image, StyleSheet, Button } from "react-native";
import AsyncStorage from "@react-native-community/async-storage";


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

class ListProductsComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      chosenItems: [], // tutaj sa wybrane przez uzytkownika
      items: [], // tutaj sa wszystkie dostepne w sklepie przedmioty
    };
  }

  componentDidMount() {
    ProductsService.getProducts().then((res) => {
      console.log(res.data);
      this.setState({ items: res.data });
    });
  }
  handleCallback = (childData) => {
    this.setState({ chosenItems: childData });
  };
  componentDidUpdate() {
    this.removeItemValue("basket");
    this.addItemValue("basket", JSON.stringify(this.state.chosenItems));
  }
  buyProduct(item) {
    let item_copy = {}; 
    for (let key in item) {
      item_copy[key] = item[key];
    }
    item_copy.quantity = 1; 
    var found = false; 
    for (var i = 0; i < this.state.chosenItems.length; i++) {
  
      if (item_copy.id === this.state.chosenItems[i].id) {
        this.state.chosenItems[i].quantity++;
        this.setState({
          chosenItems: [...this.state.chosenItems],
        }); 
        found = true;
      }
    }
    if (this.state.chosenItems.length == 0 || found == false) {
      this.setState({
        chosenItems: [...this.state.chosenItems, item_copy], 
      });
    }
  }

  onPress = () => {
    this.props.navigation.navigate("/basket", {
      chosenItems: this.state.chosenItems,
    });
  };
  async removeItemValue(key) {
    try {
      await AsyncStorage.removeItem(key);
      return true;
    } catch (exception) {
      return false;
    }
  }

  async addItemValue(key, value) {
    try {
      await AsyncStorage.setItem(key, value);
      return true;
    } catch (exception) {
      return false;
    }
  }

  render() {
    return (
      <View>
        <View style={styles.header}>
          <Text style={styles.header}>{"\n"}Make yourself at home!</Text>
        </View>
        {this.state.items.map((item) => {
          return (
            <View style={styles.button}>
              <Text key={item.id}>
                {item.name}, {item.price}Zł, only {item.quantity} left
                <Image style={styles.stretch} source={{ uri: item.url }} />
                <Button
                  onPress={() => this.buyProduct(item)}
                  title="Add to Basket"
                  color="#841584"
                />
              </Text>
            </View>
          );
        })}
      </View>
    );
  }
}

export default ListProductsComponent;
