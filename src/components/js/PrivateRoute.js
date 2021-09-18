import { useState, useEffect, useContext } from 'react';
import { Link, Route, useHistory } from 'react-router-dom';
import { UserContext } from './contexts/UserContext';
import ErrorBox from './boxes/ErrorBox';
import { API, Url } from './utils';
import TailSpinLoader from './TailSpinLoader';

function PrivateRoute( { path, only, exact, ...rest } )
{
    const user = useContext( UserContext );
    let [ valid, setValid ] = useState( null );
    const [ verified, setVerified ] = useState( false );

    useEffect( () =>
    {
        console.log( 'verifying at ' + path + '...' );
        // verify each request from server
        if ( user.loggedin && user.token.length > 0 )
        {
            API.verify( user.token )
                .then( () =>
                {
                    setVerified( true );
                } );
        }
        else
        {
            setValid( false );
        }

        return () =>
        {
            setValid( null );
        };
    }, [ user, valid, path ] );


    useEffect( () =>
    {
        // console.log( user );
        if ( user.loggedin === true && verified )
        {
            if ( only === 'guru' || only === 'admin' )
            {
                if ( user.data.hasOwnProperty( 'm_nokp' ) )
                {
                    setValid( false );
                }
                else if ( only === 'admin'
                    && user.data.hasOwnProperty( 'g_jenis' )
                    && user.data.g_jenis === 'admin' )
                {
                    setValid( true );
                }
                else if ( only === 'admin'
                    && user.data.hasOwnProperty( 'g_jenis' )
                    && user.data.g_jenis !== 'admin' ) 
                {
                    setValid( false );
                }
                else
                {
                    setValid( true );
                }
            }
            else if ( only === 'murid' )
            {
                if ( user.data.hasOwnProperty( 'g_nokp' ) )
                {
                    setValid( false );
                }
                else
                {
                    setValid( true );
                }
            }
        }
        else if ( user.loggedin === false )
        {
            setValid( false );
        }
    }, [ user, only, valid, verified ] );

    return (
        <>
            {
                valid !== null
                    ? <>
                        {
                            valid !== false && <Route exact={ exact ? true : false } path={ Url( path ) } { ...rest } />
                        }
                        {
                            valid === false && <InvalidAccess />
                        }
                    </>
                    : <TailSpinLoader />
            }
        </>
    );
}

function InvalidAccess()
{
    const history = useHistory();
    return (
        <div id="mainContainer">
            <ErrorBox className="flex-12" style={ { width: '100%' } }>
                403. Akses Tanpa Kebenaran.
                <br />
                <small>Anda tidak mempunyai akses terhadap laman ini. <Link to={ Url( `/login?redir=${history.location.pathname}` ) }>Log masuk</Link></small>
            </ErrorBox>
        </div>
    );
}

export default PrivateRoute;