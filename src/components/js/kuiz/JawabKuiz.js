import { createContext, useContext, useEffect, useState } from 'react';
import { useHistory, useParams, useRouteMatch } from 'react-router-dom';
import { Box, BoxHeader, BoxBody } from '../boxes/Box';
import { API, Url, useTitle } from '../utils';
import { UserContext } from '../contexts/UserContext';
import Skeleton from 'react-loading-skeleton';
import Loader from 'react-loader-spinner';

const JawabKuizContext = createContext();

function JawabKuiz( props )
{
    let [kuiz, setKuiz] = useState( {} );
    let { idKuiz } = useParams();
    let [currentSoalan, setCurrentSoalan] = useState( 0 );
    let [valid, setValid] = useState( false );
    const user = useContext( UserContext );
    let history = useHistory();

    useTitle( `Jawab ${kuiz.kz_nama ? kuiz.kz_nama : 'Kuiz'}` );

    useEffect( () =>
    {
        API.getKuiz( idKuiz ).then( data =>
        {
            if ( data.success )
            {
                setKuiz( data.data );
            }
        } );
    }, [idKuiz] );

    //prevent user from answering kuiz many times
    useEffect( () =>
    {
        if ( user.data )
        {
            API.getJawapanMurid( user.data.m_id, kuiz.kz_id ).then( data =>
            {
                if ( data.success )
                {
                    //redirect
                    // console.log( Url( `/kuiz/${idKuiz}/ulangkaji/${user.data.m_id}` ) );
                    history.push( Url( `/kuiz/${idKuiz}/ulangkaji/${user.data.m_id}` ) );
                }
                else
                {
                    setValid( true );
                }
            } );
        }
    }, [kuiz, user, idKuiz, history] );

    useEffect( () =>
    {
        // return () => {
        //     if( kuiz.kz_id )
        //     {
        //         if( kuiz.kz_id )
        //         {
        //             setKuiz(  )
        //         }
        //     }
        // }
    }, [kuiz] );

    return (
        valid ? <JawabKuizContext.Provider value={{ kuiz, setKuiz, currentSoalan, setCurrentSoalan }}>
            <Jawab {...props}></Jawab>
        </JawabKuizContext.Provider> : null
    );
}

