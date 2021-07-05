// cipta murid baru components

import { useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { Box, BoxBody, BoxHeader } from "../../boxes/Box";
import { UserContext } from "../../contexts/UserContext";
import { API, Url, useTitle } from "../../utils";

const template = {
    m_id: '0',
    m_nokp: '',
    m_nama: '',
    m_katalaluan: '',
    m_kelas: ''
};

export function MuridBaru()
{
    useTitle( 'Tambah Murid' );

    let [murid, setMurid] = useState( () => template );
    let [senaraiTing, setSenaraiTing] = useState( [] );
    const user = useContext( UserContext );
    let [status, setStatus] = useState( null );
    let history = useHistory();

    useEffect( () =>
    {
        API.getListTingkatan().then( data =>
        {
            console.log( data );
            if ( data.success )
            {
                setMurid( murid => ( { ...murid, m_kelas: data.data.data[0].kt_id } ) );
                setSenaraiTing( data.data.data );
            }
        } );
    }, [] );

    useEffect( () =>
    {
        console.log( murid );
    }, [murid] );

    function handleSubmit( e )
    {
        e.preventDefault();

        API.baru( murid, user.token, 'murid' ).then( data =>
        {
            if ( data.success )
            {
                history.push( Url( `/guru/murid/${data.data.m_id}` ) );
            }
            setStatus( data );
        } );
    }
    return (
        <Box id="murid-baru">
            <BoxHeader>
                <i className="fas fa-user-plus" /> Tambah Murid Baru
            </BoxHeader>
            <BoxBody>
                <form onSubmit={e => handleSubmit( e )}>
                    {
                        status && !status.success &&
                        <h4 className="status-fail">
                            {status.message}
                        </h4>
                    }
                    <div className="input-container">
                        <label htmlFor="nama">Nama Murid</label>
                        <input
                            value={murid.m_nama}
                            onChange={e => setMurid( { ...murid, m_nama: e.target.value } )}
                            id="nokp"
                            type="text"
                            maxLength="255"
                            required
                        />
                    </div>

                    <div className="input-container">
                        <label htmlFor="nokp">No. Kad Pengenalan Murid</label>
                        <input
                            value={murid.m_nokp}
                            onChange={e => setMurid( { ...murid, m_nokp: e.target.value } )}
                            type="text"
                            id="nokp"
                            maxLength="12"
                            minLength="12"
                            required
                        />
                    </div>

                    <div className="input-container">
                        <label htmlFor="katalaluan">Katalaluan</label>
                        <input
                            value={murid.m_katalaluan}
                            onChange={e => setMurid( { ...murid, m_katalaluan: e.target.value } )}
                            type="text"
                            id="katalaluan"
                            required
                        />
                    </div>

                    <div className="input-container">
                        <label htmlFor="ting">Tingkatan</label>
                        <select
                            id="ting"
                            value={murid.m_kelas}
                            onChange={e => setMurid( { ...murid, m_kelas: e.target.value } )}
                        >
                            {
                                senaraiTing.map( ting => (
                                    <option key={ting.kt_id} value={ting.kt_id}> {ting.kt_ting} {ting.kelas.k_nama} </option>
                                ) )
                            }
                        </select>
                    </div>

                    <button>
                        Tambah Murid
                    </button>
                </form>
            </BoxBody>
        </Box>
    );
}

export default MuridBaru;