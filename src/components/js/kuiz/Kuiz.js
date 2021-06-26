import { Box, BoxHeader, BoxBody } from '../boxes/Box';
import ErrorBox from '../boxes/ErrorBox';
import { createContext, useState, useEffect, useContext } from 'react';
import { baseUrl, getJawapanMurid, getKuiz, Url, useTitle } from '../utils';
import { Route, Switch, useHistory, useParams, useRouteMatch } from 'react-router-dom';
import { UserContext } from '../contexts/UserContext';
import JawabKuiz from './JawabKuiz';
import Ulangkaji from './Ulangkaji';
import UserBox from '../boxes/UserBox';
import NavigasiBox from '../boxes/NavigasiBox';

const KuizContext = createContext();

function Kuiz()
{
    let [kuiz, setKuiz] = useState({});
    let [valid, setValid] = useState( true );
    let {idKuiz} = useParams();

    useTitle( `${kuiz.kz_nama ? kuiz.kz_nama + ' | ' : ''} Kuiz` );

    useEffect( () => {
        getKuiz( idKuiz ).then( data => {
            if( data.success )
            {
                setKuiz( data.data );
            }
            else
            {
                setValid( false );
            }
        });

        return () => {
            setKuiz( {} );
            setValid( true );
        }
    }, [idKuiz]);

    useState( () => {
        if( kuiz.kz_nama )
        {
            let len = kuiz.kz_nama.length;
            const limit = 20;
            document.title = `${ kuiz.kz_nama.substr( 0, len > limit ? limit : len ) } | NSejarah`;
        }
    }, [kuiz]);

    return (
        <div id="mainContainer">
        {
            valid &&
            <KuizContext.Provider value={{ kuiz, setKuiz }}>
                <KuizDetail/>
            </KuizContext.Provider>
        }
        {
            !valid &&
            <ErrorBox>
                404. Tiada data dijumpai
                <br/>
                <small>Tiada data kuiz dijumpai</small>
            </ErrorBox>
        }
        </div>
    );
}

function KuizDetail()
{
    const { kuiz } = useContext( KuizContext );
    const { user } = useContext( UserContext );
    let { path, url } = useRouteMatch();
    let history = useHistory();

    let [isAnswered, setIsAnswered] = useState( checkIsAnswered().then( data => setIsAnswered( data )));

    async function checkIsAnswered()
    {
        if( Object.keys(user.data).length > 0 && kuiz.hasOwnProperty('kz_id') )
        {
            let data = await getJawapanMurid( user.data.m_id, kuiz.kz_id );
            return data.success;
        }
    }
    return (
        <Switch>
            <Route path={( `${path}/answer` )}>
                <JawabKuiz style={{width: '100%'}}/>
            </Route>

            <Route exact path={( path )}>
                <div id="main">
                <Box
                    style={{
                        width: '100%'
                    }}
                >
                    <BoxHeader>
                        <i className="fas fa-book"/> Kuiz
                    </BoxHeader>
                    <BoxBody>
                        <h2> { kuiz.kz_nama } </h2>
                        {
                            Object.keys( kuiz ).map( key => (
                                <li key={key}><b> {key}: </b> {typeof kuiz[key] !== 'object' ? kuiz[key]: ''} </li>
                            ))
                        }
                        {
                            user.jenis === 'murid' && user.data.m_kelas === kuiz.kz_ting &&
                            <>
                            {
                                isAnswered === false &&
                                <button onClick={() => {
                                    history.push( Url( `${url}/answer` ), {from: history.location})
                                }}>Jawab Kuiz</button>
                            }
                            {
                                isAnswered === true &&
                                <button onClick={ () => {
                                    history.push(Url( `${url}/ulangkaji/${user.data.m_id}` ), {from: history.location})
                                }}>
                                    Ulangkaji
                                </button>
                            }
                            </>
                        }
                    </BoxBody>
                </Box>

                <KuizLeaderBoard/>

                </div>
                <div id="side">
                    <NavigasiBox/>
                    <UserBox/>
                </div>
            </Route>

            <Route path={( `${path}/ulangkaji/:idMurid` )}>
                <div id="main">
                    <Ulangkaji/>
                </div>
                <div id="side">
                    <NavigasiBox/>
                    <UserBox/>
                </div>
            </Route>

            <Route path="*">
                <ErrorBox>
                    404. Laman tidak dijumpai
                    <br/>
                    <small>Laman yang anda cuba untuk akses tidak dijumpai</small>
                </ErrorBox>
            </Route>
            
        </Switch>
    );
}

