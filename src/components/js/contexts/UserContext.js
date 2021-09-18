import { createContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { API, ErrorCallback, Url } from "../utils";
import TailSpinLoader from '../TailSpinLoader';

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

  let [ user, setUser ] = useState( () => { return getUser() || defaultUser; } );
  const history = useHistory();
  const [ isVerified, setIsVerified ] = useState( false );

  useEffect( () =>
  {
    ErrorCallback.setCallback( 401, () =>
    {
      // Delete user when verification request return 401 status
      logout( false );
    } );

    // setTimeout( () =>
    // {
    // verify user when they enter the site
    setIsVerified( async () =>
    {
      if ( typeof user.token === 'string' && user.token.length > 0 )
      {
        await API.verify( user.token );
        return true;
      }
      return true;
    } );
    // }, 200 );

    return () =>
    {
      setIsVerified( false );
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
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
  }, [ user ] );

  function logout( redirectToLogin = true )
  {
    console.log( 'logout' );
    setUser( { ...defaultUser } );
    localStorage.removeItem( 'user' );

    if ( redirectToLogin )
    {
      history.push( Url( '/login' ) );
    }
  }


  return (
    isVerified
      ? <UserContext.Provider value={ { ...user, setUser, login, logout } } { ...props }>
      </UserContext.Provider>
      : <div style={ {
        height: '100vh',
        width: '100vw'
      } }>
        <svg id="wave" style={ { transform: 'rotate(180deg)', transition: '0.3s', width: '100vw', position: 'absolute' } } viewBox="0 0 1440 310" version="1.1" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="sw-gradient-0" x1={ 0 } x2={ 0 } y1={ 1 } y2={ 0 }><stop stopColor="rgba(74, 0, 224, 1)" offset="0%" /><stop stopColor="rgba(142, 45, 226, 1)" offset="100%" /></linearGradient></defs><path style={ { transform: 'translate(0, 0px)', opacity: 1 } } fill="url(#sw-gradient-0)" d="M0,248L26.7,222.2C53.3,196,107,145,160,139.5C213.3,134,267,176,320,206.7C373.3,238,427,258,480,232.5C533.3,207,587,134,640,93C693.3,52,747,41,800,62C853.3,83,907,134,960,129.2C1013.3,124,1067,62,1120,46.5C1173.3,31,1227,62,1280,98.2C1333.3,134,1387,176,1440,180.8C1493.3,186,1547,155,1600,134.3C1653.3,114,1707,103,1760,93C1813.3,83,1867,72,1920,77.5C1973.3,83,2027,103,2080,98.2C2133.3,93,2187,62,2240,51.7C2293.3,41,2347,52,2400,77.5C2453.3,103,2507,145,2560,134.3C2613.3,124,2667,62,2720,72.3C2773.3,83,2827,165,2880,211.8C2933.3,258,2987,269,3040,268.7C3093.3,269,3147,258,3200,227.3C3253.3,196,3307,145,3360,144.7C3413.3,145,3467,196,3520,180.8C3573.3,165,3627,83,3680,41.3C3733.3,0,3787,0,3813,0L3840,0L3840,310L3813.3,310C3786.7,310,3733,310,3680,310C3626.7,310,3573,310,3520,310C3466.7,310,3413,310,3360,310C3306.7,310,3253,310,3200,310C3146.7,310,3093,310,3040,310C2986.7,310,2933,310,2880,310C2826.7,310,2773,310,2720,310C2666.7,310,2613,310,2560,310C2506.7,310,2453,310,2400,310C2346.7,310,2293,310,2240,310C2186.7,310,2133,310,2080,310C2026.7,310,1973,310,1920,310C1866.7,310,1813,310,1760,310C1706.7,310,1653,310,1600,310C1546.7,310,1493,310,1440,310C1386.7,310,1333,310,1280,310C1226.7,310,1173,310,1120,310C1066.7,310,1013,310,960,310C906.7,310,853,310,800,310C746.7,310,693,310,640,310C586.7,310,533,310,480,310C426.7,310,373,310,320,310C266.7,310,213,310,160,310C106.7,310,53,310,27,310L0,310Z" /><defs><linearGradient id="sw-gradient-1" x1={ 0 } x2={ 0 } y1={ 1 } y2={ 0 }><stop stopColor="rgba(142, 45, 226, 1)" offset="0%" /><stop stopColor="rgba(74, 0, 224, 1)" offset="100%" /></linearGradient></defs><path style={ { transform: 'translate(0, 50px)', opacity: '0.9' } } fill="url(#sw-gradient-1)" d="M0,0L26.7,20.7C53.3,41,107,83,160,82.7C213.3,83,267,41,320,20.7C373.3,0,427,0,480,0C533.3,0,587,0,640,25.8C693.3,52,747,103,800,134.3C853.3,165,907,176,960,155C1013.3,134,1067,83,1120,77.5C1173.3,72,1227,114,1280,134.3C1333.3,155,1387,155,1440,175.7C1493.3,196,1547,238,1600,222.2C1653.3,207,1707,134,1760,98.2C1813.3,62,1867,62,1920,93C1973.3,124,2027,186,2080,186C2133.3,186,2187,124,2240,87.8C2293.3,52,2347,41,2400,72.3C2453.3,103,2507,176,2560,217C2613.3,258,2667,269,2720,258.3C2773.3,248,2827,217,2880,186C2933.3,155,2987,124,3040,134.3C3093.3,145,3147,196,3200,211.8C3253.3,227,3307,207,3360,201.5C3413.3,196,3467,207,3520,186C3573.3,165,3627,114,3680,82.7C3733.3,52,3787,41,3813,36.2L3840,31L3840,310L3813.3,310C3786.7,310,3733,310,3680,310C3626.7,310,3573,310,3520,310C3466.7,310,3413,310,3360,310C3306.7,310,3253,310,3200,310C3146.7,310,3093,310,3040,310C2986.7,310,2933,310,2880,310C2826.7,310,2773,310,2720,310C2666.7,310,2613,310,2560,310C2506.7,310,2453,310,2400,310C2346.7,310,2293,310,2240,310C2186.7,310,2133,310,2080,310C2026.7,310,1973,310,1920,310C1866.7,310,1813,310,1760,310C1706.7,310,1653,310,1600,310C1546.7,310,1493,310,1440,310C1386.7,310,1333,310,1280,310C1226.7,310,1173,310,1120,310C1066.7,310,1013,310,960,310C906.7,310,853,310,800,310C746.7,310,693,310,640,310C586.7,310,533,310,480,310C426.7,310,373,310,320,310C266.7,310,213,310,160,310C106.7,310,53,310,27,310L0,310Z" /></svg>
        <TailSpinLoader
          style={ {
            height: '90vh',
            width: '100vw'
          } }
        >
          Memuat...
        </TailSpinLoader>
        <div style={ {
          position: 'absolute',
          bottom: 0,
          left: 0,
          height: '10vh',
          width: '100vw',
          background: '#8E2DE2',
          color: '#fefefe',
          padding: '10px'
        } }>
          <h4>
            <center>
              NSejarah, &copy; 2021 Aidil BlubBlub
            </center>
          </h4>
          <center>
            <p>
              <a
                href="http://github.com/aidilrx04/"
                target="_blank"
                rel="noopener noreferrer"
                style={ {
                  color: "#fefefe"
                } }
              >Github</a>
            </p>
          </center>
        </div>
      </div>
  );
}
