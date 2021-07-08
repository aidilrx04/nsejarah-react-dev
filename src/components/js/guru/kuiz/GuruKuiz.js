import
{
    useRouteMatch,
    Link
} from 'react-router-dom';
import
{
    useState,
    useEffect,
    useContext
} from 'react';
import { UserContext } from '../../contexts/UserContext';
import Box from '../../boxes/Box';
import { API, range, Url, usePaging, useTitle } from '../../utils';
import Skeleton from 'react-loading-skeleton';


export function GuruKuiz()
{
    useTitle( 'Pengurusan Kuiz' );

    const user = useContext( UserContext );
    let { url } = useRouteMatch();
    let [senaraiKuiz, setSenaraiKuiz] = useState( [] );
    const [paging, setPaging, displayPaging] = usePaging();

    useEffect( () =>
    {
        return () =>
        {
            setSenaraiKuiz( [] );
        };
    }, [] );

    useEffect( () =>
    {
        if ( paging.loading )
        {
            let request;
            if ( user.data.g_jenis === 'admin' )
            {
                request = API.getListKuiz( paging.limit, paging.page );
            }
            else if ( user.data.g_jenis === 'guru' )
            {
                request = API.getKuizByGuru( user.data.g_id, paging.limit, paging.page );
            }

            request.then( data =>
            {
                setSenaraiKuiz( data.success ? data.data.data : [] );
                setPaging( p =>
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
    }, [user, paging] );

    return (
        <Box.Box>
            {
                user.data.hasOwnProperty( 'g_jenis' ) &&
                <>
                    <Box.BoxHeader>
                        <i className="fas fa-book" /> Pengurusan Kuiz
                    </Box.BoxHeader>
                    <Box.BoxBody>
                        <table className="table table-content center">
                            <thead>
                                <tr>
                                    <th>Nama Kuiz</th>
                                    <th>Jenis</th>
                                    {
                                        user.data.g_jenis === 'admin'
                                        &&
                                        <>
                                            <th>Guru</th>
                                        </>
                                    }
                                    <th>Kelas</th>
                                    <th>Tarikh</th>
                                    <th>Masa</th>
                                    <th>Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    !paging.loading
                                        ? senaraiKuiz.length > 0
                                            ? senaraiKuiz.map( kuiz => (
                                                <tr key={senaraiKuiz.indexOf( kuiz )}>
                                                    <td> {kuiz.kz_nama} </td>
                                                    <td> {kuiz.kz_jenis} </td>

                                                    {
                                                        user.data.g_jenis === 'admin' &&
                                                        <td> {kuiz.guru.g_nama} </td>
                                                    }
                                                    <td> {kuiz.ting.kt_ting} {kuiz.ting.kelas.k_nama} </td>
                                                    <td> {kuiz.kz_tarikh} </td>
                                                    <td> {kuiz.kz_masa ? kuiz.kz_masa : 'Tiada'} </td>
                                                    <td className="table-link-container">
                                                        <Link
                                                            className='table-link'
                                                            to={Url( `${url}/${kuiz.kz_id}` )}
                                                            title="Maklumat Lanjut"
                                                        >
                                                            <i className="fas fa-info-circle" />
                                                        </Link>
                                                        <Link
                                                            className='success table-link'
                                                            to={Url( `${url}/${kuiz.kz_id}/kemaskini` )}
                                                            title="Kemaskini"
                                                        >
                                                            <i className="fas fa-pen" />
                                                        </Link>
                                                        <Link
                                                            className='danger table-link'
                                                            to={Url( `/guru/padam?table=kuiz&col=kz_id&val=${kuiz.kz_id}&redir=${url}` )}
                                                            title="Padam"
                                                        >
                                                            <i className="fas fa-trash-alt" />
                                                        </Link>
                                                    </td>
                                                </tr>
                                            ) )
                                            : <tr><td colSpan="9999">Tiada data dijumpai</td></tr>
                                        : range( paging.limit ).map( n => (
                                            <tr key={n}>
                                                <td> <Skeleton /> </td>
                                                <td> <Skeleton /> </td>
                                                <td> <Skeleton /> </td>
                                                <td> <Skeleton /> </td>
                                                <td> <Skeleton /> </td>
                                                <td> <Skeleton /> </td>
                                                <td> <Skeleton /> </td>
                                            </tr>
                                        ) )
                                }
                            </tbody>
                        </table>
                        {
                            displayPaging()
                        }

                        <Link to={Url( `${url}/baru` )} className="link bg5" style={{ marginTop: '10px' }}>
                            <i className="fas fa-plus" /> Tambah Kuiz
                        </Link>
                    </Box.BoxBody>
                </>
            }
        </Box.Box>
    );
}

export default GuruKuiz;