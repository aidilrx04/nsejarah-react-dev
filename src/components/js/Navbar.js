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
            <div className="container">
                {/* Main Title */ }
                <h1 className="title">
                    <Link to={ Url( '/' ) }>NSejarah</Link>
                </h1>

                <div className="nav-dropdown">
                    <button className="nav-toggler"><i className="fas fa-bars" /></button>

                    <ul className="nav-dropdown-content">
                        <li>
                            <Link to={ Url( '/' ) }>Laman Utama</Link>
                        </li>
                        <li>
                            <Link to={ Url( '/kuiz' ) }>Cari</Link>
                        </li>
                        {
                            !user.loggedin &&
                            <>
                                <li>
                                    <Link to={ Url( "/register" ) }>Register</Link>
                                </li>
                                <li>
                                    <Link to={ Url( "/login" ) }>Login</Link>
                                </li>
                            </>
                        }
                        {
                            user.loggedin &&
                            <>
                                { console.log( user ) }
                                {
                                    user.data.g_jenis === 'admin'
                                        ? <li className="dropdown">
                                            {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */ }
                                            <a href="#" className="toggler">Admin <i className="fas fa-caret-down" /></a>
                                            <div className="dropdown-content">
                                                <Link to={ Url( '/guru' ) } className="dropdown-content-item">Laman Admin</Link>
                                                <Link to={ Url( '/guru/guru' ) } className="dropdown-content-item">Pengurusan Guru</Link>
                                                <Link to={ Url( '/guru/murid' ) } className="dropdown-content-item">Pengurusan Murid</Link>
                                                <Link to={ Url( '/guru/tingkatan' ) } className="dropdown-content-item">Pengurusan Tingkatan & Kelas</Link>
                                                <Link to={ Url( '/guru/kuiz' ) } className="dropdown-content-item">Pengurusan Kuiz</Link>
                                            </div>
                                        </li>
                                        : ''
                                }
                                {
                                    user.data.g_jenis === 'guru'
                                        ? <li className="dropdown">
                                            {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */ }
                                            <a href="#" className="toggler">Guru <i className="fas fa-caret-down" /></a>
                                            <div className="dropdown-content">
                                                <Link to={ Url( '/guru' ) } className="dropdown-content-item">Laman Admin</Link>
                                                <Link to={ Url( '/guru/kuiz' ) } className="dropdown-content-item">Pengurusan Kuiz</Link>
                                            </div>
                                        </li>
                                        : ''
                                }
                                <li>
                                    {/* eslint-disable-next-line */ }
                                    <a href="#logout" onClick={ user.logout }>Logout</a>
                                </li>
                            </>
                        }
                    </ul>
                </div>
                {/* Navs , possibly dropdown*/ }

            </div>
        </nav >
    );
}

export default Navbar;;