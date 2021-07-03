import { useContext, useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import { Link } from "react-router-dom";
import { Box, BoxHeader, BoxBody } from "../boxes/Box";
import { UserContext } from "../contexts/UserContext";
import { API, Url, useTitle } from "../utils";


export function GuruIndex()
{
    const user = useContext( UserContext );
    let [guru, setGuru] = useState( {} );
    let [senaraiTing, setSenaraiTing] = useState( [] );
    let [senaraiKuiz, setSenaraiKuiz] = useState( [] );

    useTitle( `Laman Guru${guru.g_nama ? '(' + guru.g_nama + ')' : ''}` );


    useEffect( () =>
    {
        if ( Object.keys( user.data ).length > 0 )
        {
            setGuru( user.data );
        }
    }, [user] );

    useEffect( () =>
    {
        if ( guru.hasOwnProperty( 'g_id' ) )
        {

            API.getListTingkatanGuru( guru.g_id ).then( data =>
            {
                console.log( data );
                if ( data.success )
                {
                    setSenaraiTing( data.data.data );
                }
            } );

            API.getKuizByGuru( guru.g_id ).then( data =>
            {
                console.log( data.data );
                if ( data.success )
                {
                    setSenaraiKuiz( data.data.data );
                }
            } );
        }
    }, [guru] );

    return (
        <>
            <Box id="maklumat-guru">
                <BoxHeader>
                    <i className="fas fa-user-graduate" /> Maklumat Guru
                </BoxHeader>
                <BoxBody>
                    {
                        Object.keys( guru ).length > 0 ?
                            <div className="maklumat-guru">
                                <li>
                                    <b>ID Guru: </b> {guru.g_id}
                                </li>
                                <li>
                                    <b>No. Kad Pengenalan: </b> {guru.g_nokp}
                                </li>
                                <li>
                                    <b>Nama: </b> {guru.g_nama}
                                </li>
                                <li>
                                    <b>Status: </b> {guru.g_jenis}
                                </li>
                            </div>
                            : <div className="maklumat-guru">
                                <li>
                                    <b>ID Guru: </b> <Skeleton width="20%" />
                                </li>
                                <li>
                                    <b>No. Kad Pengenalan: </b> <Skeleton width="40%" />
                                </li>
                                <li>
                                    <b>Nama: </b> <Skeleton width="70%" />
                                </li>
                                <li>
                                    <b>Status: </b> <Skeleton width="30%" />
                                </li>
                            </div>
                    }
                </BoxBody>
            </Box>

            <Box id="maklumat-tingkatan">
                <BoxHeader>
                    <i className="fas fa-chalkboard-teacher" /> Senarai Tingkatan
                </BoxHeader>
                <BoxBody>
                    <table className="senarai-tingkatan table table-content center">
                        <thead>
                            <tr>
                                <th> Tingkatan </th>
                                <th> Kelas </th>
                                <th> Guru </th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                senaraiTing.map( ting => (
                                    <tr key={ting.kt_id}>
                                        <td> {ting.kt_ting} </td>
                                        <td> {ting.kelas.k_nama} </td>
                                        <td> {ting.guru.g_nama} </td>
                                    </tr>
                                ) )
                            }
                        </tbody>
                    </table>
                </BoxBody>
            </Box>

            <Box id="maklumat-kuiz">
                <BoxHeader>
                    <i className="fas fa-book" /> Senarai Kuiz
                </BoxHeader>
                <BoxBody>
                    <table className="senarai-kuiz table table-content center">
                        <thead>
                            <tr>
                                <th> Nama </th>
                                <th> Ting </th>
                                <th> Jenis </th>
                                <th> Tarikh </th>
                                <th> Masa </th>
                                <th> Aksi </th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                senaraiKuiz.map( kuiz => (
                                    <tr key={kuiz.kz_id}>
                                        <td> {kuiz.kz_nama} </td>
                                        <td> {kuiz.ting.kt_ting} {kuiz.ting.kelas.k_nama} </td>
                                        <td> {kuiz.kz_jenis} </td>
                                        <td> {kuiz.kz_tarikh} </td>
                                        <td> {kuiz.kz_masa ? `${kuiz.kz_masa} minit` : <i className="fas fa-minus" />} </td>
                                        <td className="table-link-container">
                                            <Link
                                                className="table-link"
                                                to={Url( `/guru/kuiz/${kuiz.kz_id}` )}
                                                title="Maklumat Kuiz"
                                            >
                                                <i className="fas fa-info-circle" />
                                            </Link>
                                            <Link
                                                className="success table-link"
                                                to={Url( `/guru/kuiz/${kuiz.kz_id}/kemaskini` )}
                                                title="Kemaskini Kuiz"
                                            >
                                                <span>
                                                    <i className="fas fa-pen" />
                                                </span>
                                            </Link>
                                            <Link
                                                className="danger table-link"
                                                to={Url( `/guru/padam?table=kuiz&col=kz_id&val=${kuiz.kz_id}` )}
                                                title="Padam Kuiz"
                                            >
                                                <i className="fas fa-trash-alt" />
                                            </Link>
                                        </td>
                                    </tr>
                                ) )
                            }
                        </tbody>
                    </table>
                </BoxBody>
            </Box>
        </>
    );
}

export default GuruIndex;