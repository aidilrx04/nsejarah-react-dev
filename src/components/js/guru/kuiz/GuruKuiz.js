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
import { API, Url, useTitle } from '../../utils';


export function GuruKuiz()
{
    useTitle( 'Pengurusan Kuiz' );

    const user = useContext( UserContext );
    let { url } = useRouteMatch();
    let [senaraiKuiz, setSenaraiKuiz] = useState( [] );



    useEffect( () =>
    {
        if ( user.data.g_jenis === 'admin' )
        {
            API.getListKuiz().then( data =>
            {
                console.log( data );
                setSenaraiKuiz( data.data.data );
            } );
        }
        else if ( user.data.g_jenis === 'guru' )
        {
            console.log( 'makku' );
            API.getKuizByGuru( user.data.g_id ).then( data =>
            {
                console.log( data );
                setSenaraiKuiz( data.data.data );
            } );
        }

        return () =>
        {
            setSenaraiKuiz( {} );
        };
    }, [user] );

    return (
        <Box.Box>
            {
                user.data.hasOwnProperty( 'g_jenis' ) &&
                <>
                    <Box.BoxHeader>
                        <i className="fas fa-book" /> Pengurusan Kuiz
                    </Box.BoxHeader>
                    <Box.BoxBody>
                        {
                            senaraiKuiz.length > 0 &&
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
                                        senaraiKuiz.map( kuiz => (
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
                                    }
                                </tbody>
                            </table>
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