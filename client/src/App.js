import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Login from './screen/Login';
import Home from './screen/Home';

// code is retrieved from the AUTH_URL created 
// if code exists in the URL, then we can move to the Home screen
const code = new URLSearchParams(window.location.search).get('code');

function App() {
  return code ? <Home code={code} /> : <Login />;
}

export default App;