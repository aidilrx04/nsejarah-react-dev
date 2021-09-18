import
{
    useRouteMatch,
    Link,
} from 'react-router-dom';
import Box from '../../boxes/Box';
import { Url, useTitle } from '../../utils';
import { TableGuru } from '../ListTable';


export function GuruGuru()
{
    useTitle( 'Pengurusan Guru' );

    let { url } = useRouteMatch();
<<<<<<< HEAD
=======
    let [ senaraiGuru, setSenaraiGuru ] = useState( [] );
    const [ paging, setPaging, displayPaging ] = usePaging();

    useEffect( () =>
    {
        return () =>
        {
            setSenaraiGuru( () => [] );
        };
    }, [] );


    useEffect( () =>
    {
        if ( paging.loading )
        {
            API.getListGuru( paging.limit, paging.page ).then( data =>
            {
                console.log( data );
                if ( data.success === true )
                {
                    setSenaraiGuru( data.data.data );
                }
                else
                {
                    setSenaraiGuru( [] );
                }
                setPaging( p =>
                {
                    p = { ...p, loading: false };
                    return data.success ? ( { ...p, ...data.data.paging } ) : ( { ...p } );
                } );
            } );
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ paging ] );
>>>>>>> 6cd14c27e2c480d6a9ba7a25be44d891d2b4ed7e

    return (
        <Box.Box>
            <Box.BoxHeader>
                <i className="fas fa-bars" /> Pengurusan Guru
            </Box.BoxHeader>
            <Box.BoxBody>

                <h4>Senarai Guru</h4>
<<<<<<< HEAD
                <TableGuru limit={ 10 } />

=======
                <table className="table table-content center">
                    <thead>
                        <tr>
                            <th>No. KP</th>
                            <th>Nama</th>
                            <th>Katalaluan</th>
                            <th>Jenis</th>
                            <th>Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            ( !paging.loading )
                                ? senaraiGuru.length > 0
                                    ? senaraiGuru.map( guru => (
                                        <tr key={ senaraiGuru.indexOf( guru ) }>
                                            <td> { guru.g_nokp } </td>
                                            <td> { guru.g_nama } </td>
                                            <td> { guru.g_katalaluan } </td>
                                            <td> { guru.g_jenis } </td>
                                            <td className="table-link-container">
                                                <Link
                                                    className="table-link"
                                                    to={ Url( `${url}/${guru.g_id}` ) }
                                                    title="Maklumat Guru"
                                                >
                                                    <i className="fas fa-info-circle" />
                                                </Link>
                                                <Link
                                                    className="success table-link"
                                                    to={ Url( `${url}/${guru.g_id}/kemaskini` ) }
                                                    title="Kemaskini Guru"
                                                >
                                                    <i className="fas fa-pen" />
                                                </Link>
                                                <Link
                                                    className="danger table-link"
                                                    to={ Url( `/guru/padam?table=guru&col=g_id&val=${guru.g_id}&redir=${url}` ) }
                                                    title="Padam Guru"
                                                >
                                                    <i className="fas fa-trash-alt" />
                                                </Link>

                                            </td>
                                        </tr>
                                    ) )
                                    : <tr>
                                        <td colSpan="99999">
                                            Tiada data dijumpai
                                        </td>
                                    </tr>
                                : <>
                                    {
                                        range( paging.limit ).map( n => (
                                            <tr key={ n }>
                                                <td><Skeleton /></td>
                                                <td><Skeleton /></td>
                                                <td><Skeleton /></td>
                                                <td><Skeleton /></td>
                                                <td><Skeleton /></td>
                                            </tr>
                                        ) )
                                    }
                                </>
                        }
                    </tbody>
                </table>
                {
                    displayPaging()
                }
>>>>>>> 6cd14c27e2c480d6a9ba7a25be44d891d2b4ed7e
                <div style={ { marginTop: '10px' } }>
                    <Link to={ Url( `${url}/baru` ) } className="link bg5"> <i className="fas fa-plus" /> Tambah Guru </Link>
                    <Link to={ Url( `${url}/import` ) } className="link bg5" > <i className="fas fa-upload" /> Import Data Guru </Link>
                </div>
            </Box.BoxBody>
        </Box.Box >
    );
}


export default GuruGuru;