import { useEffect, useState } from "react";
import { useParams, useRouteMatch } from "react-router";
import { Link } from "react-router-dom";
import { Box, BoxBody, BoxHeader } from "../../boxes/Box";
import ErrorBox from "../../boxes/ErrorBox";
import { API, Url, useTitle } from "../../utils";
export function TingkatanDetail()
{
    useTitle( 'Maklumat Tingkatan' );

    let { idTing } = useParams();
    let { url } = useRouteMatch();
    let [tingkatan, setTingkatan] = useState( {} );
    let [senaraiMurid, setSenaraiMurid] = useState( [] );

    useEffect( () =>
    {

        // if( !tingkatan.hasOwnProperty('kt_id') )
        // {
        API.getTingkatan( idTing ).then( data =>
        {
            if ( data.success )
            {
                console.log( data );
                setTingkatan( data.data );
            }
        } );
        // }

        return () =>
        {
            setTingkatan( {} );
        };
    }, [idTing] );

    useEffect( () =>
    {
        if ( tingkatan.hasOwnProperty( 'kt_id' ) )
        {
            API.getMuridTing( tingkatan.kt_id ).then( data =>
            {
                if ( data.success )
                {
                    console.log( data );
                    setSenaraiMurid( data.data );
                }
            } );
        }

        return () =>
        {
            if ( tingkatan.hasOwnProperty( 'kt_id' ) )
            {
                setTingkatan( {} );
            }
        };
    }, [tingkatan] );

    return (
        <>
            {
                tingkatan.hasOwnProperty( 'kt_id' ) &&
                <>
                    <Box>
                        <BoxHeader>
                            <i className="fas fa-chart-bar" /> Maklumat Tingkatan
                        </BoxHeader>
                        <BoxBody>
                            <h3> {tingkatan.kt_ting} {tingkatan.kelas.k_nama} </h3>

                            <li> <b>Tingkatan: </b> {tingkatan.kt_ting} </li>
                            <li> <b>Nama Kelas: </b> {tingkatan.kelas.k_nama} </li>
                            <li> <b>Nama Guru Tingkatan: </b> <Link className="link" to={Url( `/guru/guru/${tingkatan.guru.g_id}` )}> {tingkatan.guru.g_nama} </Link> </li>
                            <Link to={Url( `${url}/kemaskini` )} className="link bg4">
                                <i className="fas fa-pen" /> Kemaskini
                            </Link>
                            <Link
                                to={Url( `/guru/padam?table=kelas_tingkatan&col=kt_id&val=${tingkatan.kt_id}&redir=${Url( '/guru/tingkatan' )}` )}
                                className="link bg3"
                            >
                                <i className="fas fa-trash-alt" /> Padam
                            </Link>
                        </BoxBody>
                    </Box>

                    <Box>
                        <BoxHeader>
                            <i className="fas fa-list-ul" /> Senarai Murid
                        </BoxHeader>
                        <BoxBody>
                            {
                                senaraiMurid.length > 0 &&
                                <>
                                    <table className="table table-content center">
                                        <thead>
                                            <tr>
                                                <th>No. KP Murid</th>
                                                <th>Nama Murid</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                senaraiMurid.map( murid => (
                                                    <tr key={murid.m_id}>
                                                        <td> {murid.m_nokp} </td>
                                                        <td> <Link className="table-link" to={Url( `/guru/murid/${murid.m_id}` )}>{murid.m_nama}</Link> </td>
                                                    </tr>
                                                ) )
                                            }
                                        </tbody>
                                    </table>
                                </>
                            }
                            {
                                senaraiMurid.length === 0 &&
                                <h3>Tingkatan ini tidak mempunyai murid</h3>
                            }
                        </BoxBody>
                    </Box>
                </>
            }
            {
                !tingkatan.hasOwnProperty( 'kt_id' ) &&
                <ErrorBox>
                    404. YOUR MOM!
                    <br />
                    Tiada data tingkatan dijumpai
                </ErrorBox>
            }
        </>
    );
}

export default TingkatanDetail;