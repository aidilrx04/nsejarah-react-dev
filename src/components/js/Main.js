import { useState, useEffect } from 'react';
import { Box, BoxHeader, BoxBody } from './boxes/Box';
import KuizBox, { KuizBoxSkeleton } from './kuiz/KuizBox';
import UserBox from './boxes/UserBox';
// import {Link, useRouteMatch, useHistory} from 'react-router-dom';
import { API, useTitle } from './utils';
// import RandomImageBox from './boxes/RandomImageBox';
import NavigasiBox from './boxes/NavigasiBox';

function Main()
{
    useTitle( '', '' );

    return (
        <>
            <div id="mainContainer">
                <div id="main">
                    <RandomKuizBox />
                    <ListKuizBox />
                </div>
                <div id="side">
                    <NavigasiBox />
                    <UserBox redir={true} />
                </div>
            </div>
        </>
    );
}

function RandomKuizBox()
{

    let [senaraiKuiz, setSenaraiKuiz] = useState( [] );
    let [loaded, setLoaded] = useState( false );

    useEffect( () =>
    {
        load().then( () =>
        {
            setLoaded( true );
        } );

        return () =>
        {
            setSenaraiKuiz( [] );
            setLoaded( false );
        };

    }, [] );

    async function load()
    {
        const result = await API.searchKuiz( null, { limit: 2, order: 'random' } );

        if ( result.success )
        {
            setSenaraiKuiz( result.data.data );
        }

    }

    return (
        <Box>
            <BoxHeader right={
                <button
                    className="header-btn"
                    style={{ display: 'inline-block', marginLeft: 'auto', fontSize: '1em' }}
                    onClick={() =>
                    {
                        setLoaded( false );
                        load().then( () => setLoaded( true ) );
                    }}
                    disabled={!loaded}
                >
                    <i className={`fas fa-redo`} />
                </button>
            }>
                <i className="fas fa-random" /> Rawak
            </BoxHeader>
            <BoxBody>
                <div className="kuizbox-container">
                    {
                        loaded &&
                        <>
                            {senaraiKuiz.length > 0
                                ? senaraiKuiz.map( kuiz => (
                                    <KuizBox key={kuiz.kz_id} path={kuiz.kz_id} kuiz={kuiz} />
                                ) )
                                : ''}
                        </>
                    }
                    {
                        loaded === false &&
                        <>
                            <KuizBoxSkeleton />
                            <KuizBoxSkeleton />
                        </>
                    }
                </div>
            </BoxBody>
        </Box>
    );
}

function ListKuizBox()
{
    let [loaded, setLoaded] = useState( false );
    let [senaraiKuiz, setSenaraiKuiz] = useState( {} );
    let [paging, setPaging] = useState( {} );
    let [order, setOrder] = useState( 0 );
    let [sorted, setSorted] = useState( false );
    let [limit] = useState( 6 );

    useEffect( () =>
    {
        return () =>
        {
            setSenaraiKuiz( [] );
            setPaging( {} );
        };
    }, [] );


    async function load( limit = 10, page = 1 )
    {
        const data = await API.searchKuiz( null, { limit: limit, page: page } );

        if ( data.success )
        {
            senaraiKuiz = senaraiKuiz.length > 0 ? senaraiKuiz.concat( data.data.data ) : data.data.data;
            setSenaraiKuiz( [...senaraiKuiz] );
            setPaging( data.data.paging );
        }
    }
    useEffect( () =>
    {
        load( limit, 1 ).then( () =>
        {
            setLoaded( true );
        } );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [limit] );

    useEffect( () =>
    {
        if ( !sorted && senaraiKuiz.length > 0 )
        {
            const newKuiz = senaraiKuiz.sort( ( a, b ) =>
            {
                const timeA = Date.parse( a.kz_tarikh );
                const timeB = Date.parse( b.kz_tarikh );

                let status = -1;
                switch ( order )
                {
                    case 0:
                        if ( timeA < timeB ) status = 1;
                        break;
                    case 1:
                        if ( timeA > timeB ) status = 1;
                        break;
                    default:
                        status = -1;
                        break;
                }

                return status;
            } );

            setSenaraiKuiz( [...newKuiz] );
            setSorted( true );
        }
    }, [order, sorted, senaraiKuiz] );
    return (
        <Box>
            <BoxHeader right={
                <select
                    onChange={e => 
                    {
                        setOrder( parseInt( e.target.value ) );
                        setSorted( false );
                    }}
                    value={order}
                    style={{
                        padding: 0,
                        fontSize: '1em',
                        backgroundColor: 'transparent',
                        border: 'none',
                        outline: 'none',
                        color: 'white'
                    }}
                >
                    <option style={{ color: 'grey' }} disabled>Susun</option>
                    <option style={{ color: 'black' }} value={0}>Terbaru</option>
                    <option style={{ color: 'black' }} value={1}>Lama</option>
                </select>
            }>
                <i className="fas fa-book" /> Senarai Kuiz
            </BoxHeader>
            <BoxBody>
                <div className="kuizbox-container">
                    {console.log( senaraiKuiz )}
                    {
                        senaraiKuiz.length > 0
                            ? senaraiKuiz.map( kuiz => (
                                <KuizBox key={kuiz.kz_id} path={kuiz.kz_id} kuiz={kuiz} />
                            ) )
                            : loaded ? 'Tiada kuiz dijumpai' : ''
                    }
                    {
                        !loaded &&
                        <>
                            {
                                range( limit ).map( id =>
                                {
                                    return (
                                        <KuizBoxSkeleton key={id} />
                                    );
                                } )
                            }
                        </>
                    }
                </div>
                {
                    paging.hasOwnProperty( 'has_next' )
                        ? paging.has_next
                            ? <button style={{
                                display: 'block',
                                width: '100%',
                                padding: '10px'
                            }}
                                onClick={( e ) =>
                                {
                                    setLoaded( false );
                                    e.target.disabled = true;
                                    load( limit, paging.page + 1 ).then( () =>
                                    {
                                        setLoaded( true );
                                        e.target.disabled = false;
                                    } );
                                }}
                            >Muat lagi</button>
                            : null
                        : null
                }
            </BoxBody>
        </Box>
    );
}

function range( n )
{
    const arr = [];
    for ( let i = 0; i < n; i++ )
    {
        arr.push( i );
    }

    return arr;
}

export default Main;