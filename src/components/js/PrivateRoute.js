import { useState, useEffect, useContext } from 'react';
import { Link, Route } from 'react-router-dom';
import { UserContext } from './contexts/UserContext';
import ErrorBox from './boxes/ErrorBox';
import { Url } from './utils';

function PrivateRoute( {path, only, exact,...rest} )
{
    const { user } = useContext( UserContext );
    //eslint-disable-next-line
    let [valid, setValid] = useState(null);

    useEffect( () => {
        // console.log( user );
        if( user.loggedin === true )
        {
            if( only === 'guru' || only === 'admin' )
            {
                if( user.data.hasOwnProperty( 'm_nokp' ) )
                {
                    setValid( false );
                }
                else  if( only === 'admin' 
                            && user.data.hasOwnProperty( 'g_jenis' ) 
                            && user.data.g_jenis === 'admin' )
                {
                    setValid( true );
                }
                else if( only === 'admin' 
                            && user.data.hasOwnProperty( 'g_jenis' ) 
                            && user.data.g_jenis !== 'admin' ) 
                {
                    setValid( false );
                }
                else {
                    setValid( true );
                }
            }
            else if( only === 'murid' )
            {
                if( user.data.hasOwnProperty( 'g_nokp' ) )
                {
                    setValid( false );
                }
                else {
                    setValid( true );
                }
            }
        }
        else if ( user.loggedin === false )
        {
            setValid( false );
        }
    }, [user, only] );

    useEffect( () => {
        console.log( valid );
    }, [valid] );
    
    return (
        <>
        {
            valid !== null &&
            <>
            {
                valid !== false &&  <Route exact path={Url( path )} {...rest}/>
            }
            {
                valid === false && <InvalidAccess/>
            }
            </>
        }
        </>
    );
}

function InvalidAccess()
{
    return (
        <div id="mainContainer">
            <ErrorBox className="flex-12" style={{width: '100%'}}>
                403. Akses Tanpa Kebenaran.
                <br/>
                <small>Anda tidak mempunyai akses terhadap laman ini. <Link to={Url( '/' )}>Log masuk</Link></small>
            </ErrorBox>
        </div>
    );
}

export default PrivateRoute;