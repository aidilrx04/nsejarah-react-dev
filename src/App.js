import
{
  BrowserRouter as Router
} from 'react-router-dom';
import Navbar from './components/js/Navbar';
import Content from './components/js/Content';
import { UserContext, UserContextProvider } from './components/js/contexts/UserContext';
import { API, API_URL } from './components/js/utils';
import './components/js/css-import';
import { useContext, useEffect } from 'react';

API.setApiUrL( API_URL );

function App()
{
  return (
    <>
      <Router>
        <UserContextProvider>
          <Verify />
          <Navbar />
          <Content />
        </UserContextProvider>
        <Footer />
      </Router>
    </>
  );
}

function Verify()
{
  const user = useContext( UserContext );
  useEffect( () =>
  {
    if ( user.loggedin && user.token.length > 0 )
    {
      //verify user when they enter the web
      API.verify( user.token );
    }
  }, [ user ] );
  return null;
}

function Footer()
{
  return (
    <div id="footer">
      <h4>&copy; 2021, Aidil BlubBlub.</h4>
      <p>Sebarang kerosakan yang terjadi bukan masalah saya</p>
    </div>
  );
}

export default App;