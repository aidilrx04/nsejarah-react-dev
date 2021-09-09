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

import { API, range, Url, usePaging, useTitle } from '../../utils';
import Skeleton from 'react-loading-skeleton';


export function GuruTingkatan()
{
    useTitle( 'Pengurusan Tingkatan & Kelas' );

    let { url } = useRouteMatch();
    let [ senaraiTingkatan, setSenaraiTingkatan ] = useState( [] );
    let [ senaraiKelas, setSenaraiKelas ] = useState( [] );
    const [ tPaging, setTPaging, displayTPaging ] = usePaging(); // T = Tingkatan
    const [ kPaging, setKPaging, displayKPaging ] = usePaging(); // K = Kelas

    useEffect( () =>
    {
        return () =>
        {
            setSenaraiKelas( [] );
            setSenaraiTingkatan( [] );
        };
    }, [] );

    useEffect( () =>
    {
        if ( tPaging.loading )
        {
            API.getListTingkatan( tPaging.limit, tPaging.page ).then( data =>
            {
                console.log( data );
                setSenaraiTingkatan( data.success ? data.data.data : [] );
                setTPaging( p =>
                {
                    p = {
                        ...p,
                        loading: false
                    };

                    return data.success ? { ...p, ...data.data.paging } : p;
                } );
            } );
        }



        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ tPaging ] );

    useEffect( () =>
    {
        if ( kPaging.loading )
        {
            API.getListKelas( kPaging.limit, kPaging.page ).then( data =>
            {
                setSenaraiKelas( data.success ? data.data.data : [] );
                setKPaging( p =>
                {
                    p = {
                        ...p,
                        loading: false
                    };

                    return data.success ? { ...p, ...data.data.paging } : p;
                } );
            } );
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ kPaging ] );

    return (
        <>
            <Box.Box>
                <Box.BoxHeader>
                    <i className="fas fa-list-ol" /> Tingkatan
                </Box.BoxHeader>
                <Box.BoxBody>
                    <h3>Senarai Tingkatan</h3>
                    <table className="table table-content center">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Tingkatan</th>
                                <th>Nama Tingkatan</th>
                                <th>Guru</th>
                                <th>Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                !tPaging.loading
                                    ? senaraiTingkatan.length > 0
                                        ? senaraiTingkatan.map( ting => (
                                            <tr key={ senaraiTingkatan.indexOf( ting ) }>
                                                <td> { ting.kt_id } </td>
                                                <td> { ting.kt_ting } </td>
                                                <td> { ting.kelas.k_nama } </td>
                                                <td> <Link to={ Url( `/guru/guru/${ting.guru.g_id}` ) } className="table-link">{ ting.guru.g_nama }</Link> </td>
                                                <td className="table-link-container">
                                                    <Link
                                                        className="table-link"
                                                        to={ Url( `${url}/${ting.kt_id}` ) }
                                                        title="Maklumat Tingkatan"
                                                    >
                                                        <i className="fas fa-info-circle" />
                                                    </Link>
                                                    <Link
                                                        className="success table-link"
                                                        to={ Url( `${url}/${ting.kt_id}/kemaskini` ) }
                                                        title="Kemaskini Tingkatan"
                                                    >
                                                        <i className="fas fa-pen" />
                                                    </Link>
                                                    <Link
                                                        className="danger table-link"
                                                        to={ Url( `/guru/padam?table=kelas_tingkatan&col=kt_id&val=${ting.kt_id}&redir=${url}` ) }
                                                        title="Padam Tingkatan"
                                                    >
                                                        <i className="fas fa-trash-alt" />
                                                    </Link>
                                                </td>
                                            </tr>
                                        ) )
                                        : <tr><td colSpan="99999">Tiada data dijumpai</td></tr>
                                    : range( tPaging.limit ).map( n => (
                                        <tr key={ n }>
                                            <td><Skeleton /></td>
                                            <td><Skeleton /></td>
                                            <td><Skeleton /></td>
                                            <td><Skeleton /></td>
                                        </tr>
                                    ) )
                            }
                        </tbody>
                    </table>
                    {
                        displayTPaging()
                    }
                    <Link to={ Url( `${url}/baru` ) } className="link bg5" style={ { marginTop: '10px' } }>
                        <i className="fas fa-plus" /> Tambah Tingkatan
                    </Link>
                </Box.BoxBody>
            </Box.Box>

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
                                !kPaging.loading
                                    ? senaraiKelas.length > 0
                                        ? senaraiKelas.map( kelas => (
                                            <tr key={ kelas.k_id }>
                                                <td> { kelas.k_nama } </td>
                                                <td className="table-link-container">
                                                    <Link
                                                        className="success table-link"
                                                        to={ Url( `/guru/kelas/${kelas.k_id}/kemaskini` ) }
                                                        title="Kemaskini Kelas"
                                                    >
                                                        <i className="fas fa-pen" />
                                                    </Link>
                                                    <Link
                                                        className="danger table-link"
                                                        to={ Url( `/guru/padam?table=kelas&col=k_id&val=${kelas.k_id}&redir=${url}` ) }
                                                        title="Padam Kelas"
                                                    >
                                                        <i className="fas fa-trash-alt" />
                                                    </Link>
                                                </td>
                                            </tr>
                                        ) )
                                        : <tr><td colSpan="9999">Tiada data dijumpai</td></tr>
                                    : range( kPaging.limit ).map( n => (
                                        <tr key={ n }>
                                            <td><Skeleton /></td>
                                            <td><Skeleton /></td>
                                        </tr>

                                    ) )
                            }

                        </tbody>
                    </table>
                    {
                        displayKPaging()
                    }

                    <Link to={ Url( `/guru/kelas/baru` ) } className="link bg5" style={ { marginTop: '10px' } }>
                        <i className="fas fa-plus" /> Tambah Kelas
                    </Link>
                </Box.BoxBody>
            </Box.Box>
        </>
    );
}

export default GuruTingkatan;