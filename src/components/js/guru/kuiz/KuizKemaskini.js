import { createContext, useContext, useEffect, useState } from "react";
import { useParams } from "react-router";
import { Box, BoxBody, BoxHeader } from "../../boxes/Box";
import { UserContext } from "../../contexts/UserContext";
import { API, rand, useTitle } from "../../utils";
import ErrorBox from '../../boxes/ErrorBox';



const KuizContext = createContext();

//act as provider
export function KuizKemaskini()
{
    useTitle( 'Kemaskini Kuiz' );

    let { idKuiz } = useParams();
    let [kuiz, setKuiz] = useState( {} );
    let [valid, setValid] = useState( null );
    let [disabled, setDisabled] = useState( false ); //for kuiz submisison
    const user = useContext( UserContext );


    // //test
    // useEffect( () =>
    // {
    //     if ( kuiz.hasOwnProperty( 'kz_id' ) && kuiz.kz_id !== '69' )
    //     {
    //         setKuiz( { ...kuiz, kz_id: '69' } );
    //     }
    // }, [kuiz] );

    useEffect( () =>
    {
        API.getKuiz( idKuiz ).then( data =>
        {
            if ( data.success )
            {
                console.log( data );
                // data.data.soalan.pop();
                data.data.padam = []; //padam soalan
                setKuiz( data.data );
                setValid( true );
            }
            else
            {
                setValid( false );
            }
        } );

        return () =>
        {
            setKuiz( {} );
        };
    }, [idKuiz] );

    useEffect( () => console.log( kuiz ), [kuiz] );

    return (
        <>
            {
                valid === true && ( kuiz.kz_guru === user.data.g_id || user.data.g_jenis === 'admin' ) &&
                <KuizContext.Provider value={{ kuiz, setKuiz, disabled, setDisabled }}>
                    <KemaskiniKuizDetail />
                </KuizContext.Provider>
            }
            {
                //                                             bug\
                valid === true && ( kuiz.kz_guru === user.data.g_id || user.data.g_jenis === 'admin' ) && false &&
                <ErrorBox>
                    403. Akses tanpa kebenaran!
                    <br />
                    <small>Anda cuba mengakses data yang dilindungi</small>
                </ErrorBox>
            }
            {
                valid === false &&
                <ErrorBox>
                    404. Tiada data dijumpai!
                    <br />
                    <small>Tiada data kuiz dengan ID: {idKuiz} dijumpai</small>
                </ErrorBox>
            }
        </>
    );
}

function KemaskiniKuizDetail()
{
    const user = useContext( UserContext );
    const { kuiz, setKuiz, disabled, setDisabled } = useContext( KuizContext );
    let [status, setStatus] = useState( null );

    useEffect( () => document.title = 'Kemaskini Kuiz', [] );


    function handleSubmit( e )
    {
        e.preventDefault();
        setDisabled( true );
        setStatus( null );

        API.kemaskini( kuiz, user.token, 'kuiz' ).then( data =>
        {
            console.log( data );
            if ( data.success )
            {
                alert( 'Kuiz berjaya dikemaskini' );
            }
            setStatus( data );

            setDisabled( false );
        } );
    }

    return (
        <>
            <form style={{ padding: 'initial' }} onSubmit={e => handleSubmit( e )}>
                <Box>
                    <BoxHeader>
                        <i className="fas fa-pen" /> Kemaskini Kuiz
                    </BoxHeader>
                    {console.log( kuiz )}
                    {
                        kuiz.hasOwnProperty('kz_id') &&
                        <BoxBody>
                           

                            {
                                status && status.hasOwnProperty( 'success' ) &&
                                <>
                                    {
                                        status.success === true &&
                                        <h4 className="status-success"> {status.message} </h4>
                                    }
                                    {
                                        status.success === false &&
                                        <h4 className="status-fail"> {status.message} </h4>
                                    }
                                </>
                            }

                            <div className="input-container">
                                <label htmlFor="nama">Nama Kuiz: </label>
                                <input
                                    value={kuiz.kz_nama}
                                    onChange={e => setKuiz( { ...kuiz, kz_nama: e.target.value } )}
                                    id="nama"
                                    maxLength="100"
                                    disabled={disabled}
                                />
                            </div>

                            <div className="input-container">
                                <label htmlFor="tarikh">Tarikh: </label>
                                <input
                                    type="date"
                                    value={kuiz.kz_tarikh}
                                    onChange={e => setKuiz( { ...kuiz, kz_tarikh: e.target.value } )}
                                    id="tarikh"
                                    disabled={disabled}
                                />
                            </div>

                            <div className="input-container">
                                <label htmlFor="jenis">Jenis: </label>
                                <select
                                    id="jenis"
                                    value={kuiz.kz_jenis}
                                    onChange={e => setKuiz( { ...kuiz, kz_jenis: e.target.value } )}
                                    disabled={disabled}
                                >
                                    <option value="kuiz"> Kuiz </option>
                                    <option value="latihan"> Latihan </option>
                                </select>
                            </div>

                            <div className="input-container">
                                <label htmlFor="masa">Masa: </label>
                                <input
                                    type="number"
                                    defaultValue={kuiz.kz_jenis === 'kuiz' ? kuiz.kz_jenis : ''}
                                    id="masa"
                                    onChange={e => setKuiz( { ...kuiz, kz_masa: e.target.value } )}
                                    disabled={kuiz.kz_jenis === 'latihan' || disabled}
                                />
                            </div>


                            <button type="submit" disabled={disabled}>
                                <i className="fas fa-arrow-right" /> Submit kuiz
                            </button>
                        </BoxBody>
                    }
                </Box>
                <DisplaySoalan />
            </form>
        </>
    );
}

