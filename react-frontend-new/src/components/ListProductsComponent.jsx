import React, { Component } from "react";
import ProductsService from "../Services/ProductsService";
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";
import Basket from "../components/Basket";
import AuthenticatedRoute from "../Authentication/AuthenticatedRoute";

class ListProductsComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      chosenItems: [], // tutaj sa wybrane przez uzytkownika
      items: [], // tutaj sa wszystkie dostepne w sklepie przedmioty
      font: "black",
    };
  }

  componentDidMount() {
    var font = localStorage.getItem("layout");
    console.log(font);
    this.setState({ font: font });
    ProductsService.getProducts().then((res) => {
      this.setState({ items: res.data });
    });
  }
  handleCallback = (childData) => {
    this.setState({ chosenItems: childData });
  };


 /*
 funkcja buyProduct() odpowiedzialna za dodanie przedmiotu do koszyka. Jej dzialanie opiera sie na kopii wybranego obiektu i wykorzystaniu quantity,
 ktore wczesniej sluzylo do ewidencjonowania ile sztuk jest dostepnych w sklepie jako liczbe wybranych przedmiotow do zakupu. 
 */ 
  buyProduct(item) { // 
    let item_copy = {};
    for (let key in item) {
      item_copy[key] = item[key]; 
    }
    item_copy.quantity = 1; 
    var found = false; 
    for (var i = 0; i < this.state.chosenItems.length; i++) {
      if (item_copy.id === this.state.chosenItems[i].id) {
        //jeli wybrany obiekt jest juz na liscie
        this.state.chosenItems[i].quantity++;
        this.setState({
          chosenItems: [...this.state.chosenItems],
        }); //zwiekszam quantity i ustawiam flage na true i wychodze z petli
        found = true;
      }
    }
    if (this.state.chosenItems.length == 0 || found == false) {
      //jesli nie znalazlo (bo nie byl dodany wczesniej) lub nic nie ma w tablicy
      this.setState({
        chosenItems: [...this.state.chosenItems, item_copy], //to dodaj do state
      });
    }
  }
  setRedLayout() {
    localStorage.setItem("layout", "red");
  }
  setBlackLayout() {
    localStorage.setItem("layout", "black");
  }

  render() {
    const { items, chosenItems } = this.state;
    return (
      <div style={{ color: this.state.font }}>
        <button
          style={{
            marginTop: "38px",
            marginLeft: "-1px",
            marginBottom: "40px",
          }}
          className="btn btn-outline-info"
        >
          {" "}
          <Link to="/login">Login</Link>
        </button>
        <button
          style={{
            marginTop: "38px",
            marginLeft: "900px",
            marginDown: "20px",
            marginBottom: "40px",
          }}
          className="btn btn-outline-info"
        >
          <Link to="/Summary">View your profile</Link>
        </button>
        <button
          style={{
            marginTop: "38px",
            marginLeft: "-1035px",
            marginDown: "20px",
            marginBottom: "40px",
          }}
          className="btn btn-outline-info"
        >
          <Link to="/register">Register</Link>
        </button>
        <br></br>
        {this.state.font === "black" ? (
          <button onClick={() => this.setRedLayout()} className="btn btn-info">
            Bad eyesight? Change layout!
          </button>
        ) : (
          <button
            onClick={() => this.setBlackLayout()}
            className="btn btn-info"
          >
            Back to black
          </button>
        )}

        <Router>
          <div className="container">
            <ul>
              <button
                style={{
                  marginTop: "-182px",
                  marginLeft: "825px",
                  marginBottom: "40px",
                }}
                className="btn btn-outline-info"
              >
                <Link to="/basket">Basket</Link>
              </button>
            </ul>
            <AuthenticatedRoute
              path="/basket"
              render={(routeProps) => (
                <Basket
                  {...routeProps}
                  chosenItems={this.state.chosenItems}
                  setState={(state) => this.setState({ chosenItems: state })}
                  history={this.props.history}
                />
              )}
            />
          </div>
        </Router>
        <h2 className="text-center">List of products</h2>

        <div className="row">
          <table className="table table-striped table-bordered">
            <thead>
              <tr>
                <th style={{ color: this.state.font }}>Product Name</th>
                <th style={{ color: this.state.font }}>Product Price</th>
                <th style={{ color: this.state.font }}>Avaiable Quantity</th>
                <th style={{ color: this.state.font }}>Image</th>
                <th style={{ color: this.state.font }}>Action</th>
              </tr>
            </thead>

            <tbody>
              {items.map((item) => (
                <tr key={item.id}>
                  <td style={{ color: this.state.font }}>{item.name}</td>
                  <td style={{ color: this.state.font }}>{item.price}</td>
                  <td style={{ color: this.state.font }}>{item.quantity}</td>

                  <td style={{ color: this.state.font }}>
                    <img src={item.url} className="photo" />
                  </td>
                  <td>
                    <button
                      onClick={() => this.buyProduct(item)}
                      className="btn btn-info"
                    >
                      Add to Basket
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

export default ListProductsComponent;
