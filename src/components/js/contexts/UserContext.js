import { createContext, useEffect, useState } from "react";
import { login } from "../utils";

export const UserContext = createContext();

const defaultUser = {
    nokp: '',
    katalaluan: '',
    jenis: 'murid',
    loggedin: false,
    token: null,
    fail: false,
    failMessage: '',
    data: {}
};

export function getUser()
{
  const user = localStorage.getItem('user');
  if( typeof user !== 'string' )
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
    catch( e )
    {
      return null;
    }
  }
}

export function UserContextProvider( {children = {}, ...rest} )
{
    
    let [user, setUser] = useState( () => { return getUser() || defaultUser });

    async function userLogin()
    {
        // console.log( 'Yes' );
        // setUser( {...user, loggedin: true} );
        // console.log( 'No' );
        const data = await login( user.nokp, user.katalaluan, user.jenis );

        // console.log( data );
        // console.log( data );
        if( data.success )
        {
            user = {
                ...user,
                loggedin: true,

                //rest
                nokp: '',
                katalaluan: '',
                data: data.data.data,
                token: data.data.token
            };

            setUser( {...user} );

            return true;
        }
        else
        {
            setUser( {
                ...user,
                loggedin: false,
                fail: true,
                failMessage: data.message
            } );
        }

        return false;
    }

    useEffect( () => {
      if( user.loggedin )
      {
        localStorage.setItem( 'user', JSON.stringify( user ) );
      }
    }, [user]);

    function userLogout()
    {
        setUser( {...defaultUser} )
        localStorage.removeItem( 'user' );
    }


    return (
        <UserContext.Provider value={ {user, setUser, userLogin, userLogout} }>
            {children}
        </UserContext.Provider>
    )
}

/* 

  useEffect( () => {
    // console.log( userData );
    console.log( process.env.PUBLIC_URL );

    if( userData.loggedin === true )
    {
      localStorage.setItem( 'user', JSON.stringify( userData ) );
    }
  }, [userData] );

  async function login()
  {
    setUserData(
      {
        ...userData,
        fail: false,
        failMessage: '',
        token: null
      }
    );
    setRedirect( null )
    

    const data = { 
      nokp: userData.nokp,
      katalaluan: userData.katalaluan,
      jenis: userData.jenis
    };
    // console.log( data );

    const request = await fetch( 'http://localhost/nsejarah-react/api/login.php',
    {
      method: 'POST',
      headers: { 'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8' },
      body: JSON.stringify( data )
    } );

    const status = request.status;
    if( status >= 200 && status <= 299 )
    {
      const jwt = await request.text();
      setUserData( { ...userData, token: jwt, fail: false, nokp: '', katalaluan: '', loggedin: true } );
      setRedirect( <Redirect to={userData.jenis === 'murid' ? '/kuiz?class_only=1' : '/guru'}/> );
    }
    else
    {
      console.log( await request.text() );
      setUserData(
        {
          ...userData,
          loggedin: false,
          fail: true,
          failMessage: 'Ralat pada katalaluan atau nokp'
        }
      );
    }
  };

  async function logout()
  {
    setUserData( 
      {
        ...userData,
        loggedin: false,
        token: null,
        fail: false,
        failMessage: false,
        jenis: 'murid'
      }
     );

     //clear local storage
     localStorage.removeItem( 'user' );
  }

  async function getUserData()
  {
    if( !userData.loggedin ) return false;

    const token = userData.token;

    const request = await fetch('http://localhost/nsejarah-react/api/user.php', {
      method: "GET",
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const data = await request.json();
    // console.log( data );

    return data;

  }
 */