const SoalanContext = createContext();
function DisplaySoalan()
{
    const { kuiz, setKuiz, disabled } = useContext( KuizContext );
    let [senaraiSoalan, setSenaraiSoalan] = useState( [] );

    useEffect( () =>
    {
        // console.log( kuiz );
        if ( kuiz.hasOwnProperty( 'soalan' ) )
        {
            setSenaraiSoalan( kuiz.soalan );
            // template = {
            //     s_id: parseInt( kuiz.soalan[kuiz.soalan.length - 1].s_id ) + 1,
            //     s_teks: '',
            //     jawapan: [
            //         { j_id: parseInt( kuiz.soalan[kuiz.soalan.length - 1].jawapan[kuiz.soalan[kuiz.soalan.length - 1].jawapan.length - 1].j_id ) + 1, j_teks: '0' }
            //     ],
            //     jawapan_betul: {}
            // };
        }
    }, [kuiz] );

    return (
        <Box>
            <BoxHeader>
                <i className="fas fa-list-ol" /> Kemaskini Soalan
            </BoxHeader>
            <BoxBody>
                {
                    senaraiSoalan.length > 0 &&
                    senaraiSoalan.map( soalan => (
                        <SoalanContext.Provider value={soalan} key={senaraiSoalan.indexOf( soalan )}>
                            <Soalan />
                        </SoalanContext.Provider>
                    ) )
                }
                <button
                    className="bg5"
                    type="button"
                    onClick={() =>
                    {
                        return setKuiz( {
                            ...kuiz, soalan: [...kuiz.soalan, {
                                s_id: 'new-' + rand(),
                                s_teks: '',
                                jawapan: [
                                    { j_id: rand(), j_teks: '' },
                                    { j_id: rand(), j_teks: '' },
                                    { j_id: rand(), j_teks: '' },
                                    { j_id: rand(), j_teks: '' },
                                ],
                                jawapan_betul: {}
                            }]
                        } );
                    }}>
                    <i className="fas fa-plus" disabled={disabled} /> Tambah Soalan
                </button>
            </BoxBody>
        </Box>
    );
}

function Soalan()
{
    const { kuiz, setKuiz, disabled } = useContext( KuizContext );
    const sln = useContext( SoalanContext );
    let [soalan, setSoalan] = useState( {} );

    useEffect( () =>
    {
        // console.log( kuiz );
        if ( kuiz.hasOwnProperty( 'soalan' ) )
        {
            // console.log( 123);
            if ( kuiz.soalan.indexOf( sln ) >= 0 )
            {
                // console.log( sln );
                setSoalan( sln );
            }
        }

        return () =>
        {
            setSoalan( {} );
        };
    }, [kuiz, sln] );

    useEffect( () =>
    {
        if ( soalan.hasOwnProperty( 's_teks' ) )
        {
            let ori = {};
            for ( let i = 0; i < kuiz.soalan.length; i++ )
            {
                if ( kuiz.soalan[i].s_id === soalan.s_id )
                {
                    ori = kuiz.soalan[i];
                }
            }

            if ( !Object.is( ori, soalan ) )
            {
                kuiz.soalan[kuiz.soalan.indexOf( ori )] = soalan;
                setKuiz( { ...kuiz } );
            }
        }
        // eslint-disable-next-line
    }, [kuiz, soalan] );

    function handleClick( e )
    {
        // kuiz.soalan.splice( kuiz.soalan.indexOf( soalan ) - 1, 1 );
        // console.log( kuiz.soalan.indexOf( soalan ) );
        let index = kuiz.soalan.indexOf( soalan );

        kuiz.soalan.splice( index, 1 );

        //only add items if it exists
        if ( soalan.s_id !== 'new' )
        {
            kuiz.padam.push( soalan );
        }

        setKuiz( { ...kuiz } );
    }

    return (
        <>
            {
                soalan.hasOwnProperty( 's_teks' ) &&
                <div className="soalan">
                    <div className="input-container">
                        <label>Teks Soalan: </label>
                        <input
                            value={soalan.s_teks}
                            id={soalan.s_id}
                            onChange={e => setSoalan( { ...soalan, s_teks: e.target.value } )}
                            placeholder="Sila masukkan teks soalan"
                            required
                            disabled={disabled}
                        />
                    </div>

                    <div className="input-container">
                        <label>Jawapan</label>
                        {
                            soalan.jawapan.map( jawapan => (
                                <Jawapan jwpn={jawapan} key={jawapan.j_id} />
                            ) )
                        }
                    </div>
                    <button
                        type="button"
                        onClick={handleClick}
                        disabled={disabled}
                        className="bg3"
                    >
                        <i className="fas fa-trash-alt" /> Padam Soalan
                    </button>
                    <hr style={{ margin: '5px 0' }} />
                </div>
            }
        </>
    );
}

