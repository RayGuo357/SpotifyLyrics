import React from "react"
import { BrowserRouter as Router, Route, HashRouter } from 'react-router-dom';
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
    <HashRouter>
      <Route path='/' exact render={Login} />
      <Route path='/currently-playing/*' render={(props) => (
        <>
          <div className="App">
            <header className="App-header">
              <CurrentlyPlaying className="CurrentlyPlaying"/>
            </header>
          </div>
        </>
      )} />
    </HashRouter>
  );
}

export default App;