function Jawab( props )
{
    const { kuiz, setKuiz, currentSoalan, setCurrentSoalan } = useContext( JawabKuizContext );
    let [soalan, setSoalan] = useState( {} );
    let [disabled, setDisabled] = useState( false );
    // let [status, setStatus] = useState( null );
    const user = useContext( UserContext );
    let [masa, setMasa] = useState( null );
    let [timer, setTimer] = useState( '00:00' );
    let [delay, setDelay] = useState( 5 );
    let history = useHistory();

    useEffect( () =>
    {
        if ( kuiz.soalan )
        {
            setSoalan( kuiz.soalan[currentSoalan] );
        }
        return () =>
        {
            setSoalan( {} );
        };
    }, [kuiz, currentSoalan] );
    // useEffect( () => {
    //     if( kuiz.kz_masa !== null && kuiz.kz_masa !== 0 && masa === null )
    //     {
    //         if( kuiz.kz_masa !== 0 || kuiz.kz_masa !== null )
    //         {
    //             // console.log( parseInt( kuiz.kz_masa ) );
    //             setMasa( parseInt( kuiz.kz_masa ) * 60 );
    //         }
    //     }
    // }, [kuiz]);

    useEffect( () =>
    {
        if ( delay > 0 && soalan.hasOwnProperty( 's_id' ) )
        {
            setTimeout( () =>
            {
                setDelay( --delay );
            }, 1000 );
        }
        else
        {
            if ( isNaN( kuiz.kz_masa ) === false && kuiz.kz_masa !== null && masa === null )
            {
                setMasa( parseInt( kuiz.kz_masa ) * 60 );
            }
        }
    }, [delay, kuiz, masa, soalan] );

    useEffect( () =>
    {
        if ( masa !== null )
        {
            if ( masa > 0 )
            {
                let minit = parseInt( masa / 60 );
                let saat = parseInt( masa % 60 );

                minit = minit < 10 ? `0${minit}` : minit;
                saat = saat < 10 ? `0${saat}` : saat;

                // console.log( masa );

                masa--;

                setTimeout( () =>
                {
                    setMasa( parseInt( masa ) );
                }, 1000 );
                if ( !isNaN( minit ) && !isNaN( saat ) )
                {
                    // console.log( minit );

                    setTimer( `${minit}:${saat}` );
                }
            }
            else
            {
                //submit kuiz automatically
                submitJawapanMurid();
            }
        }
        //eslint-disable-next-line
    }, [masa] );

    function clickJawapan( idJawapan )
    {
        setDisabled( true );
        soalan.jawapan_murid = idJawapan;
        kuiz.soalan[currentSoalan] = soalan;

        setKuiz( { ...kuiz } );
        console.log( kuiz );
        setTimeout( () =>
        {
            if ( currentSoalan + 1 === kuiz.soalan.length )
            {
                submitJawapanMurid();
            }
            else
            {
                setCurrentSoalan( currentSoalan + 1 );
                setDisabled( false );
            }
        }, 2 * 1000 );
    }
    function countBetul()
    {
        const soalan = kuiz.soalan;
        let betul = 0;
        for ( let i = 0; i < soalan.length; i++ )
        {
            if ( soalan[i].jawapan_murid )
            {
                if ( soalan[i].jawapan_murid === soalan[i].jawapan_betul.j_id )
                {
                    betul++;
                }
            }
        }

        return betul;
    }
    async function submitJawapanMurid()
    {
        const target = '/api/jawab.php';
        const request = await fetch( API.API_URL + target, {
            method: 'POST',
            headers:
            {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                'Authorization': `Bearer ${user.token}`
            },
            body: JSON.stringify( { data: kuiz } )
        } );

        const data = await request.json();
        if ( data.success )
        {
            console.log( data );
            history.push( Url( `/kuiz/${kuiz.kz_id}/ulangkaji/${user.data.m_id}` ) );
        }
    }
    return (
        kuiz.hasOwnProperty( 'kz_id' ) ?
            <Box {...props} id="JawabKuiz">
                {console.log( kuiz )}
                <BoxHeader right={
                    kuiz ? <div style={{ display: 'flex', fontSize: '1.2em', color: '#fefefe' }}>
                        <span
                            className="color1"
                            style={{ color: "white", margin: '0 5px' }}
                        >
                            <i className="fas fa-question" /> {kuiz.soalan ? kuiz.soalan.length : 0}
                        </span>
                        <span
                            className="color"
                            style={{ margin: '0 5px' }}
                        >
                            <i className="fas fa-check" /> {kuiz.soalan ? countBetul() : 0}
                        </span>
                        <span
                            style={{ color: 'white', margin: '0 5px' }}
                        >
                            <i className="far fa-clock" /> {
                                kuiz.kz_masa
                                    ? timer
                                    : <i className="fas fa-minus" />
                            }
                        </span>
                    </div> : ''
                }>
                    <i className="fas fa-book" /> {kuiz.kz_nama}
                </BoxHeader>
                <BoxBody className="kuiz-content">
                    {
                        soalan.hasOwnProperty( 's_id' ) &&
                        <>
                            {
                                delay > 0 &&
                                <div className="soalan-status" style={{ background: "#000000ee", color: "#fefefe" }}>
                                    <span style={{ fontSize: '60px' }}> {delay} </span>
                                </div>
                            }
                            <div className="soalan-teks">
                                {soalan.s_teks}
                                {
                                    soalan.s_gambar !== null &&
                                    <img className="soalan-gambar" src={soalan.s_gambar} alt="" />
                                }

                                {
                                    soalan.jawapan_murid &&
                                    <p className="soalan-status">
                                        {
                                            soalan.jawapan_murid === soalan.jawapan_betul.j_id
                                                ? <span className="soalan-status-betul">
                                                    BETUL <i className="fas fa-check" />
                                                </span>
                                                : <span className="soalan-status-salah shake">
                                                    SALAH <i className="fas fa-times" />
                                                </span>
                                        }
                                    </p>
                                }
                            </div>
                            <div className="soalan-jawapan-container">
                                {
                                    soalan.jawapan.map( jawapan => (
                                        <button
                                            className={`soalan-jawapan ${soalan.jawapan_murid
                                                ? jawapan.j_id === soalan.jawapan_betul.j_id || jawapan.j_id === soalan.jawapan_murid
                                                    ? 'jawapan'
                                                    : 'jawapan-x'
                                                : ''
                                                } ${soalan.jawapan_murid
                                                    ? soalan.jawapan_betul.j_id === jawapan.j_id
                                                        ? 'jawapan-betul'
                                                        : 'jawapan-salah'
                                                    : ''
                                                }`}
                                            key={jawapan.j_id}
                                            onClick={() => clickJawapan( jawapan.j_id )}
                                            // style={{ display: soalan.jawapan_murid
                                            //                   ? jawapan.j_id === soalan.jawapan_betul.j_id || jawapan.j_id === soalan.jawapan_murid
                                            //                     ? 'initial'
                                            //                     : 'none'
                                            //                   : 'initial',
                                            //          background: soalan.jawapan_murid ? soalan.jawapan_betul.j_id === jawapan.j_id ? 'green' : 'red' : "normal" }}
                                            disabled={disabled}
                                        > {jawapan.j_teks} </button>
                                    ) )
                                }
                            </div>
                        </>
                    }
                </BoxBody>
            </Box>
            :
            <Box id="JawabKuiz">
                <BoxHeader right={
                    <div style={{ display: 'flex', fontSize: '1.2em', color: '#fefefe' }}>
                        <span
                        >
                            <i className="fas fa-question" /> <Skeleton width="25px" />
                        </span>
                        <span
                            style={{ margin: '0 5px' }}
                        >
                            <i className="fas fa-check" /> <Skeleton width="25px" />
                        </span>
                        <span
                            style={{ color: 'white', margin: '0 5px' }}
                        >
                            <i className="far fa-clock" /> <Skeleton width="25px" />
                        </span>
                    </div>
                }>
                    <i className="fas fa-book" /> <Skeleton width="250px" style={{ maxWidth: '100%' }} />
                </BoxHeader>
                <BoxBody className="kuiz-content" style={{ minHeight: '400px' }}>
                    <div className="soalan-status" style={{ background: "#000000ee", color: "#fefefe" }}>
                        <Loader type="TailSpin" color="#fefefe" />
                    </div>
                </BoxBody>
            </Box>
    );
}

export default JawabKuiz;;;;