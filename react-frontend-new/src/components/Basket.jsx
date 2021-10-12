import React, { Component } from "react";
import ListProductsComponent from "./ListProductsComponent";
import axios from "axios";
import AuthenticationService from "../Authentication/AuthenticationService";

class Basket extends React.Component {
  createBasicAuthToken(username, password) {
    return "Basic " + window.btoa(username + ":" + password);
  }
  proceed() { // co sie dzieje po zakupie
    axios
      .post(
        "http://localhost:8080/api/basketfromfront",
        {
          items: this.props.chosenItems,
          user: AuthenticationService.getLoggedInUserName(),
        },
        { headers: { authorization: AuthenticationService.getLoggedInToken() } }
      )
      .then((response) => {
        this.props.setState();
        this.props.history.push("/summary");
      })
      .catch((ResourceNotFoundException) => {
        this.props.history.push("/");
        window.location.reload(false);
        alert("You have to be quicker next time!");
      });
  }
  render() {
    const items = this.props.chosenItems;
    return (
      <div>
        <h2>You have added to your Basket: </h2>
        {items ? (
          <div>
            {items.map((item) => (
              <div key={item.id}>
                {item.name}, unit price: {item.price}zł, quantity: {item.quantity}
                , sum: {item.quantity * item.price}zł
              </div>
            ))}
            <button onClick={() => this.proceed()}>Forward!</button>
          </div>
        ) : (
          "Wow! Such empty here buddy"
        )}
      </div>
    );
  }
}
export default Basket;
