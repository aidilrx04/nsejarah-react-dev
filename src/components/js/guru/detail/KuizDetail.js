import { useContext, useEffect, useState } from "react";
import { useParams, useRouteMatch } from "react-router";
import { Link } from "react-router-dom";
import { Box, BoxBody, BoxHeader } from "../../boxes/Box";
import ErrorBox from "../../boxes/ErrorBox";
import { UserContext } from "../../contexts/UserContext";
import { KuizLeaderBoard } from "../../kuiz/Kuiz";
import { getKuiz, Url, useTitle } from "../../utils";

export function KuizDetail()
{
    useTitle( 'Maklumat Kuiz' );

    const { user } = useContext( UserContext );
    let {idKuiz} = useParams();
    let {url} = useRouteMatch();
    let [kuiz, setKuiz] = useState({});

    useEffect( () => {
        getKuiz( idKuiz ).then( data => {
            if( data.success )
            {
                console.log(data);
                setKuiz( data.data );
            }
        });

    }, [idKuiz, user]);


    return (
        <>
        {
            kuiz.hasOwnProperty('kz_id') && 
            <>
            <Box>
                <BoxHeader>
                    <i className="fas fa-book"/> Maklumat Kuiz
                </BoxHeader>
                <BoxBody>
                    <h3> {kuiz.kz_nama} </h3>
                    <li> <b>ID Kuiz: </b> {kuiz.kz_id} </li>
                    <li> <b>Nama Kuiz: </b> {kuiz.kz_name} </li>
                    <li> <b>Jenis Kuiz: </b> {kuiz.kz_jenis} </li>
                    <li> <b>Masa Kuiz: </b> {kuiz.kz_jenis === 'latihan' ? 'Tiada' : kuiz.kz_masa + ' minit'} </li>
                    {
                        user.data.hasOwnProperty( 'g_id' ) && user.data.g_jenis === 'admin' &&
                        <>
                        <li> 
                            <b>Tingkatan: </b> 
                            <Link to={Url( `/guru/tingkatan/${kuiz.kz_ting}` )} className="link"> 
                                {kuiz.ting.kt_ting} {kuiz.ting.kelas.k_nama} 
                            </Link> 
                        </li>
                        <li> 
                            <b>Guru: </b> 
                            <Link to={Url( `/guru/guru/${kuiz.guru.g_id}` )} className="link">
                                {kuiz.guru.g_nama}
                            </Link>
                        </li>
                        </>
                    }
                    {
                        user.data.hasOwnProperty('g_id') && user.data.g_jenis === 'guru' &&
                        <>
                        <li> 
                            <b>Tingkatan: </b> {kuiz.ting.kt_ting} {kuiz.ting.kelas.k_nama}    
                        </li>
                        <li> 
                            <b>Guru: </b> {kuiz.guru.g_nama}    
                        </li>
                        </>
                    }

                    <Link to={Url( `${url}/kemaskini` )} className="link bg4">
                        <i className="fas fa-pen"/> Kemaskini
                    </Link>
                    <Link className="link bg3" to={Url( `/guru/padam?table=kuiz&col=kz_id&val=${kuiz.kz_id}` )}>
                        <i className="fas fa-trash-alt"/> Padam
                    </Link>
                </BoxBody>
            </Box>

            <KuizLeaderBoard/>
            </>
        }
        {
            !kuiz.hasOwnProperty('kz_id') && 
            <ErrorBox>
                404. aasfas!
                <br/>
                Tiada data dijumpai
            </ErrorBox>
        }
        </>
    );
}


export default KuizDetail;