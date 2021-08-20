import { Box, BoxHeader, BoxBody } from '../boxes/Box';
import { UserContext } from '../contexts/UserContext';
import Skeleton from 'react-loading-skeleton';
import { useHistory, useRouteMatch, useParams } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import { API, Url } from '../utils';



function KuizDetail()
{
    const { idKuiz } = useParams();
    const [ kuiz, setKuiz ] = useState( {} );
    const user = useContext( UserContext );
    let { url } = useRouteMatch();
    let history = useHistory();
    // eslint-disable-next-line no-unused-vars
    const [ isLoad, setIsLoad ] = useState( false );

    let [ isAnswered, setIsAnswered ] = useState( checkIsAnswered().then( data => setIsAnswered( data ) ) );


    useEffect( () =>
    {
        API.getKuiz( idKuiz ).then( data =>
        {
            if ( data.success )
            {
                setKuiz( data.data );
            }
            setIsLoad( true );
        } );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ idKuiz ] );

    async function checkIsAnswered()
    {
        if ( Object.keys( user.data ).length > 0 && kuiz.hasOwnProperty( 'kz_id' ) )
        {
            let data = await API.getJawapanMurid( user.data.m_id, kuiz.kz_id );
            return data.success;
        }
    }
    return (
        <>
            <Box
                style={ {
                    width: '100%'
                } }
            >
                <BoxHeader>
                    <i className="fas fa-book" /> Kuiz
                </BoxHeader>
                <BoxBody>
                    {
                        kuiz.hasOwnProperty( 'kz_id' ) ?
                            <>
                                <h2> { kuiz.kz_nama } </h2>
                                <p>
                                    <b>ID: </b> { kuiz.kz_id } <br />
                                    <b>Nama Kuiz: </b> { kuiz.kz_nama } <br />
                                    <b>Guru: </b> { kuiz.guru.g_nama } <br />
                                    <b>Jenis: </b> { kuiz.kz_jenis } <br />
                                    <b>Tarikh: </b> { kuiz.kz_tarikh } <br />
                                    <b>Masa: </b> { kuiz.kz_masa ? kuiz.kz_masa : 'Tiada' } <br />

                                </p>

                                {
                                    user.jenis === 'murid' && user.data.m_kelas === kuiz.kz_ting &&
                                    <>
                                        {
                                            isAnswered === false &&
                                            <button
                                                className="link bg4"
                                                // style={ { color: '#fefefe' } }
                                                onClick={ () =>
                                                {
                                                    history.push( Url( `${url}/answer` ), { from: history.location } );
                                                } }>Jawab Kuiz</button>
                                        }
                                        {
                                            isAnswered === true &&
                                            <button
                                                className="link bg2"
                                                // style={ { color: '#fefefe' } }
                                                onClick={ () =>
                                                {
                                                    history.push( Url( `${url}/ulangkaji/${user.data.m_id}` ), { from: history.location } );
                                                } }>
                                                Ulangkaji
                                            </button>
                                        }
                                    </>
                                }
                            </>
                            : <>
                                <h2>
                                    <Skeleton />
                                </h2>
                                <p>
                                    <Skeleton width="100px" /> <br />
                                    <Skeleton width="300px" /> <br />
                                    <Skeleton width="240px" /> <br />
                                    <Skeleton width="160px" /> <br />
                                    <Skeleton width="140px" /> <br />
                                    <Skeleton width="110px" /> <br />
                                </p>
                            </>
                    }
                </BoxBody>
            </Box>

            <KuizLeaderBoard />
        </>

    );
}

