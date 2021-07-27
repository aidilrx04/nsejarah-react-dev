import { useEffect, useState } from "react";
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
    const [ jawapanMurid, setJawapanMurid ] = useState( {} );
    const [ isLoad, setIsLoad ] = useState( false );
    const [ status, setStatus ] = useState( null );
    const [ murid, setMurid ] = useState( {} );
    const [ kuiz, setKuiz ] = useState( {} );

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
                                setJawapanMurid( dataJawapanMurid.data );
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
                    <SkorMuridBox jawapanMurid={ jawapanMurid } kuiz={ kuiz } murid={ murid } />
                    <UlangkajiJawapanBox jawapanMurid={ jawapanMurid } />
                </>
                : <ErrorBox>
                    404 Tiada data dijumpai
                </ErrorBox>
            : <TailSpinLoader />
    );
}

function SkorMuridBox( { jawapanMurid, kuiz, murid } )
{
    const iconStyle = {
        width: '25px',
        textAlign: 'center'
    };
    return (
        <Box id="skor">
            <BoxHeader>
                <i className="fas fa-star" /> Skor Murid
            </BoxHeader>
            <BoxBody>
                <li>
                    <i style={ iconStyle } className="fas fa-user" /> Nama Murid: { murid.m_nama }
                </li>
                <li>
                    <i style={ iconStyle } className="fas fa-book" /> Nama Kuiz: { kuiz.kz_nama }
                </li>
                <li>
                    <i style={ iconStyle } className="fas fa-star-half-alt" /> Skor: { jawapanMurid.skor }%
                </li>
                <li>
                    <i style={ iconStyle } className="fas fa-question" /> Soalan: { jawapanMurid.jumlah }
                </li>
                <li>
                    <i style={ iconStyle } className="fas fa-check" /> Jawapan Betul: { jawapanMurid.jumlah_betul }
                </li>
            </BoxBody>
        </Box>
    );
}

function UlangkajiJawapanBox( { jawapanMurid } )
{
    return (
        // <div ref={r => {ref = r}}>
        <Box id='ulangkaji'>
            <BoxHeader>
                <i className="fas fa-history" /> Ulangkaji
            </BoxHeader>
            <BoxBody>
                {
                    jawapanMurid.jawapan_murid.length > 0 &&
                    jawapanMurid.jawapan_murid.map( jawapan => (
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