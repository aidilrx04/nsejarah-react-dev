import { createContext, useEffect, useState } from "react";
import { API, ErrorCallback } from "../utils";

export const UserContext = createContext();

const defaultUser = {
  jenis: 'murid',
  loggedin: false,
  token: null,
  fail: false,
  failMessage: '',
  data: {}
};

export function getUser()
{
  const user = localStorage.getItem( 'user' );
  if ( typeof user !== 'string' )
  {
    return null;
  }
  else
  {
    try
    {
      // console.log( 'yeay' );
      const parsed = JSON.parse( user );
      return parsed;
    }
    catch ( e )
    {
      return null;
    }
  }
}

export function UserContextProvider( props )
{

  let [user, setUser] = useState( () => { return getUser() || defaultUser; } );

  useEffect( () =>
  {
    ErrorCallback.setCallback( 401, () =>
    {
      console.log( 'purge user' );
      logout();
    } );
  }, [] );

  async function login( nokp, katalaluan, jenis = 'murid' )
  {
    const data = await API.login( nokp, katalaluan, jenis );
    if ( data.success )
    {
      user = {
        ...user,
        loggedin: true,
        jenis: jenis,

        //rest
        data: data.data.data,
        token: data.data.token
      };

      setUser( { ...user } );

      return true;
    }
    else
    {
      setUser( {
        ...user,
        jenis: jenis,
        loggedin: false,
        fail: true,
        failMessage: data.message
      } );
    }

    return false;
  }

  useEffect( () =>
  {
    if ( user.loggedin )
    {
      localStorage.setItem( 'user', JSON.stringify( user ) );
    }
  }, [user] );

  function logout()
  {
    console.log( 'logout' );
    setUser( { ...defaultUser } );
    localStorage.removeItem( 'user' );
  }


  return (
    <UserContext.Provider value={{ ...user, setUser, login, logout }} {...props}>
    </UserContext.Provider>
  );
}
