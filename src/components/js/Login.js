import { useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { Box, BoxBody, BoxHeader } from "./boxes/Box";
import NavigasiBox from "./boxes/NavigasiBox";
import { UserContext } from "./contexts/UserContext";
import StatisticWeb from "./StatisticWeb";
import TailSpinLoader from "./TailSpinLoader";
import { Url } from "./utils";

export default function Login()
{
    const user = useContext( UserContext );
    const [ cred, setCred ] = useState( {
        nokp: '',
        katalaluan: '',
        jenis: 'murid'
    } );
    const [ isLoad, setIsLoad ] = useState( false );
    const [ isLogin, setIsLogin ] = useState( false );
    const history = useHistory();
    const [ disabled, setDisabled ] = useState( false );

    useEffect( () =>
    {
        setCred( {
            nokp: '',
            katalaluan: '',
            jenis: 'murid'
        } );
        setDisabled( false );
        setIsLogin( false );
        setIsLoad( false );
    }, [] );

    useEffect( () =>
    {
        if ( user.loggedin )
        {
            setIsLogin( true );
        }
        setIsLoad( true );
    }, [ user ] );

    function handleSubmit( e )
    {
        e.preventDefault();
        setDisabled( true );

        user.login( cred.nokp, cred.katalaluan, cred.jenis ).then( success =>
        {
            if ( success )
            {
                alert( 'Login berjaya' );
                setCred( {
                    nokp: '',
                    katalaluan: '',
                    jenis: 'murid'
                } );

                // setTimeout( () =>
                // {
                history.push( Url( '/' ), { from: history.location } );

                // }, 2000 );
            }
            else
            {
                alert( 'Login gagal' );
                setDisabled( false );
            }

        } );
    }

    return (
        <div id="mainContainer">
            <div id="main">
                <Box>
                    <BoxHeader>
                        <i className="fas fa-sign-in-alt" /> Login
                    </BoxHeader>
                    <BoxBody>
                        {
                            isLoad
                                ? !isLogin
                                    ? <form onSubmit={ ( e ) => handleSubmit( e ) }>
                                        <div className="input-container">
                                            <label>Nombor Kad Pengenalan</label>
                                            <input
                                                type="text"
                                                placeholder="Contoh: 123456789012"
                                                onChange={ ( e ) => setCred( { ...cred, nokp: e.target.value } ) }
                                                disabled={ disabled }
                                                maxLength="12"
                                                minLength="12"
                                                required
                                            />
                                        </div>
                                        <div className="input-container">
                                            <label>Katalaluan</label>
                                            <input
                                                type="password"
                                                placeholder="Contoh: 123"
                                                onChange={ ( e ) => setCred( { ...cred, katalaluan: e.target.value } ) }
                                                disabled={ disabled }
                                                required
                                            />
                                        </div>
                                        <div className="input-container">
                                            <label>Jenis Login</label>
                                            <br />
                                            <input
                                                type="radio"
                                                id="murid"
                                                defaultChecked
                                                onClick={ () => setCred( { ...cred, jenis: 'murid' } ) }
                                                name="jenis"
                                                disabled={ disabled }
                                                required
                                            /> <label htmlFor="murid">Murid</label>
                                            <br />
                                            <input
                                                type="radio"
                                                id="guru"
                                                onClick={ () => setCred( { ...cred, jenis: 'guru' } ) }
                                                name="jenis"
                                                disabled={ disabled }
                                                required

                                            /> <label htmlFor="guru">Guru</label>
                                        </div>
                                        <button style={ { fontSize: '16px' } }>
                                            <i className="fas fa-sign-in-alt" /> Login
                                        </button>
                                    </form>
                                    : 'Anda sudah login.'
                                : <TailSpinLoader />
                        }
                    </BoxBody>
                </Box>
            </div>
            <div id="side">
                <NavigasiBox />
                <StatisticWeb />
            </div>
        </div>
    );
};