import { useState, useEffect } from 'react';
import {Box, BoxHeader, BoxBody} from './boxes/Box';
import KuizBox from './kuiz/KuizBox';
import UserBox from './boxes/UserBox';
import Spinner from './Spinner';
// import {Link, useRouteMatch, useHistory} from 'react-router-dom';
import { searchKuiz, useTitle } from './utils';
// import RandomImageBox from './boxes/RandomImageBox';
import NavigasiBox from './boxes/NavigasiBox';

//css
import '../css/Main.scss';
import '../css/Button.scss';

function Main()
{
    useTitle( '', '' );

    return (
        <>
            <div id="mainContainer">
                <div id="main">
                    <RandomKuizBox/>
                    <ListKuizBox/>
                </div>
                <div id="side">
                    <NavigasiBox/>
                    <UserBox redir={true}/>
                    {/* <RandomImageBox/> */}
                </div>
            </div>
        </>
    );
}
function ListKuizBox()
{
    let [init, setInit] = useState( true );
    let [loaded, setLoaded] = useState( false );
    let [loading, setLoading] = useState( false );
    let [next, setNext] = useState( true );
    let [kuiz, setKuiz] = useState( async () => await load() );
    let [order, setOrder] = useState(0);
    let [sorted, setSorted] = useState( false );
    // let {path, url} = useRouteMatch();
    // let history = useHistory();

    async function load()
    {
        setLoading( true );

        let kuizData = await searchKuiz( null, { limit: 6, offset: init ? 0 : kuiz.length } );
        let data = init ? kuizData.data : kuiz.concat(kuizData.data);
        setKuiz( data );
        setNext( kuizData.hasNext );
        setLoaded( true );
        setLoading( false );
        setInit( false );
        setSorted( false );
    };

    let spinner = <Spinner/>

    useEffect( () => {
        if(kuiz.length > 0 && sorted === false)
        {
            let newKuiz = kuiz.sort( ( kuizA, kuizB ) => {
                const timeA = Date.parse( kuizA.kz_tarikh ),
                      timeB = Date.parse( kuizB.kz_tarikh );
                    
                let status = -1;
                switch( order )
                {
                    case 0:
                        if( timeA < timeB ) status = 1;
                        break;
                    case 1:
                        if( timeA > timeB ) status = 1;
                        break;
                    default:
                        status = -1;
                        break;  
                }

                return status;
            });

            setKuiz( [ ...newKuiz ] );

            setSorted( true );
        }
    }, [order, kuiz, init, sorted]);

    function changeOrder(newOrder)
    {
        setSorted( false);
        setOrder( newOrder );
    }

    // ? TO-dO: FIX REDIRECTING USER TO KUIZ PAGE - [/]
    return (
    <>
        <Box id="senarai-kuiz" /* style={{position: 'relative'}} */>
            <BoxHeader
                right={
                    <select 
                        onChange={e => changeOrder( parseInt( e.target.value ) )} 
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
                        <option style={{color: 'grey'}} disabled>Susun</option>
                        <option style={{color: 'black'}} value={0}>Terbaru</option>
                        <option style={{color: 'black'}} value={1}>Lama</option>
                    </select>
                }
            >
                <i className="fas fa-book"/> Senarai Kuiz
            </BoxHeader>
            <BoxBody>
                <div className='kuizbox-container'>
                    { kuiz.length > 0 && kuiz.map( k => 
                        <KuizBox 
                            key={k.kz_id} 
                            kuiz={k}
                        /> ) }
                
                </div>
                { !loaded && spinner }
                { loaded && next && 
                <button 
                    onClick={load} 
                    disabled={loading}
                > 
                    <Spinner text='Muat lagi...' spin={loading}/> 
                </button> }
            </BoxBody>
        </Box>
    </>
    );
}

function RandomKuizBox()
{
    let [loaded, setLoaded] = useState( false );
    let [loading, setLoading] = useState( false );
    let [kuiz, setKuiz] = useState( async () => await loadRandom() );

    async function loadRandom()
    {
        setLoading( true );
        let data = await searchKuiz(null, {limit: 2, order: 'random'});
        if( data.success )
        {
            setKuiz( data.data );
        }
        setLoading( false );
        setLoaded( true );
    }

    let spinner = <Spinner/>;

    return (
        <>
            <Box id="random">
                <BoxHeader 
                    right={
                        <button 
                            className="header-btn" 
                            style={{display: 'inline-block', marginLeft: 'auto', fontSize: '1em'}}
                            onClick={loadRandom}
                            disabled={loading}
                        >
                            <i className={`fas fa-redo ${loading ? 'fa-spin' : ''}`}/>
                        </button>
                    }> 
                    <i className="fas fa-random"/> Random
                </BoxHeader>
                <BoxBody>
                    <div className="kuizbox-container">
                        {kuiz.length > 0 && kuiz.map( k => 
                            <KuizBox 
                                path={k.kz_id} 
                                key={k.kz_id} 
                                kuiz={k}
                            >
                            </KuizBox> )}
                    </div>
                    { !loaded && spinner }
                    {/* { loaded && 
                        <button 
                            disabled={loading} 
                            onClick={ loadRandom }
                        > 
                            <Spinner text='Memuat' spin={loading}/> 
                        </button> } */}
                </BoxBody>
            </Box>
        </>
    );
}

export default Main;