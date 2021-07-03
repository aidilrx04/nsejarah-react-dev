import
{
  BrowserRouter as Router
} from 'react-router-dom';
import Navbar from './components/js/Navbar';
import Content from './components/js/Content';
import { UserContextProvider } from './components/js/contexts/UserContext';
import { API } from './components/js/utils';
import './components/js/css-import';

API.setApiUrL( '//localhost/nsejarah-react' );

function App()
{
  return (
    <>
      <Router>
        <UserContextProvider>
          <Navbar />
          <Content />
        </UserContextProvider>
        <Footer />
      </Router>
    </>
  );
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