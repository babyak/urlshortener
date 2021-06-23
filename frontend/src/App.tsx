import { Switch, Route, BrowserRouter } from 'react-router-dom'
import LandingPage from './LandingPage'
import AdminPage from './AdminPage'

function App() {
  return (
    <div className="wrapper">
      <BrowserRouter>
        <Switch>
          <Route exact path="/">
            <LandingPage />
          </Route>
          <Route exact path="/admin">
            <AdminPage />
          </Route>
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App