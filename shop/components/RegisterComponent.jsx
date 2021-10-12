import React, { Component } from "react";
import axios from "axios";
import {
  Text,
  TextInput,
  View,
  Image,
  StyleSheet,
  Button,
  Alert,
} from "react-native";
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

class RegisterComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: "",
      password: "",
    };
    this.saveUser = this.saveUser.bind(this);
    this.changeUsernameHandler = this.changeUsernameHandler.bind(this);
    this.changePasswordHandler = this.changePasswordHandler.bind(this);
    this.cancel = this.cancel.bind(this);
  }
  componentDidMount() {}
  saveUser() {
    axios.post("http://192.168.0.23:8080/api/adduser", {
      username: this.state.username,
      password: this.state.password,
    });
    this.props.history.push("/login");
    console.log(this.state.password);
  }
  changeUsernameHandler = (event) => {
    this.setState({ username: event.target.value });
  };
  changePasswordHandler = (event) => {
    this.setState({ password: event.target.value });
  };

  cancel() {
    this.props.history.push("/login");
  }

  render() {
    return (
      <View>
        <View style={styles.header}>
          <Text style={styles.header}>
            {"\n"}Nice that you want to join us!{"\n"}
          </Text>
        </View>
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
              onPress={() => this.saveUser()}
              title="Register"
              color="#1E90FF"
            />
          </Text>
        </View>
      </View>
    );
  }
}

export default RegisterComponent;
