import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router";
import { Box, BoxBody, BoxHeader } from "../boxes/Box";
// import { KuizContext, KuizContextProvider } from '../contexts/KuizContext';
// import { MuridContext, MuridContextProvider } from '../contexts/MuridContext';
import { API } from "../utils";
import Soalan from "./Soalan";
import TailSpinLoader from "../TailSpinLoader";
import ErrorBox from "../boxes/ErrorBox";


function Ulangkaji()
{
    let { idKuiz, idMurid } = useParams();
    useEffect( () => document.title = 'Skor & Ulangkaji | NSejarah', [] );
    const [ kuiz, setKuiz ] = useState( {} );
    const [ murid, setMurid ] = useState( {} );
    const [ isLoad, setIsLoad ] = useState( false );
    const [ status, setStatus ] = useState( null );

    useEffect( () =>
    {
        API.getKuiz( idKuiz ).then( dataKuiz =>
        {
            if ( dataKuiz.success )
            {
                setKuiz( dataKuiz.data );
                API.getMurid( idMurid ).then( dataMurid =>
                {
                    if ( dataMurid.success )
                    {
                        setMurid( dataMurid.data );

                        API.getJawapanMurid( dataMurid.data.m_id, dataKuiz.data.kz_id ).then( dataJawapanMurid =>
                        {
                            console.log( dataJawapanMurid );
                            if ( dataJawapanMurid.success )
                            {
                                setStatus( { success: true } );
                                setIsLoad( true );
                            }
                            else
                            {
                                setStatus( dataJawapanMurid );
                                setIsLoad( true );
                            }
                        } );
                    }
                    else
                    {
                        setStatus( dataMurid );
                        setIsLoad( true );
                    }
                } );
            }
            else
            {
                setStatus( dataKuiz );
                setIsLoad( true );
            }
        } );
    }, [ idKuiz, idMurid ] );

    // return null;
    return (
        isLoad
            ? status.success
                ? <>
                    <SkorMuridBox kuiz={ kuiz } murid={ murid } />
                    <UlangkajiJawapanBox kuiz={ kuiz } murid={ murid } />
                </>
                : <ErrorBox>
                    404 Tiada data dijumpai
                </ErrorBox>
            : <TailSpinLoader />
    );
}

function SkorMuridBox( { kuiz, murid } )
{
    let [ skor, setSkor ] = useState( {} );

    useEffect( () =>
    {
        if ( kuiz.kz_id && murid.m_id )
        {
            API.getJawapanMurid( murid.m_id, kuiz.kz_id ).then( data =>
            {
                // console.log( data );
                if ( data.success )
                {
                    setSkor( data.data );
                }
            } );
        }
    }, [ kuiz, murid ] );
    return (
        <Box id="skor">
            <BoxHeader>
                <i className="fas fa-star" /> Skor Murid
            </BoxHeader>
            <BoxBody>
                {
                    skor.hasOwnProperty( 'murid' ) &&
                    <>
                        <li>Skor: { skor.skor } </li>
                        <li>Soalan: { skor.jumlah } </li>
                        <li>Jawapan Betul: { skor.jumlah_betul } </li>
                    </>
                }
            </BoxBody>
        </Box>
    );
}

function UlangkajiJawapanBox( { kuiz, murid } )
{
    let [ jawapanMurid, setJawapanMurid ] = useState( [] );

    useEffect( () =>
    {
        console.log( murid );
        if ( kuiz.kz_id && murid.m_id )
        {
            API.getJawapanMurid( murid.m_id, kuiz.kz_id ).then( data =>
            {
                console.log( data.data );
                if ( data.success )
                {
                    setJawapanMurid( data.data.jawapan_murid );
                }
            } );
        }
    }, [ kuiz, murid ] );

    return (
        // <div ref={r => {ref = r}}>
        <Box id='ulangkaji'>
            <BoxHeader>
                <i className="fas fa-history" /> Ulangkaji
            </BoxHeader>
            <BoxBody>
                {
                    jawapanMurid.length > 0 &&
                    jawapanMurid.map( jawapan => (
                        <JawapanMurid key={ jawapan.jm_id } jawapan_murid={ jawapan } />
                    ) )
                }
            </BoxBody>
        </Box>
        // </div>
    );
}

function JawapanMurid( { jawapan_murid, ...rest } )
{
    let [ soalan, setSoalan ] = useState( {} );

    useEffect( () =>
    {
        API.getSoalan( jawapan_murid.jm_soalan ).then( data =>
        {
            // console.log( data );
            if ( data.success )
            {
                setSoalan( data.data );
            }
        } );
    }, [ jawapan_murid.jm_soalan ] );

    // useEffect( () => console.log( soalan ), [soalan]);

    return (
        <>
            { console.log( { ...soalan, jawapan_murid: jawapan_murid.jm_jawapan } ) }
            {
                soalan.hasOwnProperty( 's_id' )
                    ? <Soalan soalan={ { ...soalan, jawapan_murid: jawapan_murid.jm_jawapan } } disabled={ true } style={ {
                        marginBottom: '10px',
                        borderLeft: `10px solid ${jawapan_murid.jm_jawapan
                            ? jawapan_murid.jm_jawapan === soalan.jawapan_betul.j_id
                                ? 'green'
                                : 'red'
                            : 'yellow'}`,
                        borderRadius: '5px'
                    } } />
                    : ''
            }
        </>
    );
}

export default Ulangkaji;