import { useEffect, useState } from "react";
import { useParams, useRouteMatch } from "react-router";
import { Link } from "react-router-dom";
import { Box, BoxBody, BoxHeader } from "../../boxes/Box";
import ErrorBox from "../../boxes/ErrorBox";
import { API, Url, useTitle } from "../../utils";
import TailSpinLoader from '../../TailSpinLoader';

export function MuridDetail ()
{
    useTitle( 'Maklumat Murid' );

    let { idMurid } = useParams();
    let { url } = useRouteMatch();
    let [ murid, setMurid ] = useState( {} );
    //todo
    // let [senaraiKuiz, setSenaraiKuiz] = useState( [] );
    // let [senaraiSkor, setSenaraiSkor] = useState( [] );
    const [ isLoad, setIsLoad ] = useState( false );

    useEffect( () =>
    {
        API.getMurid( idMurid ).then( data =>
        {
            if ( data.success )
            {
                setMurid( data.data );
            }
            setIsLoad( true );
        } );

        return () =>
        {
            setIsLoad( false );
            setMurid( {} );
        }
    }, [ idMurid ] );

    useEffect( () =>
    {

        // TODO
        // if( murid.hasOwnProperty( 'm_id' ) )
        // {
        //     getKuizByTing( murid.m_kelas ).then( data => {
        //         if( data.success )
        //         {
        //             setSenaraiKuiz( data.data );
        //         }
        //     } );
        // }

    }, [ murid ] );
    //todo
    // useEffect(() => {
    //     if( senaraiKuiz.length > 0 && murid.hasOwnProperty('m_id') )
    //     {
    //         for( let i = 0; i < senaraiKuiz.length; i++ )
    //         {
    //             getJawapanMurid(murid.m_id, senaraiKuiz[i].kz_id).then( data => {
    //                 if( data.success )
    //                 {
    //                     console.log( senaraiKuiz[i].kz_id )
    //                     console.log( data );
    //                 }
    //             });
    //         }
    //     }

    //     return () => {
    //         if( senaraiKuiz.length > 0 )
    //         {
    //             setSenaraiKuiz([]);
    //         }
    //     }
    // }, [senaraiKuiz, murid]);

    return (
        <>
            {
                isLoad
                    ? murid.hasOwnProperty( 'm_id' )
                        ? <>
                            <Box>
                                <BoxHeader>
                                    <i className="fas fa-user" /> Maklumat Murid
                                </BoxHeader>
                                <BoxBody>
                                    <h3> { murid.m_nama } </h3>
                                    <li> <b>ID Murid: </b> { murid.m_id } </li>
                                    <li> <b>Nama Murid: </b> { murid.m_nama } </li>
                                    <li> <b>No. KP Murid: </b> { murid.m_nokp } </li>
                                    <li> <b>Katalaluan Murid: </b> { murid.m_katalaluan } </li>
                                    <li> <b>Kelas Murid: </b> <Link className="link" to={ Url( `/guru/tingkatan/${murid.kelas.kt_id}` ) }> { murid.kelas.kt_ting } { murid.kelas.kelas.k_nama } </Link> </li>
                                    <li> <b>Guru Kelas: </b> <Link className="link" to={ Url( `/guru/guru/${murid.kelas.guru.g_id}` ) }> { murid.kelas.guru.g_nama } </Link> </li>

                                    <Link to={ Url( `${url}/kemaskini` ) } className="link bg4">
                                        <i className="fas fa-pen" /> Kemaskini
                                    </Link>
                                    <Link
                                        to={ Url( `/guru/padam?table=murid&col=m_id&val=${murid.m_id}&redir=${Url( '/guru/murid' )}` ) }
                                        className="link bg3"
                                    >
                                        <i className="fas fa-trash-alt" /> Padam
                                    </Link>
                                </BoxBody>
                            </Box>
                            {/* //todo */ }
                            {/* <Box>
            <BoxHeader>
                <i className="fas fa-book"/> Kuiz yang dijawab
            </BoxHeader>
        </Box> */}
                        </>
                        : <ErrorBox>
                            404. Makkau
                            <br />
                            Tiada murid dengan { idMurid } dijumpai
                        </ErrorBox>
                    : <TailSpinLoader />
            }
        </>
    );
}

export default MuridDetail;