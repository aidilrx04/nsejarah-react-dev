import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router";
import { Box, BoxBody, BoxHeader } from "../boxes/Box";
import { KuizContext, KuizContextProvider } from '../contexts/KuizContext';
import { MuridContext, MuridContextProvider } from '../contexts/MuridContext';
import { getJawapanMurid, getSoalan } from "../utils";
import '../../css/Ulangkaji.scss';

function Ulangkaji( )
{
    let {idKuiz, idMurid} = useParams();
    useEffect( () => document.title = 'Skor & Ulangkaji | NSejarah', []);

    return (
        <KuizContextProvider idKuiz={idKuiz}>
            <MuridContextProvider idMurid={idMurid}>
                <SkorMuridBox/>
                <UlangkajiJawapanBox/>
            </MuridContextProvider>
        </KuizContextProvider>
    );
}

function SkorMuridBox()
{
    let { kuiz } = useContext( KuizContext );
    let { murid } = useContext( MuridContext );
    let [skor, setSkor] = useState( {} );

    useEffect( () => {
        if( kuiz.kz_id && murid.m_id )
        {
            getJawapanMurid( murid.m_id, kuiz.kz_id ).then( data => { 
                // console.log( data );
                if( data.success )
                {
                    setSkor( data.data[0] );
                }
            })
        }
    }, [kuiz, murid] );
    return (
        <Box id="skor">
            <BoxHeader>
                <i className="fas fa-star"/> Skor Murid
            </BoxHeader>
            <BoxBody>
                {
                    skor.hasOwnProperty( 'murid' ) &&
                    <>
                    <li>Skor: {skor.skor} </li>
                    <li>Soalan: {skor.jumlah} </li>
                    <li>Jawapan Betul: {skor.jumlah_betul} </li>
                    </>
                }
            </BoxBody>
        </Box>
    );
}

function UlangkajiJawapanBox(props)
{
    let { kuiz } = useContext( KuizContext );
    let { murid } = useContext( MuridContext );
    let [jawapanMurid, setJawapanMurid] = useState( [] );
    // let ref = createRef();

    // useEffect( () => {
    //     if( window.location.hash === '#ulangkaji' && ref !== null )
    //     {
    //     console.log( ref );

    //         scrollToTarget();
    //     }
    // }, [ref]);

    // function scrollToTarget() 
    // {
    //     if( ref !== null )
    //     {
    //         console.log( ref );
            
    //         ref.scrollIntoView({
    //             behaviour: 'smooth'
    //         });
    //     }
    // }

    useEffect( () => {
        if( kuiz.kz_id && murid.m_id )
        {
            getJawapanMurid( murid.m_id, kuiz.kz_id ).then( data => { 
                // console.log( data );
                if( data.success )
                {
                    setJawapanMurid( data.data[0].jawapan_murid );
                }
            })
        }
    }, [kuiz, murid] );

    return (
        // <div ref={r => {ref = r}}>
            <Box id='ulangkaji'>
                <BoxHeader>
                    <i className="fas fa-history"/> Ulangkaji
                </BoxHeader>
                <BoxBody>
                    {
                        jawapanMurid.length > 0 &&
                        jawapanMurid.map( jawapan => (
                            <JawapanMurid key={jawapan.jm_id} jawapan_murid={jawapan}/>
                        ))
                    }
                </BoxBody>
            </Box>
        // </div>
    );
}

function JawapanMurid( { jawapan_murid, ...rest } )
{
    let [soalan, setSoalan] = useState( {} );

    useEffect( () => {
        getSoalan( jawapan_murid.jm_soalan ).then( data => {
            // console.log( data );
            if( data.success )
            {
                setSoalan( data.data );
            }
        })
    }, [jawapan_murid.jm_soalan]);

    // useEffect( () => console.log( soalan ), [soalan]);

    return (
        soalan.hasOwnProperty('s_id') &&
        <div className="soalan">
            <p className="soalan-teks">
                <span>
                    {
                        soalan.s_teks
                    }
                </span>

                {
                    soalan.s_gambar 
                        ? <img className="soalan-teks-gambar" src={soalan.s_gambar} alt="" /> 
                        : ''
                }
            </p>

            <div className="soalan-jawapan-container">
                {
                    soalan.jawapan.map(jawapan => {
                        // let status = jawapan_murid.jm_jawapan === jawapan.j_id ? jawapan_murid.jm_jawapan === soalan.jawapan_betul.j_id : null
                        return (<div key={jawapan.j_id} className={`soalan-jawapan ${soalan.jawapan_betul.j_id === jawapan.j_id ? 'soalan-jawapan-betul' : jawapan_murid.jm_jawapan === jawapan.j_id && jawapan_murid.jm_jawapan !== soalan.jawapan_betul.j_id ? 'soalan-jawapan-salah' : '' }`}>
                            <span>
                                {jawapan.j_teks} {
                                    soalan.jawapan_betul.j_id === jawapan.j_id &&
                                    <i className="fas fa-check"/>                                
                                } {
                                    jawapan_murid.jm_jawapan === jawapan.j_id 
                                        && jawapan_murid.jm_jawapan !== soalan.jawapan_betul.j_id
                                        && <i className="fas fa-times"/>
                                }
                            </span>
                        </div>)
                    })
                }
            </div>
        </div>
    )
}

export default Ulangkaji;