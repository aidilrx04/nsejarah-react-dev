import React, { useContext } from 'react';
import {
    Link
} from 'react-router-dom';
import '../css/Navbar.css';
import { UserContext } from './contexts/UserContext';
import { Url } from './utils';

function Navbar(){
    const {user, userLogout} = useContext( UserContext );
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
                        <a onClick={userLogout}>Logout</a>
                    </li>
                }
            </ul>
        </nav>
    );
}

export default Navbar;