import { useState, useEffect, useContext } from 'react';
import { Link, Route } from 'react-router-dom';
import { UserContext } from './contexts/UserContext';
import ErrorBox from './boxes/ErrorBox';
import { API, Url } from './utils';
import Loader from 'react-loader-spinner';

function PrivateRoute ( { path, only, exact, ...rest } )
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
            API.request( '/api/user.php?type=verify', {
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            } ).then( data =>
            {
                // console.log( data );
                if ( !data.success )
                {
                    console.log( 'user not verified' );
                }
                else
                {
                    console.log( 'verified' );
                }

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
                    : <div style={ { height: '60vh', position: 'relative' } }>
                        <span style={ {
                            position: 'absolute',
                            left: '50%',
                            top: '50%',
                            transform: 'translate(-50%, -50%)'
                        } }>
                            <Loader type="TailSpin" color="#8E2DE2" secondaryColor="#4A00E0" />
                        </span>
                    </div>
            }
        </>
    );
}

function InvalidAccess ()
{
    return (
        <div id="mainContainer">
            <ErrorBox className="flex-12" style={ { width: '100%' } }>
                403. Akses Tanpa Kebenaran.
                <br />
                <small>Anda tidak mempunyai akses terhadap laman ini. <Link to={ Url( '/' ) }>Log masuk</Link></small>
            </ErrorBox>
        </div>
    );
}

export default PrivateRoute;