function Jawapan( { jwpn, ...rest } )
{
    const soalan = useContext( SoalanContext );
    const { kuiz, setKuiz, disabled } = useContext( KuizContext );
    let [jawapan, setJawapan] = useState( {} );

    useEffect( () =>
    {
        if ( soalan.jawapan.indexOf( jwpn ) >= 0 )
        {
            setJawapan( jwpn );
        }
    }, [soalan, jwpn] );

    function handleChange( e )
    {
        let i = soalan.jawapan.indexOf( jwpn );

        soalan.jawapan[i].j_teks = e.target.value;

        let ss = kuiz.soalan;
        ss[ss.indexOf( soalan )] = soalan;

        setKuiz( { ...kuiz, soalan: [...ss] } );
    }

    function handleClick( e )
    {
        // only change when el is not disabled
        if ( disabled ) return;

        soalan.jawapan_betul = jawapan;

        // let ss = kuiz.soalan;
        // ss[ss.indexOf( soalan )] = soalan;

        setKuiz( { ...kuiz, soalan: [...kuiz.soalan] } );
    }
    return (
        <div style={{
            display: 'flex',
            marginBottom: '5px'
        }} className="input-container">
            <input
                defaultValue={jawapan.j_teks}
                onChange={handleChange}
                style={{ marginBottom: '0', marginRight: '5px' }}
                required
                placeholder="Sila masukkan teks jawapan"
                disabled={disabled}
            />
            {/* <button onClick={handleClick} disabled={jawapan.j_id === soalan.jawapan_betul.j_id} style={{background: jawapan.j_id === soalan.jawapan_betul.j_id ? '#00ff00dd' : 'initial', color: jawapan.j_id === soalan.jawapan_betul.j_id ? 'darkgreen' : 'initial', border: `2px solid ${jawapan.j_id === soalan.jawapan_betul.j_id ? 'darkgreen' : 'grey'}`, borderRadius: '5px', cursor: jawapan.j_id !== soalan.jawapan_betul.j_id ? 'pointer' : 'not-allowed'}}>
                { jawapan.j_id === soalan.jawapan_betul.j_id ? <i className="fas fa-check"/> : <i className="fas fa-minus"/> }
            </button> */}
            <div
                style={{ border: "2px solid grey", borderRadius: '5px' }}
                disabled={jawapan.j_id === soalan.jawapan_betul.j_id || disabled}
                onClick={handleClick}
                className={`${jawapan.j_id === soalan.jawapan_betul.j_id ? 'jawapan-selected' : 'jawapan'}`}
            >
                <input
                    type="radio"
                    name={`jawapan-soalan-${soalan.s_id}`}
                    onClick={handleClick}
                    onChange={() => { }}
                    checked={jawapan.j_id === soalan.jawapan_betul.j_id}
                    required
                    disabled={disabled}
                    className={`jawapan-input`}
                />
                <i
                    className={`fas fa-check ${jawapan.j_id === soalan.jawapan_betul.j_id ? 'jawapan-selected-text' : ''}`}
                    style={{ display: jawapan.j_id === soalan.jawapan_betul.j_id ? 'block' : 'none', margin: '10px 15px', width: '15px', height: '15px' }}
                    disabled={disabled || jawapan.j_id === soalan.jawapan_betul.j_id}
                />
            </div>
        </div>
    );
}

export default KuizKemaskini;