import { useContext, useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import { Link } from "react-router-dom";
import { Box, BoxHeader, BoxBody } from "../boxes/Box";
import { UserContext } from "../contexts/UserContext";
import { API, range, Url, usePaging, useTitle } from "../utils";


export function GuruIndex()
{
    const user = useContext( UserContext );
    let [guru, setGuru] = useState( {} );
    let [senaraiTing, setSenaraiTing] = useState( [] );
    let [senaraiKuiz, setSenaraiKuiz] = useState( [] );
    const [tPaging, setTPaging, displayTPaging] = usePaging(); // Tingaktan
    const [kPaging, setKPaging, displayKPaging] = usePaging(); // Kuiz


    useTitle( `Laman Guru${guru.g_nama ? '(' + guru.g_nama + ')' : ''}` );


    useEffect( () =>
    {
        return () =>
        {
            setGuru( {} );
            setSenaraiKuiz( [] );
            setSenaraiTing( [] );
        };
    }, [] );
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

            if ( tPaging.loading )
            {
                API.getListTingkatanGuru( guru.g_id, tPaging.limit, tPaging.page ).then( data =>
                {
                    setSenaraiTing( data.success ? data.data.data : [] );
                    setTPaging( p =>
                    {
                        p = { ...p, loading: false };
                        return data.success ? { ...p, ...data.data.paging } : p;
                    } );
                } );
            }


        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [guru, tPaging] );

    useEffect( () =>
    {
        if ( guru.hasOwnProperty( 'g_id' ) )
        {
            if ( kPaging.loading )
            {
                API.getKuizByGuru( guru.g_id, kPaging.limit, kPaging.page ).then( data =>
                {
                    setSenaraiKuiz( data.success ? data.data.data : [] );
                    setKPaging( p =>
                    {
                        p = { ...p, loading: false };
                        return data.success ? { ...p, ...data.data.paging } : p;
                    } );
                } );
            }
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [guru, kPaging] );

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
                                !tPaging.loading
                                    ? senaraiTing.length > 0
                                        ? senaraiTing.map( ting => (
                                            <tr key={ting.kt_id}>
                                                <td> {ting.kt_ting} </td>
                                                <td> {ting.kelas.k_nama} </td>
                                                <td> {ting.guru.g_nama} </td>
                                            </tr>
                                        ) )
                                        : <tr><td colSpan="99999">Guru tidak mengajar sebagai guru tingkatan</td></tr>
                                    : range( tPaging.limit ).map( n => (
                                        <tr key={n}>
                                            <td><Skeleton /></td>
                                            <td><Skeleton /></td>
                                            <td><Skeleton /></td>
                                        </tr>
                                    ) )
                            }
                        </tbody>
                    </table>
                    {displayTPaging()}
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
                                !kPaging.loading
                                    ? senaraiKuiz.length > 0
                                        ? senaraiKuiz.map( kuiz => (
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
                                        : <tr><td colSpan="9999">Guru belum lagi membuat kuiz</td></tr>
                                    : range( kPaging.limit ).map( n => (
                                        <tr key={n}>
                                            <td><Skeleton /></td>
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
                    {displayKPaging()}
                </BoxBody>
            </Box>
        </>
    );
}

export default GuruIndex;