import {
    useRouteMatch,
    Link
} from 'react-router-dom';
import {
    useState,
    useEffect
} from 'react';
import Box from '../boxes/Box';
import { Url, useTitle } from '../utils';

export const muridUrl = 'http://localhost/nsejarah-react/api/murid.php';

export async function getMurid( idMurid = null )
{
    const tambahan = idMurid !== null ? `?id_murid=${idMurid}` : '';
    const request = await fetch( muridUrl + tambahan );
    const data = await request.json();

    return data;
}

export async function getMuridByTing( idTing = null )
{
    const request = await fetch( muridUrl + '?id_ting=' + idTing );
    const data = await request.json();
    return data;
}

export function GuruMurid( {user, ...rest} )
{
    useTitle( 'Pengurusan Murid' );

    let [senaraiMurid, setSenaraMurid] = useState( [] );
    let {url} = useRouteMatch();    

    useEffect( () => {
            getMurid().then(data => {
                console.log( data );
                setSenaraMurid( data.data );
            });
        return () => {
                console.log( 'hello 2' );
                setSenaraMurid( [] );
        }
    }, [] );

    return (
        <Box.Box>
            <Box.BoxHeader>
                <i className="fas fa-users"/> Pengurusan Murid
            </Box.BoxHeader>
            <Box.BoxBody>
                {
                    senaraiMurid.length > 0 &&
                    <table className="table table-content center">
                        <thead>
                            <tr>
                                <th>Nama</th>
                                <th>No. KP</th>
                                <th>Katalaluan</th>
                                <th>Tingkatan</th>
                                <th>Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                senaraiMurid.map( murid => (
                                    <tr key={senaraiMurid.indexOf( murid )} >
                                        <td> {murid.m_nama} </td>
                                        <td> {murid.m_nokp} </td>
                                        <td> {murid.m_katalaluan} </td>
                                        <td> 
                                            <Link to={Url( `/guru/tingkatan/${murid.kelas.kt_id}` )} className="table-link">
                                                {murid.kelas.kt_ting} {murid.kelas.kelas.k_nama}
                                            </Link> 
                                        </td>
                                        <td className="table-link-container">
                                            <Link
                                                className="table-link" to={Url( `${url}/${murid.m_id}` )}
                                                title="Maklumat Murid"
                                            >
                                                <i className="fas fa-info-circle"/>
                                            </Link>
                                            <Link   
                                                className="success table-link" to={Url( `${url}/${murid.m_id}/kemaskini` )}
                                                title="Kemaskini Murid"
                                            >
                                                <i className="fas fa-pen"/>
                                            </Link>
                                            <Link 
                                                className="danger table-link" to={Url( `/guru/padam?table=murid&col=m_id&val=${murid.m_id}&redir=${url}` )}
                                                title="Padam Murid"
                                            >
                                                <i className="fas fa-trash-alt"/>
                                            </Link>
                                            
                                        </td>
                                    </tr>
                                ) )
                            }
                        </tbody>
                    </table>
                }
                <Link className="link bg5" style={{marginTop: '10px'}} to={Url( `${url}/baru` )}>
                    <i className="fas fa-plus"/> Tambah Murid
                </Link>
            </Box.BoxBody>
        </Box.Box>
    );
}

export default GuruMurid;