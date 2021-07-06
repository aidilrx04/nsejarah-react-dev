import
{
    useParams,
    useRouteMatch,
    Link
} from 'react-router-dom';
import
{
    useState,
    useEffect,
    Fragment
} from 'react';
import Box from '../../boxes/Box';
import { API, Url, useTitle } from '../../utils';
import ErrorBox from '../../boxes/ErrorBox';


export function GuruDetail()
{
    useTitle( 'Maklumat Guru' );

    let { idGuru } = useParams();
    let { url } = useRouteMatch();
    let [guru, setGuru] = useState( {} );
    let [tingkatan, setTingkatan] = useState( [] );
    let [senaraiKuiz, setSenaraiKuiz] = useState( [] );
    let [valid, setValid] = useState( null );

    useEffect( () =>
    {
        API.getGuru( idGuru ).then( data =>
        {
            if ( data.success )
            {
                setGuru( data.data );
                setValid( true );
            }
            else
            {
                setValid( false );

            }
        } );

        return () =>
        {
            // console.log( 'h123' );
            setGuru( {} );
            setValid( null );
        };
    }, [idGuru] );

    useEffect( () =>
    {
        if ( guru.hasOwnProperty( 'g_id' ) )
        {
            API.getListTingkatanGuru( guru.g_id ).then( data =>
            {
                if ( data.success )
                {
                    console.log( data );
                    setTingkatan( data.data.data );
                }
            } );

            API.getKuizByGuru( guru.g_id ).then( data =>
            {
                if ( data.success )
                {
                    setSenaraiKuiz( data.data.data );
                }
            } );

        }

        return () =>
        {
            setTingkatan( [] );
            setSenaraiKuiz( [] );
        };
    }, [guru] );

    return (
        <>
            {valid === true &&
                <>
                    <Box.Box>
                        <Box.BoxHeader>
                            <i className="fas fa-user-plus" /> Maklumat Guru
                        </Box.BoxHeader>
                        <Box.BoxBody>
                            <h3> {guru.g_nama} </h3>
                            <li>
                                <b>No. KP: </b>
                                <span> {guru.g_np} </span>
                            </li>
                            <li>
                                <b>Jenis: </b>
                                <span> {guru.g_jenis} </span>
                            </li>
                            <li>
                                <b>Katalaluan: </b>
                                <span> {guru.g_katalaluan} </span>
                            </li>

                            <br></br>
                            <Link to={Url( `${url}/kemaskini` )} className="link bg4">
                                <i className="fas fa-pen" /> Kemaskini
                            </Link>
                            <Link
                                to={Url( `/guru/padam?table=guru&col=g_id&val=${guru.g_id}&redir=${Url( '/guru/guru' )}` )}
                                className="link bg3"
                            >
                                <i className="fas fa-trash-alt" /> Padam
                            </Link>
                        </Box.BoxBody>
                    </Box.Box>

                    <Box.Box>
                        <Box.BoxHeader>
                            <i className="fas fa-list-ol" /> Senarai Kelas
                        </Box.BoxHeader>
                        <Box.BoxBody>
                            {
                                tingkatan.length > 0 &&
                                <>
                                    {
                                        tingkatan.map( ting => (
                                            <Fragment key={tingkatan.indexOf( ting )}>
                                                <h4 style={{ marginTop: '10px' }}> - {ting.kt_ting} {ting.kelas.k_nama}</h4>
                                                <SenaraiTingkatan ting={ting} />
                                                <hr style={{ margin: '10px 0' }} />
                                            </Fragment>
                                        ) )
                                    }
                                </>
                            }
                            {
                                tingkatan.length === 0 &&
                                <h4>Guru bukan seorang guru tingkatan</h4>
                            }
                        </Box.BoxBody>
                    </Box.Box>

                    <Box.Box>
                        <Box.BoxHeader>
                            <i className="fas fa-book" /> Senarai Kuiz
                        </Box.BoxHeader>
                        <Box.BoxBody>
                            {
                                senaraiKuiz.length > 0 &&
                                <>
                                    <h4>Senarai Kuiz</h4>
                                    <table className="table table-content center">
                                        <thead>
                                            <tr>
                                                <th>Nama Kuiz</th>
                                                <th>Tingkatan</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                senaraiKuiz.map( kuiz => (
                                                    <tr key={senaraiKuiz.indexOf( kuiz )}>
                                                        <td>
                                                            <Link
                                                                className="table-link"
                                                                to={Url( `/guru/kuiz/${kuiz.kz_id}` )}
                                                            >
                                                                {kuiz.kz_nama}
                                                            </Link>
                                                        </td>
                                                        <td> {kuiz.ting.kt_ting} {kuiz.ting.kelas.k_nama} </td>
                                                    </tr>
                                                ) )
                                            }
                                        </tbody>
                                    </table>
                                </>
                            }
                        </Box.BoxBody>
                    </Box.Box>

                </>
            }
            {
                valid === false &&
                <ErrorBox>
                    Ralat 404
                    <br />
                    Tiada data guru dijumpai
                </ErrorBox>
            }
        </>
    );
}

export function SenaraiTingkatan( { ting, ...rest } )
{
    let [senaraiMurid, setSenaraiMurid] = useState( [] );

    useEffect( () =>
    {

        API.getMuridTing( ting.kt_id ).then( data =>
        {
            if ( data.success )
            {
                console.log( data );
                setSenaraiMurid( data.data );
            }
        } );
        return () =>
        {
            setSenaraiMurid( [] );
        };
    }, [ting] );

    return (
        <>
            {
                senaraiMurid.length > 0 &&
                <table className="table table-content center">
                    <thead>
                        <tr>
                            <th>Nama Murid</th>
                            <th>No. KP</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            senaraiMurid.length > 0 &&
                            senaraiMurid.map( murid => (
                                <tr key={senaraiMurid.indexOf( murid )}>
                                    <td>
                                        <Link
                                            className="table-link"
                                            to={Url( `/guru/murid/${murid.m_id}` )}
                                        >
                                            {murid.m_nama}
                                        </Link>
                                    </td>
                                    <td> {murid.m_nokp} </td>
                                </tr>
                            ) )
                        }
                    </tbody>
                </table>
            }
            {
                senaraiMurid.length === 0 &&
                <b><em>Tiada data murid</em></b>
            }
        </>
    );
}
export default GuruDetail;