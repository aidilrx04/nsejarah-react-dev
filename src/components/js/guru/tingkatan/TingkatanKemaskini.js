import { useContext, useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { Box, BoxBody, BoxHeader } from "../../boxes/Box";
import ErrorBox from "../../boxes/ErrorBox";
import { UserContext } from "../../contexts/UserContext";
import { API, Url, useTitle } from "../../utils";
import TailSpinLoader from '../../TailSpinLoader';

export function TingkatanKemaskini()
{
    useTitle( 'Kemaskini Tingkatan' );

    const user = useContext( UserContext );
    let { idTing } = useParams();
    let [ tingkatan, setTingkatan ] = useState( {} );
    let [ newTingkatan, setNewTingkatan ] = useState( {} );
    let [ senaraiGuru, setSenaraiGuru ] = useState( [] );
    let [ senaraiKelas, setSenaraiKelas ] = useState( [] );
    let [ disabled, setDisabled ] = useState( false );
    let [ status, setStatus ] = useState( null );
    const history = useHistory();
    const [ isLoad, setIsLoad ] = useState( false );

    useEffect( () =>
    {
        API.getTingkatan( idTing ).then( data =>
        {
            if ( data.success )
            {
                console.log( data.data );
                setTingkatan( data.data );
                setNewTingkatan( data.data );
            }
            setIsLoad( true );
        } );
    }, [ idTing ] );

    useEffect( () =>
    {
        if ( tingkatan.hasOwnProperty( 'kt_id' ) )
        {
            API.getListGuru( 200, 1 ).then( data =>
            {
                if ( data.success )
                {
                    setSenaraiGuru( data.data.data );
                }
            } );

            API.getListKelas( 200, 1 ).then( data =>
            {
                if ( data.success )
                {
                    setSenaraiKelas( data.data.data );
                }
            } );
        }
    }, [ tingkatan ] );

    async function handleSubmit( e )
    {
        e.preventDefault();
        setDisabled( true );
        setStatus( null );

        API.kemaskini( newTingkatan, user.token, 'tingkatan' ).then( data =>
        {
            if ( data.success )
            {
                alert( 'Tingkatan berjaya dikemaskini' );
                history.push( Url( `/guru/tingkatan/${data.data.kt_id}` ) );
            }
            setDisabled( false );
            setStatus( data );
        } );
    }

    return (
        <>
            {
                isLoad
                    ? tingkatan.hasOwnProperty( 'kt_id' )
                        ? <Box>
                            <BoxHeader>
                                <i className="fas fa-pen" /> Kemaskini Tingkatan
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
                                        <label htmlFor="ting">Tingkatan: </label>
                                        <input
                                            onChange={ ( e ) => setNewTingkatan( { ...newTingkatan, kt_ting: e.target.value } ) }
                                            type="number"
                                            id="ting"
                                            min="1"
                                            max="5"
                                            defaultValue={ newTingkatan.kt_ting }
                                            required
                                            disabled={ disabled }
                                        />
                                    </div>

                                    <div className="input-container">
                                        <label htmlFor="guru">Guru Tingkatan: </label>
                                        <select
                                            id="guru"
                                            onChange={ ( e ) => setNewTingkatan( { ...newTingkatan, kt_guru: e.target.value } ) }
                                            value={ newTingkatan.kt_guru }
                                            disabled={ disabled }
                                        >
                                            {
                                                senaraiGuru.map( guru => (
                                                    <option key={ guru.g_id } value={ guru.g_id }>
                                                        { guru.g_nama }({ guru.g_id })
                                                    </option>
                                                ) )
                                            }
                                        </select>
                                    </div>

                                    <div className="input-container">
                                        <label htmlFor="kelas">Nama Kelas: </label>
                                        <select
                                            value={ newTingkatan.kt_kelas }
                                            onChange={ e => setNewTingkatan( { ...newTingkatan, kt_kelas: e.target.value } ) }
                                            id="kelas"
                                            disabled={ disabled }
                                        >
                                            {
                                                senaraiKelas.map( kelas => (
                                                    <option key={ kelas.k_id } value={ kelas.k_id }>
                                                        { kelas.k_nama }
                                                    </option>
                                                ) )
                                            }
                                        </select>
                                    </div>

                                    <button disabled={ disabled }>
                                        <i className="fas fa-arrow-right" /> Kemaskini
                                    </button>
                                </form>
                            </BoxBody>
                        </Box>
                        : <ErrorBox>
                            404. NYEH!
                            <br />
                            Tiada data dijumpai
                        </ErrorBox>
                    : <TailSpinLoader />
            }
        </>
    );
}

export default TingkatanKemaskini;