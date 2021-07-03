import { useState } from "react";
import { Box, BoxBody, BoxHeader } from "../../boxes/Box";
import { API, useTitle } from "../../utils";

export function KelasBaru()
{
    useTitle( 'Tambah Kelas' );

    let [kelas, setKelas] = useState( () => ( {
        "k_id": "123",
        "k_nama": "Cemerlang"
    } ) );
    let [disabled, setDisabled] = useState( false );

    function submitKelas( e )
    {

        e.preventDefault();
        setDisabled( true );
        // !tmp only
        API.baru( kelas, 'token_here', 'kelas' ).then( data =>
        {
            console.log( data );
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
                    <div className="input-container">
                        <label htmlFor="nama">Nama Kelas</label>
                        <input
                            type="text"
                            maxLength="255"
                            value={kelas.k_nama}
                            onChange={e => setKelas( { ...kelas, k_nama: e.target.value } )}
                            disabled={disabled}
                        />
                    </div>

                    <button>Tambah Kelas</button>
                </form>
            </BoxBody>
        </Box>
    );
}

export default KelasBaru;