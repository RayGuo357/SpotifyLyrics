import React from "react"
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Login from './components/Login';
import CurrentlyPlaying from "./components/CurrentlyPlaying";
import logo from './logo.svg';
import './App.css';

function App() {
  const [data, setData] = React.useState(null);

  React.useEffect(() => {
    fetch("/api")
      .then((res) => res.json())
      .then((data) => setData(data.message));
  }, []);

  return (
    <Router>
      <Route path='/' exact render={Login} />
      <Route path='/currently-playing/*' render={(props) => (
        <>
          <div className="App">
            <header className="App-header">
              <img src={logo} className="App-logo" alt="logo" />
              <p>{!data ? "Loading..." : data}</p>
              <CurrentlyPlaying />
            </header>
          </div>
        </>
      )} />
    </Router>
  );
}

export default App;
