import React, { useState, useEffect, useContext, Fragment } from 'react';
import
{
    Switch,
    Route,
    useRouteMatch,
    Link
} from 'react-router-dom';

import { UserContext } from '../contexts/UserContext';

import PrivateRoute from '../PrivateRoute';
import UserBox from '../boxes/UserBox';
import Box from '../boxes/Box';
import Padam from './Padam';
import NoMatchBox from '../boxes/NoMatchBox';

//guru components
import GuruIndex from './GuruIndex';

// route controller
import GuruRouteController from './guru/GuruRouteController';
import MuridRouteController from './murid/MuridRouteController';
import TingkatanRouteController from './tingkatan/TingkatanRouteController';
import KelasRouteController from './kelas/KelasRouteController';
import KuizRouteController from './kuiz/KuizRouteController';

import { Url, useTitle } from '../utils';
import StatisticWeb from '../StatisticWeb';

function GuruPageRouteController()
{
    useTitle( 'Laman Guru' );

    const user = useContext( UserContext );
    let { path } = useRouteMatch();
    let [ guru, setGuru ] = useState( null );

    useEffect( () =>
    {
        setGuru( user.data );

        return () => setGuru( null );
    }, [ user ] );

    // useEffect( () => console.log( path ) );

    return (

        guru !== null &&
        <div id="mainContainer">
            <div id="main">
                <Switch>
                    <PrivateRoute exact path={ ( path ) } only={ 'guru' }>
                        <GuruIndex />
                    </PrivateRoute>

                    <PrivateRoute path={ ( `${path}/guru` ) } only="admin">
                        <GuruRouteController />
                    </PrivateRoute>

                    <PrivateRoute path={ `${path}/murid` } only="admin">
                        <MuridRouteController />
                    </PrivateRoute>

                    <PrivateRoute path={ `${path}/tingkatan` } only="admin">
                        <TingkatanRouteController />
                    </PrivateRoute>

                    <PrivateRoute path={ `${path}/kelas` } only="admin">
                        <KelasRouteController />
                    </PrivateRoute>

                    <PrivateRoute path={ `${path}/kuiz` } only="guru">
                        <KuizRouteController />
                    </PrivateRoute>

                    <PrivateRoute path={ ( `${path}/padam` ) } only="guru">
                        <Padam />
                    </PrivateRoute>

                    <Route path="*">
                        <NoMatchBox />
                    </Route>
                </Switch>
            </div>
            <div id="side">
                <NavigasiBox>
                    <Link to={ Url( `${path}` ) }> <i className="fas fa-home" /> Laman Utama</Link>
                    {
                        guru.g_jenis === 'admin' &&
                        <>
                            <Link to={ Url( `${path}/guru` ) }> <i className="fas fa-user-graduate" /> Pengurusan Guru</Link>
                            <Link to={ Url( `${path}/murid` ) }> <i className="fas fa-users" /> Pengurusan Murid</Link>
                            <Link to={ Url( `${path}/tingkatan` ) }> <i className="fas fa-list-ol" /> Pengurusan Tingkatan</Link>
                        </>
                    }
                    <Link to={ Url( `${path}/kuiz` ) }> <i className="fas fa-book" /> Pengurusan Kuiz</Link>
                </NavigasiBox>
                <UserBox />
                <StatisticWeb />
            </div>
        </div >

    );
}

function NavigasiBox( { active, children, ...rest } )
{
    let flatten = [];

    if ( children.length > 0 )
    {
        for ( let i = 0; i < children.length; i++ )
        {
            let c = children[ i ];
            // console.log( c );
            if ( c.type === Fragment )
            {
                // console.log( c );
                let cc = c.props.children;
                // console.log( cc.length );
                if ( cc.length > 0 )
                {
                    // console.log( cc )
                    for ( let j = 0; j < cc.length; j++ )
                    {
                        // console.log( j );
                        flatten.push( cc[ j ] );
                    }
                }
                else
                {
                    // console.log( cc );
                    flatten.push( cc );
                }
            }
            else
            {
                if ( c !== false )
                {
                    flatten.push( c );
                }
            }
        }
    }
    // console.log( flatten );
    return (
        <Box.Box className="navigasi-guru">
            <Box.BoxHeader>
                <i className="fas fa-bars" /> Navigasi
            </Box.BoxHeader>
            <Box.BoxBody>
                <table className="navigasi table">
                    <tbody>
                        {
                            flatten.length > 0 &&
                            flatten.map( c => c !== null && <tr key={ flatten.indexOf( c ) } >
                                <td>{ c }</td>
                            </tr> )
                        }
                    </tbody>
                </table>
            </Box.BoxBody>
        </Box.Box>
    );
}

export default GuruPageRouteController;