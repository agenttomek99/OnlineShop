import React, { Component } from "react";
import ListProductsComponent from "./ListProductsComponent";
import axios from "axios";
import AuthenticationService from "../Authentication/AuthenticationService";
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";

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
  async componentDidMount() { // po zamontowaniu komponentu wyswietl wszystkie koszyki uzytkownika
    var basketDistinct = [];
    var basketIds = [];
    var temp;
    const url =
      "http://localhost:8080/api/allUsersCarts/" +
      AuthenticationService.getLoggedInUserName();
    axios
      .get(url, {
        headers: { authorization: AuthenticationService.getLoggedInToken() },
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
/*
ta czesc kodu sluzy do zamiany ilosci wybranych przedmiotow; ze sklepu pobierany jest obiekt, jednak jego quantity to dostepna ilosc w sklepie, 
dlatego zamienana jest ta wartosc z tym z klasy details
*/
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

  pay(id) { //zwraca do backendu dane klienta oraz ustawia token transkacji
    var newBaskets = this.state.baskets;
    var token = 1;
    var state = this.state.state;
    var city = this.state.city;
    var street = this.state.street;
    var zip = this.state.zip;
    var nameAndSurname = this.state.nameAndSurname;
    const url =
      "http://localhost:8080/api/order/payment/" +
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
          alert("You have not specified all the shipping details");
          return;
        } else {
          axios.put(url, {
            headers: {
              authorization: AuthenticationService.getLoggedInToken(),
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
  delete(id) { //usuwanie zamowienia
    const url = "http://localhost:8080/api/deleteorder/" + id;
    axios.get(url, {
      headers: { authorization: AuthenticationService.getLoggedInToken() },
    });
    window.location.reload(false);
  }
  handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value,
    });
  }
  render() {
    const { baskets, details } = this.state;

    return (
      <div>
        <Link to="/">Go back to the store</Link>
        <div
          style={{ marginTop: "10px", marginBottom: "10px" }}
          classNAme="container"
        >
          <div className="row">
            <div
              className="card col-md-6 offset-md-3 offset-md-3"
              style={{ marginLeft: "570px" }}
            >
              <h3 className="text-center">Please specify shipping details</h3>

              <div classname="card-body">
                <label> Name and surname: </label>
                <input
                  placeholder="Name and surname"
                  name="nameAndSurname"
                  className="form-control"
                  value={this.state.nameAndSurname}
                  onChange={this.handleChange}
                />

                <label> State: </label>
                <input
                  placeholder="State"
                  name="state"
                  className="form-control"
                  value={this.state.state}
                  onChange={this.handleChange}
                />

                <label> City: </label>
                <input
                  placeholder="City"
                  name="city"
                  className="form-control"
                  value={this.state.city}
                  onChange={this.handleChange}
                />

                <label> Street: </label>
                <input
                  placeholder="Street"
                  name="street"
                  className="form-control"
                  value={this.state.street}
                  onChange={this.handleChange}
                />

                <label> Zip: </label>
                <input
                  placeholder="Zip"
                  name="zip"
                  className="form-control"
                  value={this.state.zip}
                  onChange={this.handleChange}
                />
              </div>
            </div>
          </div>
          <h3
            style={{
              marginTop: "-390px",
              marginBottom: "330px",
              marginLeft: "10px",
              marginRight: "700px",
            }}
          >
            Maybe it is high time for you to pay for something?
          </h3>
        </div>

        {baskets.map((basket) => {
          if (basket.deleted === false)
            return (
              <div
                style={{
                  marginTop: "-300px",
                  marginBottom: "300px",
                  marginLeft: "10px",
                  marginRight: "100px",
                }}
              >
                {basket.items.map((item) => (
                  <div key={item.id}>
                    <img src={item.url} width="45px" height="45px" />{" "}
                    {item.name} {item.price} quantity: {item.quantity}
                  </div>
                ))}
                {basket.isPaid == 0 ? (
                  <button
                    className="btm btn-success"
                    style={{ marginLeft: "75px" }}
                    onClick={() => this.pay(basket.id)}
                  >
                    Pay
                  </button>
                ) : (
                  "This basket has already been paid!"
                )}
                {basket.deleted == false && basket.isPaid === 0 ? (
                  <button
                    className="btm btn-danger"
                    onClick={() => this.delete(basket.id)}
                  >
                    Delete
                  </button>
                ) : (
                  ""
                )}
                <hr
                  style={{
                    color: "#0066ff",
                    height: 2,
                    marginRight: "700px",
                  }}
                />
              </div>
            );
        })}
      </div>
    );
  }
}
export default Summary;
