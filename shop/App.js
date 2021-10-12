import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import { Router, Route, Link } from './react-router';
import ListProductsComponent from './components/ListProductsComponent';
import Basket from './components/Basket';
import LoginComponent from './components/LoginComponent';
import Summary from './components/Summary';
import RegisterComponent from './components/RegisterComponent';
import AuthenticationService from './Authentication/AuthenticationService'




const App = () => (
<View>
  <View style={styles.header}><Text style={styles.header}>TUiM</Text></View>
  <Router>
    <View style={styles.container}>
      <View style={styles.nav}>
        <Link to="/login">
          <Text>Login</Text>
        </Link>
        <Link to="/products">
          <Text>Products</Text>
        </Link>
        <Link to="/basket">
          <Text>Basket</Text>
        </Link>
        <Link to="/summary">
          <Text>View your profile</Text>
        </Link>
      </View>

      <Route exact path="/products" component={ListProductsComponent} />
      <Route path="/basket" component={Basket} />
      <Route path="/login" component={LoginComponent} />
      <Route path="/summary" component={Summary} />
      <Route path="/register" component={RegisterComponent} />
    </View>
  </Router>
  </View>
);

const styles = StyleSheet.create({
  container: {
    marginTop: 25,
    padding: 10
  },
  header: {
    alignItems: "center",
    fontFamily: "sans-serif-thin",
  },
  nav:{
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
});

export default App;
