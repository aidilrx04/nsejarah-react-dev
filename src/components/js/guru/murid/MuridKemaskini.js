import { useContext, useEffect, useState } from "react";
import { Redirect, useParams } from "react-router";
import { Box, BoxBody, BoxHeader } from "../../boxes/Box";
import { API, Url, useTitle } from "../../utils";
import { UserContext } from '../../contexts/UserContext';

export function MuridKemaskini()
{
    useTitle( 'Kemaskini Murid' );

    const user = useContext( UserContext );
    let { idMurid } = useParams();
    let [murid, setMurid] = useState( {} );
    let [newMurid, setNewMurid] = useState( {} );
    let [senaraiTing, setSenaraiTing] = useState( [] );
    let [disabled, setDisabled] = useState( false );
    let [redirect, setRedirect] = useState( null );


    useEffect( () =>
    {
        API.getMurid( idMurid ).then( data =>
        {
            if ( data.success )
            {
                setMurid( data.data );
                console.log( data.data );
            }
        } );

        return () =>
        {
            setSenaraiTing( [] );
        };
    }, [idMurid] );

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
    }, [murid] );

    useEffect( () =>
    {
        // console.log( newMurid )
    }, [newMurid] );

    async function handleSubmit( e )
    {
        e.preventDefault();
        setDisabled( true );

        await API.kemaskini( newMurid, user.token, 'murid' ).then( data =>
        {
            alert( 'Data berjaya dikemaskini' );
            setRedirect( `/guru/murid/${newMurid.m_id}` );
            setDisabled( false );
        } );

    }
    return (
        <Box>
            {
                redirect && <Redirect to={Url( redirect )} />
            }
            <BoxHeader>
                <i className="fas fa-user-cog" /> Kemaskini Murid
            </BoxHeader>
            <BoxBody>
                {
                    murid.hasOwnProperty( 'm_id' ) &&
                    <form onSubmit={e => handleSubmit( e )}>
                        <div className="input-container">
                            <label htmlFor="nokp">No. KP Murid</label>
                            <input
                                defaultValue={murid.m_nokp}
                                onChange={( e ) => setNewMurid( { ...newMurid, m_nokp: e.target.value } )}
                                type="text"
                                maxLength="12"
                                disabled={disabled}
                                required
                            />
                        </div>

                        <div className="input-container">
                            <label htmlFor="nama">Nama Murid</label>
                            <input
                                defaultValue={murid.m_nama}
                                onChange={( e ) => setNewMurid( { ...newMurid, m_nama: e.target.value } )}
                                type="text"
                                maxLength="50"
                                disabled={disabled}
                                required
                            />
                        </div>

                        <div className="input-container">
                            <label htmlFor="nama">Katalaluan Murid</label>
                            <input
                                defaultValue={murid.m_katalaluan}
                                onChange={( e ) => setNewMurid( { ...newMurid, m_katalaluan: e.target.value } )}
                                type="text"
                                maxLength="50"
                                disabled={disabled}
                                required
                            />
                        </div>

                        <div className="input-container">
                            <label htmlFor="kelas">Kelas Murid</label>
                            <select
                                value={newMurid.m_kelas}
                                onChange={( e ) => setNewMurid( { ...newMurid, m_kelas: e.target.value } )}
                                disabled={disabled}
                            >
                                {
                                    senaraiTing.length > 0 &&
                                    senaraiTing.map( ( ting ) => (
                                        <option key={ting.kt_id} value={ting.kt_id}>
                                            {ting.kt_ting} {ting.kelas.k_nama}
                                        </option>
                                    ) )
                                }
                            </select>
                        </div>

                        <button disabled={disabled}>
                            Kemaskini
                        </button>
                    </form>
                }
            </BoxBody>
        </Box>
    );
}

export default MuridKemaskini;