import
{
    useRouteMatch,
    Link,
} from 'react-router-dom';
import
{
    useState,
    useEffect
} from 'react';
import Box from '../../boxes/Box';
import { API, Url, useTitle } from '../../utils';


export function GuruGuru()
{
    useTitle( 'Pengurusan Guru' );

    let { url } = useRouteMatch();
    let [senaraiGuru, setSenaraiGuru] = useState( [] );
    let [failToFetch, setFailToFetch] = useState( false );
    let [fetched, setFetched] = useState( false );

    useEffect( () =>
    {
        if ( failToFetch === false && fetched === false )
        {
            API.getGuru().then( data =>
            {
                console.log( data );
                if ( data.success === true )
                {
                    setSenaraiGuru( data.data.data );
                    setFailToFetch( false );
                    setFetched( true );
                }
                else
                {
                    setFailToFetch( true );
                }
            } );
        }
    }, [failToFetch, fetched] );

    useEffect( () =>
    {
        return () =>
        {
            setFetched( false );
            setFailToFetch( false );
            if ( senaraiGuru.length > 0 )
            {
                console.log( 'heelo' );
                setSenaraiGuru( [] );
            }
        };
    }, [senaraiGuru] );
    return (
        <Box.Box>
            <Box.BoxHeader>
                <i className="fas fa-bars" /> Pengurusan Guru
            </Box.BoxHeader>
            <Box.BoxBody>
                {
                    senaraiGuru.length > 0 &&
                    <>
                        <h4>Senarai Guru</h4>
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
                                    senaraiGuru.map( guru => (
                                        <tr key={senaraiGuru.indexOf( guru )}>
                                            <td> {guru.g_nokp} </td>
                                            <td> {guru.g_nama} </td>
                                            <td> {guru.g_katalaluan} </td>
                                            <td> {guru.g_jenis} </td>
                                            <td className="table-link-container">
                                                <Link
                                                    className="table-link"
                                                    to={Url( `${url}/${guru.g_id}` )}
                                                    title="Maklumat Guru"
                                                >
                                                    <i className="fas fa-info-circle" />
                                                </Link>
                                                <Link
                                                    className="success table-link"
                                                    to={Url( `${url}/${guru.g_id}/kemaskini` )}
                                                    title="Kemaskini Guru"
                                                >
                                                    <i className="fas fa-pen" />
                                                </Link>
                                                <Link
                                                    className="danger table-link"
                                                    to={Url( `/guru/padam?table=guru&col=g_id&val=${guru.g_id}&redir=${url}` )}
                                                    title="Padam Guru"
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
                <Link to={Url( `${url}/baru` )} className="link bg5" style={{ marginTop: '10px' }}> <i className="fas fa-plus" /> Tambah Guru </Link>
            </Box.BoxBody>
        </Box.Box>
    );
}





export default GuruGuru;