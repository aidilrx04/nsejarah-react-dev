import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router";
import { Box, BoxBody, BoxHeader } from "../../boxes/Box";
import { API, Url, useTitle } from "../../utils";
import { UserContext } from '../../contexts/UserContext';
import { useHistory } from "react-router-dom";
import TailSpinLoader from "../../TailSpinLoader";
import ErrorBox from "../../boxes/ErrorBox";

export function MuridKemaskini()
{
    useTitle( 'Kemaskini Murid' );

    const user = useContext( UserContext );
    let { idMurid } = useParams();
    let [ murid, setMurid ] = useState( {} );
    let [ newMurid, setNewMurid ] = useState( {} );
    let [ senaraiTing, setSenaraiTing ] = useState( [] );
    let [ disabled, setDisabled ] = useState( false );
    let [ status, setStatus ] = useState( null );
    const history = useHistory();
    const [ isLoad, setIsLoad ] = useState( false );


    useEffect( () =>
    {
        API.getMurid( idMurid ).then( data =>
        {
            if ( data.success )
            {
                setMurid( data.data );
                console.log( data.data );
            }
            setIsLoad( true );
        } );

        return () =>
        {
            setSenaraiTing( [] );
            setIsLoad( false );
        };
    }, [ idMurid ] );

    useEffect( () =>
    {
        if ( murid.hasOwnProperty( 'm_id' ) )
        {
            API.getListTingkatan( 200, 1 ).then( data =>
            {
                setSenaraiTing( data.data.data );
            } );

            setNewMurid( { ...murid } );
        }
        return () =>
        {
            setSenaraiTing( [] );
            if ( murid.hasOwnProperty( 'm_id' ) )
            {
                setMurid( {} );
            }
        };
    }, [ murid ] );

    useEffect( () =>
    {
        // console.log( newMurid )
    }, [ newMurid ] );

    async function handleSubmit( e )
    {
        e.preventDefault();
        setDisabled( true );
        setStatus( null );

        await API.kemaskini( newMurid, user.token, 'murid' ).then( data =>
        {
            if ( data.success )
            {
                alert( 'Data berjaya dikemaskini' );
                history.push( Url( `/guru/murid/${newMurid.m_id}` ) );
            }
            setStatus( data );
            setDisabled( false );
        } );

    }
    return (
        isLoad
            ?
            murid.hasOwnProperty( 'm_id' )
                ? <Box>

                    <BoxHeader>
                        <i className="fas fa-user-cog" /> Kemaskini Murid
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
                                <label htmlFor="nokp">No. KP Murid</label>
                                <input
                                    defaultValue={ murid.m_nokp }
                                    onChange={ ( e ) => setNewMurid( { ...newMurid, m_nokp: e.target.value } ) }
                                    type="text"
                                    maxLength="12"
                                    disabled={ disabled }
                                    required
                                />
                            </div>

                            <div className="input-container">
                                <label htmlFor="nama">Nama Murid</label>
                                <input
                                    defaultValue={ murid.m_nama }
                                    onChange={ ( e ) => setNewMurid( { ...newMurid, m_nama: e.target.value } ) }
                                    type="text"
                                    maxLength="50"
                                    disabled={ disabled }
                                    required
                                />
                            </div>

                            <div className="input-container">
                                <label htmlFor="nama">Katalaluan Murid</label>
                                <input
                                    defaultValue={ murid.m_katalaluan }
                                    onChange={ ( e ) => setNewMurid( { ...newMurid, m_katalaluan: e.target.value } ) }
                                    type="text"
                                    maxLength="50"
                                    disabled={ disabled }
                                    required
                                />
                            </div>

                            <div className="input-container">
                                <label htmlFor="kelas">Kelas Murid</label>
                                <select
                                    value={ newMurid.m_kelas }
                                    onChange={ ( e ) => setNewMurid( { ...newMurid, m_kelas: e.target.value } ) }
                                    disabled={ disabled }
                                >
                                    {
                                        senaraiTing.length > 0 &&
                                        senaraiTing.map( ( ting ) => (
                                            <option key={ ting.kt_id } value={ ting.kt_id }>
                                                { ting.kt_ting } { ting.kelas.k_nama }
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
                    404 Data tidak dijumpai
                </ErrorBox>
            : <TailSpinLoader />

    );
}

export default MuridKemaskini;