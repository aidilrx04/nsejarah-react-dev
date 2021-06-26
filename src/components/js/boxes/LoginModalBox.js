import { useContext, useEffect, useState } from "react";
import { UserContext } from "../contexts/UserContext";
import UserBox from "./UserBox";

export function LoginModalBox( {cond,...rest} )
{
    const { user } = useContext( UserContext );
    let [show, setShow ] = useState( cond || false );
    useEffect( () => {
        if( user.loggedin )
        {
            setShow( false );
        }
    }, [user] )
    return (
        <div style={{
            position: 'fixed',
            top: '0',
            left: '0',
            width: '100%',
            height: '100%',
            background: '#000000bb',
            display: show ? 'block' : 'none'
        }}>
            <div style={{
                width: '400px',
                // background: '#fff',
                margin: '100px auto',
                position: 'relative'
            }}>
                <i className="fas fa-times" style={{
                    color: '#fff',
                    position: 'absolute',
                    top: 'calc((1.17em + 5px) / 2)',
                    right: '10px',
                    fontSize: '1.17em',
                    cursor: 'pointer'
                }}
                    onClick={() => setShow( false )}
                />
                <UserBox redir={false}/>
            </div>
        </div>
    );
}

export default LoginModalBox;