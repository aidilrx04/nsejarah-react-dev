import { useState, useEffect, useContext } from 'react';
import { Box, BoxHeader, BoxBody } from './Box';
// import LoginForm from './LoginForm';

import { UserContext } from '../contexts/UserContext';
import { Redirect } from 'react-router';
import { Url } from '../utils';



export function UserBox( { redir = false, ...rest } )
{
    const user = useContext( UserContext );
    let [disabled, setDisabled] = useState( false );
    let [redirect, setRedirect] = useState( null );
    let [data, setData] = useState( () => ( {
        nokp: '',
        katalaluan: '',
        jenis: 'murid'
    } ) );

    useEffect( () =>
    {
        return () =>
        {
            if ( user.loggedin )
            {
                setDisabled( false );
                setRedirect( false );
            }
        };
    }, [user] );

    async function handleSubmit( e )
    {
        e.preventDefault();
        setDisabled( true );
        const login = await user.login( data.nokp, data.katalaluan, data.jenis );

        if ( login && redir )
        {
            setRedirect( <Redirect to={Url( user.jenis === 'murid' ? '' : '/guru' )} /> );
        }
        setDisabled( false );

    }

    return (
        <Box id="user-box" {...rest}>
            {redirect}
            <BoxHeader>{user.loggedin
                ? ( user.jenis === 'murid'
                    ? <><i className="fas fa-user" /> Murid </>
                    : <> <i className="fas fa-user-graduate" /> Guru {
                        user.data.g_jenis === 'admin'
                            ? ': Admin'
                            : ''
                    } </> )
                : <> <i className="fas fa-sign-in-alt" /> Login </>}</BoxHeader>
            <BoxBody>
                {!user.loggedin &&
                    <form onSubmit={e => handleSubmit( e )}>
                        <div className="input-container">
                            <label htmlFor="nokp">No. Kad Pengenalan</label>
                            {/* Onblur only update state when user finished typing - X */}
                            <input
                                value={data.nokp}

                                onChange={( e ) => setData( { ...data, nokp: e.target.value } )}
                                type="text"
                                id="nokp"
                                placeholder="Cth. 112233445566"
                                minLength="12"
                                maxLength="12"
                                autoComplete="off"
                                disabled={disabled}
                                required
                            />
                        </div>

                        <div className="input-container">
                            <label htmlFor="katalaluan">Katalaluan</label>
                            <input
                                onChange={( e ) => setData( { ...data, katalaluan: e.target.value } )}
                                value={data.katalaluan}
                                type="password"
                                id="katalaluan"
                                placeholder="Cth. samadfly123"
                                maxLength="30"
                                disabled={disabled}
                                required
                            />
                        </div>

                        <div className="input-container">
                            <label>Jenis: </label>
                            <input
                                onClick={() => setData( { ...data, jenis: 'murid' } )}
                                type="radio"
                                id="murid"
                                name="jenis"
                                defaultChecked
                                disabled={user.jenis === 'murid' || disabled} />
                            <label htmlFor="murid"> Murid </label>

                            &nbsp;
                            &nbsp;

                            <input
                                onClick={() => setData( { ...data, jenis: 'guru' } )}
                                type="radio"
                                id="guru"
                                name="jenis"
                                disabled={user.jenis === 'guru' || disabled} />
                            <label htmlFor="guru"> Guru </label>
                        </div>

                        {user.fail &&
                            <div
                                // style={{background: '#ff000088', padding: '5px 10px', margin: '5px 0px'}}
                                className="error"
                            >
                                <i className="fas fa-exclamation-triangle" /> {user.failMessage}
                            </div>}

                        <button className="submit-btn">Login <i className="fas fa-sign-in-alt" /></button>
                    </form>
                }

                {
                    Object.keys( user.data ).length > 0 &&
                    <div className="user-data">
                        <h3>Nama: {user.data.m_nama}{user.data.g_nama}</h3>
                        <li><b>Jenis: </b> {user.jenis} {`${user.data.g_jenis ? `( ${user.data.g_jenis} )` : ''}`} </li>

                        <button
                            className="logout-btn"
                            onClick={user.logout}
                        >
                            Log Keluar  <i className="fas fa-sign-out-alt" />
                        </button>
                    </div>
                }
            </BoxBody>
        </Box>
    );
}



export default UserBox;