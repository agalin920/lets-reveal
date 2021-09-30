import { Flex } from 'rebass/styled-components';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from 'react-router-dom';
import Init from './Pages/Init';
import Create from './Pages/Create';
import {Room} from './Pages/Room';

const App = () => {

  return (
    <Flex
      sx={{
        height: '100vh',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Router>
        <Switch>
          <Route exact path="/">
            <Init />
          </Route>
          <Route path="/create">
            <Create />
          </Route>
          <Route path="/room">
            <Room />
          </Route>
          <Redirect to="/" />
        </Switch>
      </Router>
    </Flex>
  );
}

export default App;
