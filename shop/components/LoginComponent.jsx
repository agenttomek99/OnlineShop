import React, { Component } from "react";
import AuthenticationService from "../Authentication/AuthenticationService";
//import React, {useState} from 'react';
import AsyncStorage from "@react-native-community/async-storage";
import { Text, StyleSheet, View, TextInput, Button } from "react-native";
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

class LoginComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: "",
      password: "",
      hasLoginFailed: false,
      showSuccessMessage: false,
    };

    this.loginClicked = this.loginClicked.bind(this);
    this.cancel = this.cancel.bind(this);
  }
  cancel() {
    this.props.history.push("/products");
  }

  async loginClicked() {
    await AuthenticationService.executeBasicAuthenticationService(
      this.state.username,
      this.state.password
    )
      .then(() => {
        AuthenticationService.registerSuccessfulLogin(
          this.state.username,
          this.state.password
        );
        this.props.history.push("/products");
      })
      .catch(() => {
        this.setState({ showSuccessMessage: false });
        this.setState({ hasLoginFailed: true });
        alert("Wrong credentials");
      });
  }

  render() {
    return (
      <View style={styles.header}>
        <Text style={styles.header}>
          {"\n"}Good to see you back!{"\n"}
        </Text>
        <View style={{ alignItems: "center" }}>
          <TextInput
            placeholder="Username"
            onChangeText={(text) => this.setState({ username: text })}
          />
          <TextInput
            secureTextEntry={true}
            placeholder="Password"
            onChangeText={(text) => this.setState({ password: text })}
          />
          <Text>
            <Button
              onPress={() => this.loginClicked()}
              title="Login"
              color="#7FFF00"
            />
            <Button
              onPress={() => AuthenticationService.logout()}
              title="Logout"
              color="#DC143C"
            />
            <Button
              onPress={() => this.props.history.push("/register")}
              title="Register"
              color="#1E90FF"
            />
          </Text>
        </View>
      </View>
    );
  }
}

export default LoginComponent;
