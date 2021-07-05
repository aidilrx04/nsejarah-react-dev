import { useContext, useState } from "react";
import { Box, BoxBody, BoxHeader } from "../../boxes/Box";
import { API, Url, useTitle } from "../../utils";
import { UserContext } from '../../contexts/UserContext';
import { useHistory } from "react-router";

export function KelasBaru()
{
    useTitle( 'Tambah Kelas' );

    let [kelas, setKelas] = useState( () => ( {
        "k_id": "123",
        "k_nama": ""
    } ) );
    let [disabled, setDisabled] = useState( false );
    let [status, setStatus] = useState( null );

    const user = useContext( UserContext );
    let history = useHistory();

    function submitKelas( e )
    {

        e.preventDefault();
        setDisabled( true );
        setStatus( null );

        API.baru( kelas, user.token, 'kelas' ).then( data =>
        {
            if ( data.success )
            {
                history.push( Url( '/guru/tingkatan' ) );
            }
            else
            {
                setStatus( data );
            }
            setDisabled( false );
        } );
    }
    return (
        <Box>
            <BoxHeader>
                <i className="fas fa-plus" /> Kelas Baharu
            </BoxHeader>
            <BoxBody>
                <form onSubmit={e => submitKelas( e )}>
                    {
                        status && !status.success &&
                        <h4 className="status-fail">
                            {status.message}
                        </h4>
                    }
                    <div className="input-container">
                        <label htmlFor="nama">Nama Kelas</label>
                        <input
                            type="text"
                            maxLength="255"
                            value={kelas.k_nama}
                            onChange={e => setKelas( { ...kelas, k_nama: e.target.value } )}
                            disabled={disabled}
                            placeholder="Nama Kelas"
                        />
                    </div>

                    <button>Tambah Kelas</button>
                </form>
            </BoxBody>
        </Box>
    );
}

export default KelasBaru;