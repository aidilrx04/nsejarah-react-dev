import { useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
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

    const user = useContext( UserContext );

    let [guru, setGuru] = useState( () => template );
    let [disabled, setDisabled] = useState( false );
    let [status, setStatus] = useState( null );
    // useEffect( () => console.log( guru ), [guru]);
    let history = useHistory();

    useEffect( () =>
    {
        return () =>
        {
            setGuru( g => template );
            setDisabled( false );
            setStatus( null );
        };
    }, [] );


    function handleSubmit( e )
    {
        e.preventDefault();
        setDisabled( true );
        setStatus( null );

        API.baru( guru, user.token, 'guru' ).then( data =>
        {
            console.log( data );
            if ( data.success )
            {
                history.push( Url( `/guru/guru/${data.data.g_id}` ) );
            }

            setDisabled( false );
            setStatus( data );

        } );
    }
    return (
        <Box>
            <BoxHeader>
                <i className="fas fa-plus" /> Tambah Guru Baru
            </BoxHeader>
            <BoxBody>
                {
                    status
                        ? status.success ?
                            <h4 className="status-success">
                                {status.message}
                            </h4>
                            :
                            <h4 className="status-fail"> {status.message}</h4>
                        : ''
                }
                <form onSubmit={e => handleSubmit( e )}>

                    <div className="input-container">
                        <label htmlFor="nokp"> No. KP Guru: </label>
                        {console.log( guru )}
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
export default GuruBaru;