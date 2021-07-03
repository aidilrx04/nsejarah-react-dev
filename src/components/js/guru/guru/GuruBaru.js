import { useContext, useEffect, useState } from "react";
import { Redirect } from "react-router";
import { Box, BoxBody, BoxHeader } from "../../boxes/Box";
import { UserContext } from "../../contexts/UserContext";
import { API, rand, Url, useTitle } from '../../utils';

let template = {
    g_id: rand(),
    g_nama: '',
    g_nokp: '',
    g_katalaluan: '',
    g_jenis: 'guru'
};

export function GuruBaru()
{
    useTitle( 'Tambah Guru' );

    const { user } = useContext( UserContext );

    let [guru, setGuru] = useState( () => template );
    let [disabled, setDisabled] = useState( false );
    let [redirect, setRedirect] = useState( null );
    let [baruData, setBaruData] = useState( {} );
    // useEffect( () => console.log( guru ), [guru]);

    useEffect( () =>
    {
        return () =>
        {
            if ( guru.hasOwnProperty( 'g_id' ) ) 
            {
                setGuru( {} );
            }
            setDisabled( false );
            setRedirect( null );
            setBaruData( {} );
        };
    }, [guru] );

    useEffect( () =>
    {
        if ( redirect === true )
        {
            setTimeout( () =>
            {
                setRedirect( <Redirect to={Url( `/guru/guru/${baruData.data.g_id}` )} /> );
            }, 2000 );
        }
    }, [redirect, baruData] );

    function handleSubmit( e )
    {
        e.preventDefault();
        setDisabled( true );
        setBaruData( {} );

        API.baru( guru, user.token, 'guru' ).then( data =>
        {
            // console.log( data );
            setDisabled( false );
            setBaruData( data );
            setRedirect( true );
        } )
            .catch( err =>
            {
                console.log( err );
                setDisabled( false );
            } );
    }
    return (
        <Box>
            {redirect}
            <BoxHeader>
                <i className="fas fa-plus" /> Tambah Guru Baru
            </BoxHeader>
            <BoxBody>
                {
                    baruData.success === true &&
                    <Success>
                        <h4> {baruData.message} </h4>

                        <small>Redirect in 2 secs </small>
                    </Success>
                }
                {
                    baruData.success === false &&
                    <Fail>
                        <h4> {baruData.message} </h4>

                    </Fail>
                }
                <form onSubmit={e => handleSubmit( e )}>

                    <div className="input-container">
                        <label htmlFor="nokp"> No. KP Guru: </label>
                        <input
                            type="text"
                            value={guru.g_nokp}
                            onChange={e => setGuru( { ...guru, g_nokp: e.target.value } )}
                            id="nokp"
                            placeholder="No. KP guru"
                            maxLength="12"
                            minLength="12"
                            required
                            disabled={disabled}
                        />
                    </div>

                    <div className="input-container">
                        <label htmlFor="nama"> Nama Guru: </label>
                        <input
                            value={guru.g_nama}
                            onChange={e => setGuru( { ...guru, g_nama: e.target.value } )}
                            type="text"
                            id="nama"
                            placeholder="Nama guru"
                            maxLength="200"
                            required
                            disabled={disabled}
                        />
                    </div>

                    <div className="input-container">
                        <label htmlFor="katalaluan"> Katalaluan Guru: </label>
                        <input
                            value={guru.g_katalaluan}
                            onChange={e => setGuru( { ...guru, g_katalaluan: e.target.value } )}
                            type="text"
                            id="katalaluan"
                            placeholder="Katalaluan guru"
                            maxLength="200"
                            required
                            disabled={disabled}
                        />
                    </div>

                    <div className="input-container">
                        <label htmlFor="jenis"> Jenis Guru: </label>
                        <select
                            name="jenis"
                            value={guru.g_jenis}
                            onChange={e => setGuru( { ...guru, g_jenis: e.target.value } )}
                            disabled={disabled}
                        >
                            <option value="guru"> Guru </option>
                            <option value="admin"> Admin </option>
                        </select>
                    </div>

                    <button> <i className="fas fa-plus" /> Tambah Baru </button>
                </form>
            </BoxBody>
        </Box>
    );
}

function Success( { children = {}, ...rest } )
{
    return (
        <div style={{ background: '#00640088', color: 'darkgreen' }} {...rest}>
            {children}
        </div>
    );
}

function Fail( { children = {}, ...rest } )
{
    return (
        <div style={{ background: '#008b0088', color: '#008b00' }} {...rest}>
            {children}
        </div>
    );
}

export default GuruBaru;