import React, { useContext } from 'react';
import
{
    Link
} from 'react-router-dom';
import { UserContext } from './contexts/UserContext';
import { Url } from './utils';

function Navbar()
{
    const user = useContext( UserContext );
    return (
        <nav>
            {/* Main Title */}
            <h1 className="title">
                <Link to={Url( '/' )}>NSejarah</Link>
            </h1>

            {/* Navs */}
            <ul>
                {
                    !user.loggedin &&
                    <>
                        <li>
                            <Link to={Url( "/register" )}>Register</Link>
                        </li>
                        <li>
                            <Link to={Url( "/" )}>Login</Link>
                        </li>
                    </>
                }
                {
                    user.loggedin &&
                    <li>
                        {/* eslint-disable-next-line */}
                        <a href="#asd" onClick={user.logout}>Logout</a>
                    </li>
                }
            </ul>
        </nav >
    );
}

export default Navbar;