import { useState, useEffect, useContext } from 'react';
import { Box, BoxHeader, BoxBody } from './Box';
// import LoginForm from './LoginForm';
import '../../css/Form.css';
import '../../css/Form.scss';
import { UserContext } from '../contexts/UserContext';
import { Redirect } from 'react-router';
import { Url } from '../utils';



export function UserBox( { redir = false , ...rest } )
{
    const { user, setUser, userLogin, userLogout } = useContext( UserContext );
    let [disabled, setDisabled] = useState(false);
    let [redirect, setRedirect] = useState(null);

    useEffect( () => {
        return () => {
            if( user.loggedin )
            {
                setDisabled( false );
                setRedirect( false );
            }
        }
    }, [user]);

    function handleChangeNokp( e )
    {
        setUser( {...user, nokp: e.target.value} )
    }

    function handleChangeKatalaluan( e )
    {
        setUser( { ...user, katalaluan: e.target.value } );
    }

    async function handleSubmit(e)
    {
        e.preventDefault();
        setDisabled( true );
        const login = await userLogin();

        if( login && redir )
        {
            setRedirect( <Redirect to={ Url( user.jenis === 'murid' ? '' : '/guru' ) }/> );
        }
        setDisabled( false );

    }

    return (
    <Box id="user-box" {...rest}>
        {redirect}
        <BoxHeader>{ user.loggedin 
                        ? ( user.jenis === 'murid' 
                            ? <><i className="fas fa-user"/> Murid </> 
                            : <> <i className="fas fa-user-graduate"/> Guru { 
                                user.data.g_jenis === 'admin' 
                                ? ': Admin' 
                                : '' 
                                } </> ) 
                        : <> <i className="fas fa-sign-in-alt"/> Login </> }</BoxHeader>
        <BoxBody>
            {!user.loggedin && 
            <form onSubmit={e => handleSubmit(e)}>
                <div className="input-container">
                    <label htmlFor="nokp">No. Kad Pengenalan</label>
                    {/* Onblur only update state when user finished typing - X */}
                    <input 
                        onChange={handleChangeNokp} 
                        value={user.nokp} 
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
                        onChange={handleChangeKatalaluan} 
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
                        onClick={() => setUser( { ...user, jenis: 'murid' } )}  
                        type="radio" 
                        id="murid" 
                        name="jenis" 
                        defaultChecked 
                        disabled={user.jenis === 'murid' || disabled}/>
                    <label htmlFor="murid"> Murid </label>

                    &nbsp;
                    &nbsp;

                    <input 
                        onClick={() => setUser( { ...user, jenis: 'guru' } )} 
                        type="radio" 
                        id="guru" 
                        name="jenis" 
                        disabled={ user.jenis === 'guru' || disabled }/>
                    <label htmlFor="guru"> Guru </label>
                </div>

                {user.fail && 
                    <div 
                        // style={{background: '#ff000088', padding: '5px 10px', margin: '5px 0px'}}
                        className="error"
                    >
                        <i className="fas fa-exclamation-triangle"/> {user.failMessage}
                    </div>}

                <button className="submit-btn">Login <i className="fas fa-sign-in-alt"/></button>
            </form>
            }

            {
                Object.keys(user.data).length > 0 &&
                <div className="user-data">
                <h3>Nama: {user.data.m_nama}{user.data.g_nama}</h3>
                <li><b>Jenis: </b> {user.jenis} {`${user.data.g_jenis ? `( ${user.data.g_jenis} )` : ''}`} </li>

                <button 
                    className="logout-btn" 
                    onClick={userLogout}
                >
                    Log Keluar  <i className="fas fa-sign-out-alt"/>
                </button>
                </div>
            }
        </BoxBody>
    </Box>
    );
}



export default UserBox;