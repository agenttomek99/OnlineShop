import React, { Component } from "react";
import AuthenticationService from "../Authentication/AuthenticationService";

class LoginComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: "",
      password: "",
      hasLoginFailed: false,
      showSuccessMessage: false,
      font: "black", //kolor czcionki
    };

    this.handleChange = this.handleChange.bind(this);
    this.loginClicked = this.loginClicked.bind(this);
    this.cancel = this.cancel.bind(this);
  }
  componentDidMount() {
    var font = localStorage.getItem("layout");
    console.log(font);
    this.setState({ font: font });
  }
  cancel() {
    this.props.history.push("/");
  }
  handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value,
    });
  }

  loginClicked() {
    AuthenticationService.executeBasicAuthenticationService(
      this.state.username,
      this.state.password
    )
      .then(() => {
        AuthenticationService.registerSuccessfulLogin(
          this.state.username,
          this.state.password
        );
        this.props.history.push("/");
      })
      .catch(() => {
        this.setState({ showSuccessMessage: false });
        this.setState({ hasLoginFailed: true });
      });
  }

  render() {
    return (
      ///
      <div>
        <div classNAme="container" style={{ color: this.state.font }}>
          <div className="row">
            <div className="card col-md-6 offset-md-3 offset-md-3">
              <h3 className="text-center">Login:</h3>

              <div classname="card-body">
                {this.state.hasLoginFailed && (
                  <div className="alert alert-warning">Wrong credentials</div>
                )}
                {this.state.showSuccessMessage && <div>Login Sucessful</div>}
                <label> Username: </label>
                <input
                  placeholder="Username"
                  name="username"
                  className="form-control"
                  value={this.state.username}
                  onChange={this.handleChange}
                />

                <label> Password: </label>
                <input
                  placeholder="Password"
                  name="password"
                  className="form-control"
                  value={this.state.password}
                  onChange={this.handleChange}
                />

                <button
                  style={{ marginTop: "20px", marginBottom: "10px" }}
                  className="btm btn-success"
                  onClick={this.loginClicked}
                >
                  Login
                </button>
                <button
                  className="btm btn-danger"
                  onClick={this.cancel.bind(this)}
                  style={{ marginLeft: "10px" }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default LoginComponent;
