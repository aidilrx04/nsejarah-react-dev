import { useContext, useEffect, useState } from "react";
import { useHistory, useParams } from "react-router";
import { Box, BoxBody, BoxHeader } from "../../boxes/Box";
import ErrorBox from "../../boxes/ErrorBox";
import { UserContext } from "../../contexts/UserContext";
import TailSpinLoader from "../../TailSpinLoader";
import { API, Url, useTitle } from "../../utils";

export function KelasKemaskini()
{
    useTitle( 'Kemaskini Kelas' );

    let { idKelas } = useParams();
    let [ kelas, setKelas ] = useState( {} );
    let [ status, setStatus ] = useState( null );
    let history = useHistory();
    const user = useContext( UserContext );
    const [ isLoad, setIsLoad ] = useState( false );

    useEffect( () =>
    {
        API.getKelas( idKelas ).then( data =>
        {
            if ( data.success ) setKelas( data.data );
            console.log( data.data );
            setIsLoad( true );
        } );

        return () =>
        {
            setIsLoad( false );
            setKelas( {} );
        };
    }, [ idKelas ] );

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
        isLoad
            ? kelas.hasOwnProperty( 'k_id' )
                ? <Box>
                    <BoxHeader>
                        <i className="fas fa-pen" /> Kemaskini Kelas
                    </BoxHeader>
                    <BoxBody>
                        <form onSubmit={ e => handleSubmit( e ) }>
                            {
                                status && !status.success &&
                                <h4 className="status-fail">
                                    { status.message }
                                </h4>
                            }
                            <div className="input-container">
                                <label htmlFor="nama">Nama Kelas</label>
                                <input
                                    onChange={ e => setKelas( { ...kelas, k_nama: e.target.value } ) }
                                    value={ kelas.k_nama }
                                    type="text"
                                    maxLength="255"
                                    required
                                />
                            </div>
                            <button>
                                <i className="fas fa-arrow-right" /> Kemaskini Kelas
                            </button>
                        </form>
                    </BoxBody>
                </Box>
                : <ErrorBox>
                    404 Data tidak dijumpai
                </ErrorBox>

            : <TailSpinLoader />

    );
}

export default KelasKemaskini;