export function KuizLeaderBoard()
{
    let { idKuiz } = useParams();
    let [ kuiz, setKuiz ] = useState( {} );
    let [ muridJawab, setMuridJawab ] = useState( [] );
    let [ muridTidakJawab, setMuridTidakJawab ] = useState( [] );
    let [ order, setOrder ] = useState( 1 );
    let [ tmp, setTmp ] = useState( [] );
    let [ loaded, setLoaded ] = useState( false );

    useEffect( () =>
    {
        API.getKuiz( idKuiz ).then( data =>
        {
            if ( data.success ) setKuiz( data.data );
        } );

        return () =>
        {
            setKuiz( {} );
        };
    }, [ idKuiz ] );

    useEffect( () =>
    {
        if ( kuiz.kz_id )
        {
            API.getLeaderboard( kuiz.kz_id ).then( data =>
            {
                if ( data.success )
                {
                    console.log( data );
                    let sorted = sortSkor( data.data.murid_jawab, 1 );
                    // console.log( data.data.murid_jawab);
                    setMuridJawab( sorted );
                    setTmp( [ ...sorted ] );
                    setMuridTidakJawab( data.data.murid_tidak_jawab );
                }
                setLoaded( true );
            } );
        }
    }, [ kuiz ] );

    useEffect( () =>
    {
        if ( muridJawab.length > 0 )
        {
            console.log( order );
            switch ( order )
            {
                case 0:
                    console.log( 'terendah' );
                    setMuridJawab( [ ...muridJawab.reverse() ] );
                    break;
                case 1:
                    setMuridJawab( [ ...tmp ] );
                    break;
                default:
                    break;
            }
        }
        //eslint-disable-next-line
    }, [ order ] );

    function sortSkor( skor, order )
    {
        let newSkor = skor.sort( ( a, b ) =>
        {
            const sA = a.skor, sB = b.skor;
            let status = -1;
            switch ( order )
            {
                case 0:
                    if ( sA > sB ) status = 1;
                    break;
                case 1:
                    if ( sA < sB ) status = 1;
                    break;
                default:
                    break;
            }

            return status;
        } );

        return newSkor;
    }
    return (
        <Box id="kuiz-leaderboard">
            <BoxHeader right={
                <select
                    value={ order }
                    onChange={ e => setOrder( parseInt( e.target.value ) ) }
                    style={ {
                        padding: 0,
                        fontSize: '1em',
                        backgroundColor: 'transparent',
                        border: 'none',
                        outline: 'none',
                        color: 'white'
                    } }
                >
                    <option style={ { color: 'grey' } } disabled>Susun</option>
                    <option style={ { color: 'black' } } value={ 0 }>Terendah</option>
                    <option style={ { color: 'black' } } value={ 1 }>Tertinggi</option>
                </select>
            }>
                <i className="fas fa-award" /> Papan Tangga(Leaderboard)
            </BoxHeader>
            <BoxBody>
                <table className="table table-content center">
                    <thead>
                        <tr>
                            <th> Tangga </th>
                            <th> Nama Murid </th>
                            <th> Skor </th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            muridJawab.map( skor => (
                                <tr key={ muridJawab.indexOf( skor ) }>
                                    <td> { order === 1 ? muridJawab.indexOf( skor ) + 1 : muridJawab.length - muridJawab.indexOf( skor ) } </td>
                                    <td> { skor.murid.m_nama } </td>
                                    <td> { skor.skor }% </td>
                                </tr>

                            ) )
                        }
                        {
                            muridTidakJawab.map( murid => (
                                <tr key={ murid.m_id }>
                                    <td> <i className="fas fa-minus" /> </td>
                                    <td> { murid.m_nama } </td>
                                    <td> <i className="fas fa-minus" /> </td>
                                </tr>
                            ) )
                        }

                        {
                            !loaded &&
                            <>
                                <tr>
                                    <td><Skeleton /></td>
                                    <td><Skeleton /></td>
                                    <td><Skeleton /></td>
                                </tr>
                                <tr>
                                    <td><Skeleton /></td>
                                    <td><Skeleton /></td>
                                    <td><Skeleton /></td>
                                </tr>
                                <tr>
                                    <td><Skeleton /></td>
                                    <td><Skeleton /></td>
                                    <td><Skeleton /></td>
                                </tr>
                            </>
                        }
                    </tbody>
                </table>
            </BoxBody>
        </Box>
    );
}

export default KuizDetail;