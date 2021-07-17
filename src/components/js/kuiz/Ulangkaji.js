import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router";
import { Box, BoxBody, BoxHeader } from "../boxes/Box";
import { KuizContext, KuizContextProvider } from '../contexts/KuizContext';
import { MuridContext, MuridContextProvider } from '../contexts/MuridContext';
import { API } from "../utils";
import Soalan from "./Soalan";


function Ulangkaji()
{
    let { idKuiz, idMurid } = useParams();
    useEffect( () => document.title = 'Skor & Ulangkaji | NSejarah', [] );

    return (
        <KuizContextProvider idKuiz={ idKuiz }>
            <MuridContextProvider idMurid={ idMurid }>
                <SkorMuridBox />
                <UlangkajiJawapanBox />
            </MuridContextProvider>
        </KuizContextProvider>
    );
}

function SkorMuridBox()
{
    let { kuiz } = useContext( KuizContext );
    let { murid } = useContext( MuridContext );
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

function UlangkajiJawapanBox()
{
    let { kuiz } = useContext( KuizContext );
    let { murid } = useContext( MuridContext );
    let [ jawapanMurid, setJawapanMurid ] = useState( [] );

    useEffect( () =>
    {
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