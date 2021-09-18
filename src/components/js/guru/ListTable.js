import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { API, rand, Url, usePaging } from "../utils";
import { useRouteMatch } from 'react-router-dom';
import Skeleton from "react-loading-skeleton";

function defautListTable()
{
    return 'no function';
}

function defaultOnEmpty()
{
    return (
        <thead>
            <tr>
                <th>Tiada data dijumpai</th>
            </tr>
        </thead>
    );
}

export function ListTable( {
    getListFunc = defautListTable, // function to get list data
    before = null, // function to apply to each data before rendering(not actually b4 render)?
    filter = null, // filter each data keys to display
    limit = 25, // limit per request
    page = 1, // page
    applyBefore = null, // multiple before functions
    adParamBefore = undefined, // additional params to apply to before function
    onEmpty = defaultOnEmpty // handle on empty fetched data
} )
{

    const [ paging, setPaging, displayPaging ] = usePaging( { limit: limit, page: page } );
    const [ listData, setListData ] = useState( [] );
    const [ copyData, setCopyData ] = useState( [] );
    let filterKeys = filter ? Object.keys( filter ) : null;
    before = [ before ];
    if ( applyBefore )
    {
        before = ( Array.isArray( before ) ? [ ...before ] : [ before ] ).concat( applyBefore );
    }
    before = before.filter( n => typeof n === 'function' );

    useEffect( () =>
    {
        return () =>
        {
            setListData( [] );
            setCopyData( [] );

        };
    }, [] );

    useEffect( () =>
    {
        setPaging( p => ( { ...p, limit: limit, page: page, loading: true } ) );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ limit, page ] );

    useEffect( () =>
    {
        if ( getListFunc === defautListTable )
        {
            getListFunc();
        }
        else 
        {
            if ( paging.loading )
            {
                console.log( 'b' );
                ( async () =>
                {
                    await fetchData();
                    //console.log( a );
                } )();
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ paging.loading, paging.limit, paging.page ] );

    useEffect( () =>
    {
        //console.log( listData );
        setCopyData( () => processList( listData, filter ) );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ listData, filter ] );

    function processList( list, filter = null )
    {

        list = list.map( item =>
        {

            if ( Array.isArray( before ) )
            {
                for ( let i = 0; i < before.length; i++ )
                {
                    //console.log( before[ i ] );
                    const cb = before[ i ];
                    item = cb( item, adParamBefore );
                }
            }

            if ( !filterKeys ) return item;

            const newItem = {};
            filterKeys.forEach( key =>
            {
                newItem[ filter[ key ] ] = item[ key ];
            } );
            return newItem;
        } );

        return list;
    }

    async function fetchData()
    {
        const result = await getListFunc( paging.limit, paging.page );
        console.log( result );
        if ( result.data && Array.isArray( result.data.data ) )
        {
            setListData( result.data.data );
            setPaging( pg =>
            {
                pg = {
                    ...pg,
                    loading: false
                };

                return result.data && result.data.paging ? { ...pg, ...result.data.paging } : pg;
            } );
        }
        else
        {
            setPaging( pg => ( { ...pg, loading: false } ) );
            if ( !onEmpty )
            {
                throw Error( 'Fetched result is not an array' );
            }
        }
    }

    return (
        <div>
            <table className="table center table-content">
                {
                    !paging.loading
                        ? listData.length > 0
                            ? <>
                                <thead>
                                    <tr>
                                        {
                                            filterKeys
                                                ? filterKeys.map( key => (
                                                    <th key={ rand() }>
                                                        { filter[ key ] }
                                                    </th>
                                                ) )
                                                : copyData.length > 0
                                                    ? Object.keys( copyData[ 0 ] ).map( key => (
                                                        <th key={ rand() }> { key } </th>
                                                    ) )
                                                    : <th>Tiada data</th>
                                        }
                                    </tr>
                                </thead>
                                <tbody >
                                    {
                                        copyData.map( data =>
                                        {
                                            return <tr key={ rand() }>
                                                {
                                                    filterKeys
                                                        ? filterKeys.map( key => (
                                                            <td key={ rand() }>
                                                                { data[ filter[ key ] ] }
                                                            </td>
                                                        ) )
                                                        : Object.keys( data ).map( ( key ) =>
                                                        {
                                                            return (
                                                                <td key={ rand() }> { typeof data[ key ] !== 'object' && data[ key ] } </td>
                                                            );
                                                        } )
                                                }
                                            </tr>;
                                        } )
                                    }
                                </tbody></>
                            : onEmpty()
                        : <>
                            <thead>
                                <tr>
                                    <th><Skeleton /></th>
                                    <th><Skeleton /></th>
                                    <th><Skeleton /></th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    [ ...Array( paging.limit ).keys() ].map( n => (
                                        <tr key={ rand() }>
                                            <td><Skeleton /></td>
                                            <td><Skeleton /></td>
                                            <td><Skeleton /></td>
                                        </tr>
                                    ) )
                                }
                            </tbody>
                        </>
                }
            </table>
            { displayPaging() }
        </div>
    );
}




// default filter for each table
const defaultFilter = {
    tingkatan: {
        kt_id: 'ID',
        kt_ting: 'Tingkatan',
        k_nama: 'Nama Tingkatan',
        g_nama: 'Nama Guru',
        aksi: 'Aksi'
    },
    kelas: {
        k_id: 'ID Kelas',
        k_nama: 'Nama Kelas',
        aksi: 'Aksi'
    },
    murid: {
        m_id: 'ID',
        m_nama: 'Nama',
        m_nokp: 'No. KP',
        nama_ting: 'Tingkatan',
        aksi: 'Aksi'
    },
    guru: {
        g_id: 'ID',
        g_nokp: 'No. KP',
        g_nama: 'Nama',
        g_katalaluan: 'Katalaluan',
        g_jenis: 'Jenis',
        aksi: 'Aksi'
    },
    kuiz: {
        kz_nama: 'Nama Kuiz',
        kz_jenis: 'Jenis',
        g_nama: 'Guru',
        nama_ting: 'Tingkatan',
        kz_tarikh: 'Tarikh',
        kz_masa: 'Tarikh',
        aksi: 'Aksi'
    }
};

// routes for admin/guru
export const ROUTES = {
    TINGKATAN: Url( '/guru/tingkatan' ),
    KELAS: Url( '/guru/kelas' ),
    MURID: Url( '/guru/murid' ),
    GURU: Url( '/guru/guru' ),
    KUIZ: Url( '/guru/kuiz' )
};

const defaultBefore = {
    tingkatan: (
        ( data ) =>
        {
            return {
                ...data,
                k_nama: data.kelas.k_nama,
                g_nama: (
                    <Link to={ `${ROUTES.GURU}/${data.guru.g_id}` } className="table-link">
                        { data.guru.g_nama }
                    </Link>
                ),
                nama_ting: data.ting,
                aksi: (
                    <div style={ { whiteSpace: 'nowrap' } }>
                        <Link
                            className="table-link"
                            to={ Url( `${ROUTES.TINGKATAN}/${data.kt_id}` ) }
                            title="Maklumat Tingkatan"
                        >
                            <i className="fas fa-info-circle" />
                        </Link>
                        <Link
                            className="success table-link"
                            to={ Url( `${ROUTES.TINGKATAN}/${data.kt_id}/kemaskini` ) }
                            title="Kemaskini Tingkatan"
                        >
                            <i className="fas fa-pen" />
                        </Link>
                        <Link
                            className="danger table-link"
                            to={ Url( `/guru/padam?table=kelas_tingkatan&col=kt_id&val=${data.kt_id}&redir=${ROUTES.TINGKATAN}` ) }
                            title="Padam Tingkatan"
                        >
                            <i className="fas fa-trash-alt" />
                        </Link>
                    </div>
                )
            };
        }
    ),
    murid: (
        ( data ) =>
        {
            return {
                ...data,
                nama_ting: (
                    <Link to={ `${ROUTES.TINGKATAN}/${data.kelas.kt_id}` } className="table-link">
                        { `${data.kelas.kt_ting} ${data.kelas.kelas.k_nama}` }
                    </Link>
                ),
                aksi: (
                    <div style={ { whiteSpace: 'nowrap' } }>
                        <Link
                            className="table-link"
                            to={ Url( `${ROUTES.MURID}/${data.m_id}` ) }
                            title="Maklumat Murid"
                        >
                            <i className="fas fa-info-circle" />
                        </Link>
                        <Link
                            className="success table-link"
                            to={ Url( `${ROUTES.MURID}/${data.m_id}/kemaskini` ) }
                            title="Kemaskini Murid"
                        >
                            <i className="fas fa-pen" />
                        </Link>
                        <Link
                            className="danger table-link"
                            to={ Url( `/guru/padam?table=murid&col=m_id&val=${data.m_id}&redir=${ROUTES.MURID}` ) }
                            title="Padam Murid"
                        >
                            <i className="fas fa-trash-alt" />
                        </Link>
                    </div>
                )
            };
        }
    ),
    kelas: (
        ( data ) =>
        {
            return {
                ...data,
                aksi: (
                    <div style={ { whiteSpace: 'nowrap' } }>

                        <Link
                            className="success table-link"
                            to={ Url( `${ROUTES.KELAS}/${data.k_id}/kemaskini` ) }
                            title="Kemaskini Kelas"
                        >
                            <i className="fas fa-pen" />
                        </Link>
                        <Link
                            className="danger table-link"
                            to={ Url( `/guru/padam?table=kelas&col=k_id&val=${data.k_id}&redir=${ROUTES.KELAS}` ) }
                            title="Padam Kelas"
                        >
                            <i className="fas fa-trash-alt" />
                        </Link>
                    </div>
                )
            };
        }
    ),
    guru: (
        ( data ) =>
        {
            return {
                ...data,
                aksi: (
                    <div style={ { whiteSpace: 'nowrap' } }>
                        <Link
                            className="table-link"
                            to={ Url( `${ROUTES.GURU}/${data.g_id}` ) }
                            title="Maklumat Guru"
                        >
                            <i className="fas fa-info-circle" />
                        </Link>
                        <Link
                            className="success table-link"
                            to={ Url( `${ROUTES.GURU}/${data.g_id}/kemaskini` ) }
                            title="Kemaskini Guru"
                        >
                            <i className="fas fa-pen" />
                        </Link>
                        <Link
                            className="danger table-link"
                            to={ Url( `/guru/padam?table=guru&col=g_id&val=${data.g_id}&redir=${ROUTES.GURU}` ) }
                            title="Padam Guru"
                        >
                            <i className="fas fa-trash-alt" />
                        </Link>
                    </div>
                )
            };
        }
    ),
    kuiz: (
        ( data ) =>
        {
            return {
                ...data,
                g_nama: data.guru.g_nama,
                nama_ting: `${data.ting.kt_id} ${data.ting.kelas.k_nama}`,
                aksi: (
                    <div style={ { whiteSpace: 'nowrap' } }>
                        <Link
                            className="table-link"
                            to={ Url( `${ROUTES.KUIZ}/${data.kz_id}` ) }
                            title="Maklumat Kuiz"
                        >
                            <i className="fas fa-info-circle" />
                        </Link>
                        <Link
                            className="success table-link"
                            to={ Url( `${ROUTES.KUIZ}/${data.kz_id}/kemaskini` ) }
                            title="Kemaskini Kuiz"
                        >
                            <i className="fas fa-pen" />
                        </Link>
                        <Link
                            className="danger table-link"
                            to={ Url( `/guru/padam?table=kuiz&col=kz_id&val=${data.kz_id}&redir=${ROUTES.KUIZ}` ) }
                            title="Padam Kuiz"
                        >
                            <i className="fas fa-trash-alt" />
                        </Link>
                    </div>
                )
            };
        }
    )
};




export function TableTingkatan( props )
{
    const { url } = useRouteMatch();
    function getTingkatan( limit, page )
    {
        return API.getListTingkatan( limit, page );
    }
    props = {
        filter: defaultFilter.tingkatan,
        before: defaultBefore.tingkatan,
        adParamBefore: { url },
        ...props
    };
    return (
        <ListTable getListFunc={ getTingkatan } { ...props } />
    );
}


// Table Kelas

export function TableKelas( props )
{
    function getKelas( limit, page )
    {
        return API.getListKelas( limit, page );
    }
    props = {
        filter: defaultFilter.kelas,
        before: defaultBefore.kelas,
        ...props
    };
    return (
        <ListTable getListFunc={ getKelas } { ...props } />
    );
}

// Table murid
export function TableMurid( props )
{
    function getMurid( limit, page )
    {
        return API.getListMurid( limit, page );
    }

    props = {
        filter: defaultFilter.murid,
        before: defaultBefore.murid,
        ...props
    };

    return (
        <ListTable getListFunc={ getMurid } { ...props } />
    );
}

// Table guru
export function TableGuru( props )
{
    function getGuru( limit, page )
    {
        return API.getListGuru( limit, page );
    }

    props = {
        filter: defaultFilter.guru,
        before: defaultBefore.guru,
        ...props
    };

    return (
        <ListTable getListFunc={ getGuru } { ...props } />
    );
}

// Table kuiz
export function TableKuiz( props )
{
    function getKuiz( limit, page )
    {
        return API.getListKuiz( limit, page );
    }

    props = {
        filter: defaultFilter.kuiz,
        before: defaultBefore.kuiz,
        ...props
    };

    return (
        <ListTable getListFunc={ getKuiz } { ...props } />
    );
}