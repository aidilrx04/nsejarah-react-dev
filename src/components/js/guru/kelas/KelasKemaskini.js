import { useContext, useEffect, useState } from "react";
import { useHistory, useParams } from "react-router";
import { Box, BoxBody, BoxHeader } from "../../boxes/Box";
import { UserContext } from "../../contexts/UserContext";
import { API, Url, useTitle } from "../../utils";

export function KelasKemaskini()
{
    useTitle( 'Kemaskini Kelas' );

    let { idKelas } = useParams();
    let [kelas, setKelas] = useState( {} );
    let [status, setStatus] = useState( null );
    let history = useHistory();
    const user = useContext( UserContext );

    useEffect( () =>
    {
        API.getKelas( idKelas ).then( data =>
        {
            if ( data.success ) setKelas( data.data );
            console.log( data.data );
        } );
    }, [idKelas] );

    function handleSubmit( e )
    {
        e.preventDefault();
        setStatus( null );
        API.kemaskini( kelas, user.token, 'kelas' ).then( data =>
        {
            if ( data.success )
            {
                // console.log( data );
                alert( 'Kelas berjaya dikemaskini' );
                history.push( Url( '/guru/tingkatan' ), { from: history.location } );
            }

            setStatus( data );
        } );
    }

    return (
        <Box>
            <BoxHeader>
                <i className="fas fa-pen" /> Kemaskini Kelas
            </BoxHeader>
            <BoxBody>
                {
                    kelas.hasOwnProperty( 'k_id' ) &&
                    <form onSubmit={e => handleSubmit( e )}>
                        {
                            status && !status.success &&
                            <h4 className="status-fail">
                                {status.message}
                            </h4>
                        }
                        <div className="input-container">
                            <label htmlFor="nama">Nama Kelas</label>
                            <input
                                onChange={e => setKelas( { ...kelas, k_nama: e.target.value } )}
                                value={kelas.k_nama}
                                type="text"
                                maxLength="255"
                                required
                            />
                        </div>
                        <button>
                            <i className="fas fa-arrow-right"/> Kemaskini Kelas
                        </button>
                    </form>
                }
            </BoxBody>
        </Box>
    );
}

export default KelasKemaskini;