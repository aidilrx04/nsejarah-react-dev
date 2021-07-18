import { useContext, useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { API, shuffle, Url } from '../utils';
import TailSpinLoader from '../TailSpinLoader';
import ErrorBox from '../boxes/ErrorBox';
import { UserContext } from '../contexts/UserContext';
import { Box, BoxBody, BoxHeader } from "../boxes/Box";
import Soalan from './Soalan';

export default function JawabKuiz()
{
    const user = useContext( UserContext );
    const { idKuiz } = useParams();
    const [ kuiz, setKuiz ] = useState( {} );
    const [ status, setStatus ] = useState( null );
    const history = useHistory();

    useEffect( () =>
    {
        console.log( kuiz );
    }, [ kuiz ] );

    useEffect( () =>
    {
        if ( user.loggedin )
        {
            API.getKuiz( idKuiz ).then( data =>
            {
                if ( data.success )
                {
                    // check if user has already answer the kuiz
                    API.getJawapanMurid( user.data.m_id, data.data.kz_id ).then( res =>
                    {
                        if ( res.success )
                        {
                            // user already answered, redirect
                            history.push( Url( `/kuiz/${idKuiz}/ulangkaji/${user.data.m_id}` ) );
                        }
                        else
                        {
                            // user has not answer yet

                            // check kelas
                            // if not same, then no permisiion
                            if ( data.data.kz_ting === user.data.m_kelas )
                            {
                                // the class is same
                                // ? shuffle kuiz soalan here
                                shuffle( data.data.soalan );
                                setKuiz( data.data );
                                setStatus( data );
                            }
                            else
                            {
                                setStatus( {
                                    code: '403',
                                    message: 'Tiada Akses',
                                } );
                            }
                        }
                    } );
                }
                else
                {
                    setStatus( data );
                }
            } );
        }
        else
        {
            setStatus( {
                code: '401',
                message: 'Tiada akses. Sila log masuk untuk menjawab kuiz ini'
            } );
        }

        return () =>
        {
            setKuiz( {} );
            setStatus( null );
        };
    }, [ idKuiz, user, history ] );

    return (
        status
            ? status.success
                ? <DisplayKuiz kuizObj={ { kuiz, setKuiz } } />
                : <ErrorBox>
                    { status.code } { status.message }
                </ErrorBox>
            : <TailSpinLoader />
    );
}

function DisplayKuiz( { kuizObj } )
{
    const { kuiz, setKuiz } = kuizObj;
    const [ currentSoalan, setCurrentSoalan ] = useState( 0 );
    const [ senaraiSoalan, setSenaraiSoalan ] = useState( () => kuiz.soalan );
    const [ status, setStatus ] = useState( null );
    const [ delay ] = useState( 2 ); // in seconds
    const user = useContext( UserContext );
    const history = useHistory();
    const [ startDelay, setStartDelay ] = useState( 3 ); // in second
    const [ seconds, setSeconds ] = useState( () =>
    {
        return kuiz.kz_masa ? parseInt( kuiz.kz_masa ) * 60 : null;
    } );
    const [ timeFormat, setTimeFormat ] = useState( '00:00' );
    const [ start, setStart ] = useState( false );

    useEffect( () =>
    {
        return () =>
        {
            setCurrentSoalan( 0 );
            setSenaraiSoalan( [] );
            setStatus( null );
        };
    }, [] );

    useEffect( () =>
    {
        console.log( startDelay );
        // use -1 because at second 0, the status will pop as 'Mula!'
        if ( startDelay > -1 && startDelay !== null )
        {
            setStatus(
                {
                    message: startDelay === 0 ? 'MULA!' : startDelay,
                    code: 0
                }
            );
            setTimeout( () =>
            {
                setStartDelay( sd => --sd );
                setStatus( null );
            }, 1000 );
        }
        else
        {
            setStatus( null );
            setStartDelay( null );
            setStart( true );
        }
    }, [ startDelay ] );


    useEffect( () =>
    {
        let minit = parseInt( seconds / 60 );
        let saat = parseInt( seconds % 60 );

        if ( saat < 10 ) saat = '0' + saat;
        if ( minit < 10 ) minit = '0' + minit;
        if ( start )
        {
            if ( seconds !== null )
            {
                if ( seconds >= 0 )
                {
                    setTimeFormat( `${minit}:${saat}` );
                    setTimeout( () =>
                    {
                        setSeconds( s => --s );
                    }, 1000 );
                }
                else
                {
                    // times up 
                    // force submit jawapan
                    setStatus( {
                        message: <><i className="far fa-clock" /> Masa Tamat!</>,
                        code: 0
                    } );
                    setTimeout( () =>
                    {
                        submitJawapanMurid();
                    }, delay * 1000 );
                }
            }
        }
        else
        {
            setTimeFormat( `${minit}:${saat}` );
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ seconds, start, delay ] );

    function updateSoalan( updatedSoalan )
    {
        senaraiSoalan[ currentSoalan ] = updatedSoalan;
        setSenaraiSoalan( [ ...senaraiSoalan ] );

        const correct = updatedSoalan.jawapan_murid === updatedSoalan.jawapan_betul.j_id;
        console.log( correct );
        setStatus( {
            message: correct ? "BETUL ✔" : <>SALAH <i className="fas fa-times" /></>,
            code: correct
        } );

        setKuiz( { ...kuiz, soalan: senaraiSoalan } );

        setStart( false );
        setTimeout( () =>
        {
            // check if soalan is the last one,
            // if it is, then submit the answer
            // else increment currentSoalan
            if ( currentSoalan === senaraiSoalan.length - 1 )
            {
                console.log( 'hello' );
                setStatus( {
                    message: "Selesai 👌",
                    code: 0
                } );

                setTimeout( () =>
                {
                    //submit jawapan-murid
                    submitJawapanMurid();

                }, delay * 1000 );
            }
            else
            {
                setStart( true );
                setCurrentSoalan( cs => cs + 1 );
                setStatus( null );
            }

        }, delay * 1000 );
    }


    async function submitJawapanMurid()
    {
        setStatus( {
            message: <><i className="fas fa-spinner fa-spin" /> Memuat...</>,
            code: null
        } );
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
            setStatus( {
                message: <>
                    Berjaya <i className="fas fa-check" />
                </>,
                code: true
            } );
            setTimeout( () =>
            {
                history.push( Url( `/kuiz/${kuiz.kz_id}/ulangkaji/${user.data.m_id}` ) );
            }, delay * 1000 );
        }
    }

    return (
        <Box id="JawabKuiz">
            <BoxHeader right={
                <div className="status" style={ {
                    display: 'flex',
                    color: '#fefefe'
                } }>
                    <span className="jumlah-soalan" style={ { margin: '0 5px' } }>
                        <i className="fas fa-question" /> { kuiz.soalan.length }
                    </span>
                    <span className="jumlah-betul" style={ { margin: '0 5px' } }>
                        <i className="fas fa-check" /> {
                            Array.isArray( kuiz.soalan )
                                ? kuiz.soalan.reduce( ( accum, soalan ) =>
                                {
                                    // count soalan betul
                                    if ( soalan.jawapan_murid )
                                    {
                                        if ( soalan.jawapan_murid === soalan.jawapan_betul.j_id )
                                        {
                                            return accum + 1;
                                        }
                                    }

                                    return accum + 0;
                                }, 0 )
                                : 0
                        }
                    </span>
                    <span className="masa" style={ { margin: '0 5px' } }>
                        <i className="far fa-clock" /> {
                            kuiz.kz_masa ? timeFormat : <i className="fas fa-minus" />
                        }
                    </span>
                </div>
            }>
                <i className="fas fa-book" /> { kuiz.kz_nama }
            </BoxHeader>
            <BoxBody style={ { padding: '0', position: 'relative' } }>
                {
                    status !== null
                        ? <div
                            className="status"
                            style={ {
                                position: 'absolute',
                                zIndex: '5',
                                fontSize: '50px',
                                fontWeight: 'bold',
                                textAlign: 'center',
                                width: '100%',
                                height: '100%',
                                background: '#00000055',
                            } }>
                            <span style={ {
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                transform: 'translate(-50%,-50%)',
                                color: status.code === 0 || status.code === null
                                    ? '#fefefe'
                                    : status.code
                                        ? '#29b134'
                                        : '#ff0000'
                            } }>
                                { status.message }
                            </span>
                        </div>
                        : null
                }
                <Soalan
                    soalan={ senaraiSoalan[ currentSoalan ] }
                    update_callback={ updateSoalan }
                    disabled={ senaraiSoalan[ currentSoalan ].jawapan_murid ? true : false }
                    shuffle={ true }
                    showAnswer={ false }
                />
            </BoxBody>
        </Box>
    );
}

