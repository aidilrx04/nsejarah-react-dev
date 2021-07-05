import { useContext, useEffect, useState } from 'react';
import { Box, BoxHeader, BoxBody } from '../../boxes/Box';
import { API, Url, useTitle } from '../../utils';
import { UserContext } from '../../contexts/UserContext';
import { useHistory } from 'react-router-dom';

export function TingkatanBaru()
{
    useTitle( 'Tambah Tingkatan' );

    let [tingkatan, setTingkatan] = useState( {
        "kt_id": "123",
        "kt_ting": "1",
        "kt_kelas": "",
        "kt_guru": ""
    }
    );
    let [senaraiKelas, setSenaraiKelas] = useState( [] );
    let [senaraiGuru, setSenaraiGuru] = useState( [] );
    let [status, setStatus] = useState( null );
    const user = useContext( UserContext );
    const history = useHistory();

    useEffect( () =>
    {

        API.getListKelas( 10000 ).then( data =>
        {
            if ( data.success )
            {
                setSenaraiKelas( data.data.data );
                // set default kelas to first result in data
                setTingkatan( ting => ( { ...ting, kt_kelas: data.data.data[0].k_id.toString() } ) );
            }
        } );

        API.getListGuru( 10000 ).then( data =>
        {
            if ( data.success ) 
            {
                setSenaraiGuru( data.data.data );
                // set default kelas to first result in data
                setTingkatan( ting => ( { ...ting, kt_guru: data.data.data[0].g_id.toString() } ) );
            }
        } );

        return () =>
        {
            setSenaraiGuru( () => [] );
            setSenaraiKelas( () => [] );
            setStatus( null );
        };
    }, [] );

    useEffect( () =>
    {
        console.log( tingkatan );
    }, [tingkatan] );

    function submitTingkatan( e )
    {
        e.preventDefault();
        setStatus( null );

        API.baru( tingkatan, user.token, 'tingkatan' ).then( data =>
        {
            if ( data.success )
            {
                history.push( Url( `/guru/tingkatan/${data.data.kt_id}` ) );
            }
            setStatus( data );
        } );
    }
    return (
        <Box>
            <BoxHeader>
                <i className="fas fa-plus" /> Tingkatan Baru
            </BoxHeader>
            <BoxBody>
                {
                    status && !status.success &&
                    <h4 className="status-fail">
                        {status.message}
                    </h4>
                }
                <form onSubmit={e => submitTingkatan( e )}>
                    <div className='input-container'>
                        <label htmlFor="ting">Tingkatan</label>
                        <input
                            type="number"
                            id="id"
                            min="1"
                            value={tingkatan.kt_ting}
                            onChange={e => setTingkatan( { ...tingkatan, kt_ting: e.target.value } )}
                            required
                        />
                    </div>

                    <div className="input-container">
                        <label htmlFor="kelas">Nama Kelas</label>
                        <select
                            id="kelas"
                            value={tingkatan.kt_kelas}
                            onChange={e => setTingkatan( { ...tingkatan, kt_kelas: e.target.value } )}
                        >
                            {
                                senaraiKelas.map( kelas => (
                                    <option key={kelas.k_id} value={kelas.k_id}> {kelas.k_nama} </option>
                                ) )
                            }
                        </select>
                    </div>

                    <div className="input-container">
                        <label htmlFor="guru">Guru Tingkatan</label>
                        <select
                            id="guru"
                            value={tingkatan.kt_guru}
                            onChange={e => setTingkatan( { ...tingkatan, kt_guru: e.target.value } )}
                        >
                            {
                                senaraiGuru.map( guru => (
                                    <option key={guru.g_id} value={guru.g_id}> {guru.g_nama} </option>
                                ) )
                            }
                        </select>
                    </div>

                    <button>Submit</button>
                </form>
            </BoxBody>
        </Box>
    );
}

export default TingkatanBaru;