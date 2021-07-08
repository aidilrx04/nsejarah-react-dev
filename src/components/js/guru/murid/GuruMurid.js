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

export function GuruMurid( { user, ...rest } )
{
    useTitle( 'Pengurusan Murid' );

    let [senaraiMurid, setSenaraiMurid] = useState( [] );
    const [paging, setPaging, displayPaging] = usePaging( { limit: 10 } );
    let { url } = useRouteMatch();

    useEffect( () =>
    {
        return () =>
        {
            setSenaraiMurid( [] );
        };
    }, [] );

    useEffect( () =>
    {
        if ( paging.loading )
        {
            API.getListMurid( paging.limit, paging.page ).then( data =>
            {
                if ( data.success )
                {
                    setSenaraiMurid( data.data.data );
                }
                else
                {
                    setSenaraiMurid( [] );
                }

                setPaging( p =>
                {

                    p = {
                        ...p,
                        loading: false,
                    };

                    return (
                        data.success ? { ...p, ...data.data.paging } : { ...p }
                    );
                } );
            } );
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [paging] );

    return (
        <Box.Box>
            <Box.BoxHeader>
                <i className="fas fa-users" /> Pengurusan Murid
            </Box.BoxHeader>
            <Box.BoxBody>
                <h4>Senarai Murid</h4>
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
                            !paging.loading
                                ? senaraiMurid.length > 0 ? senaraiMurid.map( murid => (
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
                                                <i className="fas fa-info-circle" />
                                            </Link>
                                            <Link
                                                className="success table-link" to={Url( `${url}/${murid.m_id}/kemaskini` )}
                                                title="Kemaskini Murid"
                                            >
                                                <i className="fas fa-pen" />
                                            </Link>
                                            <Link
                                                className="danger table-link" to={Url( `/guru/padam?table=murid&col=m_id&val=${murid.m_id}&redir=${url}` )}
                                                title="Padam Murid"
                                            >
                                                <i className="fas fa-trash-alt" />
                                            </Link>

                                        </td>
                                    </tr>
                                ) ) : <tr><td colSpan="9999">Tiada data murid dijumpai</td></tr>
                                : range( paging.limit ).map( n => (
                                    <tr key={n}>
                                        <td><Skeleton /></td>
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
                    displayPaging()
                }
                <Link className="link bg5" style={{ marginTop: '10px' }} to={Url( `${url}/baru` )}>
                    <i className="fas fa-plus" /> Tambah Murid
                </Link>
            </Box.BoxBody>

        </Box.Box>
    );
}

export default GuruMurid;