import { useEffect, useState } from 'react';
import { Box, BoxHeader, BoxBody } from '../../boxes/Box';
import { baru, getKelas, useTitle } from '../../utils';
import { getGuru } from '../GuruGuru';

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
    let [senaraiKelas, setSenaraiKelas ] = useState([]);
    let [senaraiGuru, setSenaraiGuru] = useState([]);

    useEffect( () => {
        getKelas().then( data => {
            if( data.success )
            {
                setSenaraiKelas( data.data );
            }
        });

        getGuru().then( data => {
            if( data.success ) 
            {
                setSenaraiGuru( data.data );
            }
        })
    }, []);

    useEffect( () => {
        console.log( tingkatan );
    }, [tingkatan])

    function submitTingkatan( e )
    {
        e.preventDefault();
        
        baru( tingkatan, 'token_here', 'tingkatan' ).then( data => {
            console.log( data );
        })
    }
    return (
        <Box>
            <BoxHeader>
                <i className="fas fa-plus"/> Tingkatan Baru
            </BoxHeader>
            <BoxBody>
                <form onSubmit={e => submitTingkatan( e )}>
                    <div classNAme='input-container'>
                        <label htmlFor="ting">Tingkatan</label>
                        <input 
                            type="number" 
                            id="id" 
                            min="1" 
                            value={tingkatan.kt_ting} 
                            onChange={ e => setTingkatan( { ...tingkatan, kt_ting: e.target.value } ) }
                            required
                        />
                    </div>

                    <div className="input-container">
                        <label htmlFor="kelas">Nama Kelas</label>
                        <select 
                            id="kelas" 
                            value={tingkatan.kt_kelas} 
                            onChange={ e => setTingkatan( { ...tingkatan, kt_kelas: e.target.value} ) } 
                        >
                            {
                                senaraiKelas.map( kelas => (
                                    <option key={kelas.k_id} value={kelas.k_id}> { kelas.k_nama } </option>
                                ))
                            }
                        </select>
                    </div>

                    <div className="input-container">
                        <label htmlFor="guru">Guru Tingkatan</label>
                        <select
                            id="guru"
                            value={tingkatan.kt_guru}
                            onChange={ e => setTingkatan( { ...tingkatan, kt_guru: e.target.value})}
                        >
                            {
                                senaraiGuru.map( guru => (
                                    <option key={guru.g_id} value={guru.g_id}> {guru.g_nama} </option>
                                ))
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