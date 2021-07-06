import
{
    useRouteMatch,
    Link
} from 'react-router-dom';
import
{
    useState,
    useEffect
} from 'react';

import Box from '../../boxes/Box';

import { API, Url, useTitle } from '../../utils';


export function GuruTingkatan()
{
    useTitle( 'Pengurusan Tingkatan & Kelas' );

    let { url } = useRouteMatch();
    let [senaraiTingkatan, setSenaraiTingkatan] = useState( [] );
    let [senaraiKelas, setSenaraiKelas] = useState( [] );
    //eslint-disable-next-line
    let [failed, setFailed] = useState( false );



    useEffect( () =>
    {
        // if( senaraiTingkatan.length === 0 && failed === false )
        // {
        API.getListTingkatan( 200, 1 ).then( data =>
        {
            if ( data.success )
            {
                setSenaraiTingkatan( data.data.data );
            }
            else
            {
                setFailed( true );
            }
        } );

        API.getListKelas().then( data =>
        {
            console.log( data );
            if ( data.success )
            {
                setSenaraiKelas( data.data.data );
            }
        } );

        return () =>
        {
            setFailed( false );
            setSenaraiTingkatan( [] );
            setSenaraiKelas( [] );
        };
    }, [] );

    return (
        <>
            <Box.Box>
                <Box.BoxHeader>
                    <i className="fas fa-list-ol" /> Tingkatan
                </Box.BoxHeader>
                <Box.BoxBody>
                    {
                        senaraiTingkatan.length > 0 &&
                        <>
                            <h3>Senarai Tingkatan</h3>
                            <table className="table table-content center">
                                <thead>
                                    <tr>
                                        <th>Tingkatan</th>
                                        <th>Nama Tingkatan</th>
                                        <th>Guru</th>
                                        <th>Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        senaraiTingkatan.map( ting => (
                                            <tr key={senaraiTingkatan.indexOf( ting )}>
                                                <td> {ting.kt_ting} </td>
                                                <td> {ting.kelas.k_nama} </td>
                                                <td> <Link to={Url( `/guru/guru/${ting.guru.g_id}` )} className="table-link">{ting.guru.g_nama}</Link> </td>
                                                <td className="table-link-container">
                                                    <Link
                                                        className="table-link"
                                                        to={Url( `${url}/${ting.kt_id}` )}
                                                        title="Maklumat Tingkatan"
                                                    >
                                                        <i className="fas fa-info-circle" />
                                                    </Link>
                                                    <Link
                                                        className="success table-link"
                                                        to={Url( `${url}/${ting.kt_id}/kemaskini` )}
                                                        title="Kemaskini Tingkatan"
                                                    >
                                                        <i className="fas fa-pen" />
                                                    </Link>
                                                    <Link
                                                        className="danger table-link"
                                                        to={Url( `/guru/padam?table=kelas_tingkatan&col=kt_id&val=${ting.kt_id}&redir=${url}` )}
                                                        title="Padam Tingkatan"
                                                    >
                                                        <i className="fas fa-trash-alt" />
                                                    </Link>
                                                </td>
                                            </tr>
                                        ) )
                                    }
                                </tbody>
                            </table>
                        </>
                    }
                    <Link to={Url( `${url}/baru` )} className="link bg5" style={{ marginTop: '10px' }}>
                        <i className="fas fa-plus" /> Tambah Tingkatan
                    </Link>
                </Box.BoxBody>
            </Box.Box>

            {
                senaraiKelas.length > 0 &&
                <Box.Box>
                    <Box.BoxHeader>
                        <i className="fas fa-list-ul" /> Pengurusan Kelas
                    </Box.BoxHeader>
                    <Box.BoxBody>
                        <h3>Senarai Kelas</h3>
                        <table className="table table-content center">
                            <thead>
                                <tr>
                                    <th>Nama Kelas</th>
                                    <th>Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    senaraiKelas.map( kelas => (
                                        <tr key={kelas.k_id}>
                                            <td> {kelas.k_nama} </td>
                                            <td className="table-link-container">
                                                <Link
                                                    className="success table-link"
                                                    to={Url( `/guru/kelas/${kelas.k_id}/kemaskini` )}
                                                    title="Kemaskini Kelas"
                                                >
                                                    <i className="fas fa-pen" />
                                                </Link>
                                                <Link
                                                    className="danger table-link"
                                                    to={Url( `/guru/padam?table=kelas&col=k_id&val=${kelas.k_id}&redir=${url}` )}
                                                    title="Padam Kelas"
                                                >
                                                    <i className="fas fa-trash-alt" />
                                                </Link>
                                            </td>
                                        </tr>
                                    ) )
                                }
                            </tbody>
                        </table>

                        <Link to={Url( `/guru/kelas/baru` )} className="link bg5" style={{ marginTop: '10px' }}>
                            <i className="fas fa-plus" /> Tambah Kelas
                        </Link>
                    </Box.BoxBody>
                </Box.Box>
            }
        </>
    );
}

export default GuruTingkatan;