export function KuizLeaderBoard()
{
    let { idKuiz } = useParams();
    let [kuiz, setKuiz] = useState( {} );
    let [muridJawab, setMuridJawab] = useState( [] );
    let [muridTidakJawab, setMuridTidakJawab] = useState( [] );
    let [order, setOrder] = useState( 1 );
    let [tmp, setTmp] = useState( [] );

    async function getLeaderboard( idKuiz )
    {
        const target = 'api/leaderboard.php';
        const request = await fetch( baseUrl + target + '?id=' + idKuiz);
        const data = await request.json();
        return data;
    }

    useEffect( () => {
        getKuiz( idKuiz ).then( data => {
            if( data.success ) setKuiz( data.data );
        });

        return () => {
            setKuiz( {} );
        }
    }, [idKuiz]);

    useEffect( () => {
        if( kuiz.kz_id )
        {
            getLeaderboard( kuiz.kz_id ).then( data => {
                if( data.success )
                {
                    let sorted = sortSkor( data.data.murid_jawab, 1 );
                    // console.log( data.data.murid_jawab);
                    setMuridJawab( sorted );
                    setTmp( [...sorted] );
                    setMuridTidakJawab( data.data.murid_tidak_jawab );
                }
            })
        }
    }, [kuiz]);

    useEffect( () => {
        if( muridJawab.length > 0 )
        {
            console.log( order );
            switch( order )
            {
                case 0:
                    console.log( 'terendah' );
                    setMuridJawab( [...muridJawab.reverse()] );
                    break;
                case 1:
                    setMuridJawab( [...tmp] );
                    break;
                default:
                    break;
            }
        }
        //eslint-disable-next-line
    }, [order]);

    function sortSkor(skor, order)
    {
        let newSkor = skor.sort( ( a, b ) => {
            const sA = a.skor, sB = b.skor;
            let status = -1;
            switch( order )
            {
                case 0:
                    if( sA > sB ) status = 1;
                    break;
                case 1:
                    if( sA < sB ) status = 1;
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
                    value={order}
                    onChange={e => setOrder( parseInt( e.target.value ) )}
                    style={{
                        padding: 0,
                        fontSize: '1em',
                        backgroundColor: 'transparent',
                        border: 'none',
                        outline: 'none',
                        color: 'white'
                    }}
                >
                    <option style={{color: 'grey'}} disabled>Susun</option>
                    <option style={{color: 'black'}} value={0}>Terendah</option>
                    <option style={{color: 'black'}} value={1}>Tertinggi</option>
                </select>
            }>
                <i className="fas fa-award"/> Papan Tangga(Leaderboard)
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
                                <tr key={muridJawab.indexOf( skor )}>
                                    <td> {order === 1 ? muridJawab.indexOf( skor) + 1 : muridJawab.length - muridJawab.indexOf( skor )} </td>
                                    <td> {skor.murid.m_nama} </td>
                                    <td> {skor.skor}% </td>
                                </tr>

                            ))
                        }
                        {
                            muridTidakJawab.map( murid => (
                                <tr key={murid.m_id}>
                                    <td> <i className="fas fa-minus"/> </td>
                                    <td> {murid.m_nama} </td>
                                    <td> <i className="fas fa-minus"/> </td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            </BoxBody>
        </Box>
    );
}


export default Kuiz;