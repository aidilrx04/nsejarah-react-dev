import {
  BrowserRouter as Router
} from 'react-router-dom';
import Navbar from './components/js/Navbar';
import Content from './components/js/Content';
import './components/css/Footer.css';
import { UserContextProvider } from './components/js/contexts/UserContext';




/* function rand()
{
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let r = '';
  for( let i = 0; i < 10; i++ )
  {
    let n = Math.floor(Math.random() * chars.length);
    let c = chars[n];
    r += c;
  }
  return r;
} */



function App()
{
  return (
    <>
    <Router>
      <UserContextProvider>
        <Navbar/>
        <Content/>
      </UserContextProvider>
      <Footer/>
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