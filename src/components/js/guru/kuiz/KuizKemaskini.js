import { createContext, createRef, useContext, useEffect, useState } from "react";
import { useParams } from "react-router";
import { Box, BoxBody, BoxHeader } from "../../boxes/Box";
import { UserContext } from "../../contexts/UserContext";
import { API, API_URL, rand, Url, useTitle } from "../../utils";
import ErrorBox from '../../boxes/ErrorBox';
import TailSpinLoader from "../../TailSpinLoader";
import { useHistory } from "react-router-dom";



const KuizContext = createContext();

//act as provider
export function KuizKemaskini()
{
    useTitle( 'Kemaskini Kuiz' );

    let { idKuiz } = useParams();
    let [ kuiz, setKuiz ] = useState( {} );
    let [ valid, setValid ] = useState( null );
    let [ disabled, setDisabled ] = useState( false ); //for kuiz submisison
    const user = useContext( UserContext );
    const [ isLoad, setIsLoad ] = useState( false );

    useEffect( () => document.title = 'Kemaskini Kuiz', [] );

    useEffect( () =>
    {
        API.getKuiz( idKuiz ).then( data =>
        {
            if ( data.success )
            {
                // data.data.soalan.pop();
                data.data.padam = []; //padam soalan
                data.data.gambar_padam = []; // padam gambar
                setKuiz( data.data );
                setValid( true );
            }
            else
            {
                setValid( false );
            }

            setIsLoad( true );
        } );

        return () =>
        {
            setKuiz( {} );
            setValid( null );
            setDisabled( false );
        };
    }, [ idKuiz ] );

    useEffect( () => console.log( kuiz ), [ kuiz ] );

    return (
        isLoad
            ? valid
                ? kuiz.kz_guru === user.data.g_id || user.data.g_jenis === 'admin'
                    ? <KuizContext.Provider value={ { kuiz, setKuiz, disabled, setDisabled } }>
                        <KemaskiniKuizDetail />
                    </KuizContext.Provider>
                    : <ErrorBox>
                        403. Akses tanpa kebenaran!
                        <br />
                        <small>Anda cuba mengakses data yang dilindungi</small>
                    </ErrorBox>
                : <ErrorBox>
                    404. Tiada data dijumpai!
                </ErrorBox>
            : <TailSpinLoader />
    );
}

function KemaskiniKuizDetail()
{
    const user = useContext( UserContext );
    const { kuiz, setKuiz, disabled, setDisabled } = useContext( KuizContext );
    let [ status, setStatus ] = useState( null );
    const history = useHistory();



    function handleSubmit( e )
    {
        e.preventDefault();

        setDisabled( true );

        if ( kuiz.soalan.length === 0 )
        {
            alert( 'Kuiz hendaklah mempunyai sekurang-kurangnya satu soalan' );
            setDisabled( false );
            return;
        }

        setStatus( null );

        API.kemaskini( kuiz, user.token, 'kuiz' ).then( data =>
        {
            console.log( data );
            if ( data.success )
            {
                // update gambar
                const newKuiz = data.data;
                const gambarSoalan = kuiz.soalan
                    .map( s =>
                    {
                        let val;
                        if ( s.s_gambar !== null && typeof s.s_gambar !== 'string' )
                        {
                            for ( let i = 0; i < newKuiz.soalan.length; i++ )
                            {
                                if ( s.s_id === newKuiz.soalan[ i ].old_id )
                                {
                                    s.new_id = newKuiz.soalan[ i ].s_id;
                                    val = s;
                                }
                            }
                        }
                        else
                        {
                            val = null;
                        }

                        return val;
                    } )
                    .filter( s => s !== null );

                if ( gambarSoalan.length > 0 )
                {
                    const uploadGambarData = new FormData();
                    for ( let i = 0; i < gambarSoalan.length; i++ )
                    {
                        uploadGambarData.append( `${gambarSoalan[ i ].new_id}`, gambarSoalan[ i ].s_gambar );
                    }

                    API.setHead( [
                        'POST',
                        1,
                        user.token,
                        uploadGambarData
                    ] );
                    API.request( '/api/upload-gambar.php' ).then( data =>
                    {
                        console.log( data );
                        alert( 'Kuiz berjaya dikemaskini' );

                        history.push( Url( `/guru/kuiz/${newKuiz.kz_id}` ) );
                    } );
                }
                else
                {
                    alert( 'Kuiz berjaya dikemaskini' );

                    history.push( Url( `/guru/kuiz/${newKuiz.kz_id}` ) );
                }

            }
            setStatus( data );

            setDisabled( false );
        } );
    }

    return (
        <>
            <form onSubmit={ e => handleSubmit( e ) }>
                <Box>
                    <BoxHeader>
                        <i className="fas fa-pen" /> Kemaskini Kuiz
                    </BoxHeader>
                    <BoxBody>
                        {
                            status && status.hasOwnProperty( 'success' ) &&
                            <>
                                {
                                    status.success === true &&
                                    <h4 className="status-success"> { status.message } </h4>
                                }
                                {
                                    status.success === false &&
                                    <h4 className="status-fail"> { status.message } </h4>
                                }
                            </>
                        }

                        <div className="input-container">
                            <label htmlFor="nama">Nama Kuiz: </label>
                            <input
                                value={ kuiz.kz_nama }
                                onChange={ e => setKuiz( { ...kuiz, kz_nama: e.target.value } ) }
                                id="nama"
                                maxLength="100"
                                disabled={ disabled }
                            />
                        </div>

                        <div className="input-container">
                            <label htmlFor="tarikh">Tarikh: </label>
                            <input
                                type="date"
                                value={ kuiz.kz_tarikh }
                                onChange={ e => setKuiz( { ...kuiz, kz_tarikh: e.target.value } ) }
                                id="tarikh"
                                disabled={ disabled }
                            />
                        </div>

                        <div className="input-container">
                            <label htmlFor="jenis">Jenis: </label>
                            <select
                                id="jenis"
                                value={ kuiz.kz_jenis }
                                onChange={ e => setKuiz( { ...kuiz, kz_jenis: e.target.value } ) }
                                disabled={ disabled }
                            >
                                <option value="kuiz"> Kuiz </option>
                                <option value="latihan"> Latihan </option>
                            </select>
                        </div>

                        <div className="input-container">
                            <label htmlFor="masa">Masa(minit): </label>
                            <input
                                type="number"
                                defaultValue={ kuiz.kz_jenis === 'kuiz' ? kuiz.kz_masa : '' }
                                id="masa"
                                onChange={ e => setKuiz( { ...kuiz, kz_masa: e.target.value } ) }
                                disabled={ kuiz.kz_jenis === 'latihan' || disabled }
                                min="1"
                            />
                        </div>


                        <button type="submit" disabled={ disabled }>
                            <i className="fas fa-arrow-right" /> Submit kuiz
                        </button>
                    </BoxBody>
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
    let [ senaraiSoalan, setSenaraiSoalan ] = useState( [] );

    useEffect( () =>
    {
        setSenaraiSoalan( kuiz.soalan ? kuiz.soalan : [] );
        console.log( kuiz.soalan );
    }, [ kuiz ] );

    return (
        <Box>
            <BoxHeader>
                <i className="fas fa-list-ol" /> Kemaskini Soalan
            </BoxHeader>
            <BoxBody>
                {
                    senaraiSoalan.length > 0 &&
                    senaraiSoalan.map( soalan => (
                        <SoalanContext.Provider value={ soalan } key={ soalan.s_id }>
                            <Soalan />
                        </SoalanContext.Provider>
                    ) )
                }
                <button
                    className="bg5"
                    type="button"
                    onClick={ () =>
                    {
                        return setKuiz( {
                            ...kuiz, soalan: [ ...kuiz.soalan, {
                                s_id: 'new-' + rand(),
                                s_teks: '',
                                jawapan: [
                                    { j_id: rand(), j_teks: '' },
                                    { j_id: rand(), j_teks: '' },
                                    { j_id: rand(), j_teks: '' },
                                    { j_id: rand(), j_teks: '' },
                                ],
                                jawapan_betul: {}
                            } ]
                        } );
                    } }>
                    <i className="fas fa-plus" disabled={ disabled } /> Tambah Soalan
                </button>
            </BoxBody>
        </Box>
    );
}

function Soalan()
{
    const { kuiz, setKuiz, disabled } = useContext( KuizContext );
    const sln = useContext( SoalanContext );
    let [ soalan, setSoalan ] = useState( {} );
    const [ gambar, setGambar ] = useState( () => sln.s_gambar );
    const inputRef = createRef();

    useEffect( () =>
    {
        setSoalan( sln );

        return () =>
        {
            setSoalan( {} );
        };
    }, [ sln ] );

    useEffect( () =>
    {
        console.log( gambar );
        if ( inputRef.current !== null )
        {
            if ( gambar === null )
            {
                inputRef.current.files = new DataTransfer().files;
            }
        }
    }, [ gambar, inputRef ] );

    useEffect( () =>
    {
        if ( soalan.hasOwnProperty( 's_id' ) )
        {
            setKuiz( kuiz =>
            {
                const soalanIndex = getSoalanIndex( soalan.s_id );

                kuiz.soalan[ soalanIndex ] = soalan;

                return { ...kuiz };
            } );
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ soalan ] );

    function getSoalanIndex( idSoalan )
    {
        const prevStateSoalan = kuiz.soalan.filter( s => s.s_id === idSoalan )[ 0 ];
        const soalanIndex = kuiz.soalan.indexOf( prevStateSoalan );
        return soalanIndex;
    }

    function handlePadamSoalan()
    {
        setKuiz( kuiz =>
        {
            const soalanIndex = getSoalanIndex( soalan.s_id );
            kuiz.soalan.splice( soalanIndex, 1 );

            // toString convert non string id to string to work with startsWith
            if ( !soalan.s_id.toString().startsWith( 'new' ) )
            {
                // add real soalan to padam query
                kuiz.padam.push( soalan );
            }

            return { ...kuiz };
        } );
    }

    return (
        <>
            {
                soalan.hasOwnProperty( 's_teks' ) &&
                <div className="soalan">
                    <div className="input-container">
                        <label>Teks Soalan: </label>
                        <input
                            value={ soalan.s_teks }
                            id={ soalan.s_id }
                            onChange={ e => setSoalan( { ...soalan, s_teks: e.target.value } ) }
                            placeholder="Sila masukkan teks soalan"
                            required
                            disabled={ disabled }
                        />
                    </div>

                    <div className="">
                        <label>Gambar</label>
                        <div className="preview" style={ {
                            display: gambar ? 'block' : 'none',
                            textAlign: 'center',
                            position: 'relative'
                        } }>
                            <span
                                style={ {
                                    position: 'absolute',
                                    top: 0,
                                    right: 0,
                                    zIndex: 3,
                                    transform: 'scale(1.5)',
                                    cursor: 'pointer'
                                } }
                                onClick={ () =>
                                {
                                    if ( !gambar.startsWith( 'blob' ) )
                                    {
                                        setKuiz( kuiz => ( { ...kuiz, gambar_padam: [ ...kuiz.gambar_padam, soalan.s_id ] } ) );
                                    }

                                    setGambar( null );
                                } }
                            >
                                &times;
                            </span>
                            <img src={ gambar ? gambar.startsWith( 'blob' ) ? gambar : API_URL + '/image/' + gambar : "#" } alt="preview" style={ {
                                maxWidth: '60%'
                            } } />
                        </div>
                        <input type="file" ref={ inputRef } onChange={ ( e ) =>
                        {
                            if ( typeof soalan.s_gambar === 'string' && !soalan.s_gambar.startsWith( 'blob' ) )
                            {
                                setKuiz( k => ( { ...k, gambar_padam: [ ...k.gambar_padam, soalan.s_id ] } ) );
                            }
                            setSoalan( s => ( { ...s, s_gambar: e.target.files[ 0 ] } ) );
                            setGambar( URL.createObjectURL( e.target.files[ 0 ] ) );
                        } } />
                    </div>

                    <div className="input-container">
                        <label>Jawapan</label>
                        {
                            soalan.jawapan.map( jawapan => (
                                <Jawapan jwpn={ jawapan } key={ jawapan.j_id } />
                            ) )
                        }
                    </div>
                    <button
                        type="button"
                        onClick={ handlePadamSoalan }
                        disabled={ disabled }
                        className="bg3"
                    >
                        <i className="fas fa-trash-alt" /> Padam Soalan
                    </button>
                    <hr style={ { margin: '5px 0' } } />
                </div>
            }
        </>
    );
}

function Jawapan( { jwpn } )
{
    const soalan = useContext( SoalanContext );
    const { kuiz, setKuiz, disabled } = useContext( KuizContext );
    let [ jawapan, setJawapan ] = useState( {} );

    useEffect( () =>
    {
        setJawapan( jwpn );
    }, [ jwpn ] );

    function getJawapanIndex( idJawapan )
    {
        const jawapan = soalan.jawapan.filter( j => j.j_id === idJawapan )[ 0 ];
        const indexJawapan = soalan.jawapan.indexOf( jawapan );
        return indexJawapan;
    }

    function handleChangeText( e )
    {
        setKuiz( kuiz =>
        {
            console.log( 'hey' );
            const indexJawapan = getJawapanIndex( jawapan.j_id );

            soalan.jawapan[ indexJawapan ].j_teks = e.target.value;

            kuiz.soalan[ kuiz.soalan.indexOf( soalan ) ] = soalan;

            return { ...kuiz };
        } );
    }

    function handleClick( e )
    {
        // only change when el is not disabled
        if ( disabled ) return;

        soalan.jawapan_betul = jawapan;

        setKuiz( { ...kuiz, soalan: [ ...kuiz.soalan ] } );
    }
    return (
        <div style={ {
            display: 'flex',
            marginBottom: '5px'
        } } className="input-container">
            <input
                defaultValue={ jawapan.j_teks }
                onChange={ handleChangeText }
                style={ { marginBottom: '0', marginRight: '5px' } }
                required
                placeholder="Sila masukkan teks jawapan"
                disabled={ disabled }
            />
            <div
                style={ { border: "2px solid grey", borderRadius: '5px' } }
                disabled={ jawapan.j_id === soalan.jawapan_betul.j_id || disabled }
                onClick={ handleClick }
                className={ `${jawapan.j_id === soalan.jawapan_betul.j_id ? 'jawapan-selected' : 'jawapan'}` }
            >
                <input
                    type="radio"
                    name={ `jawapan-soalan-${soalan.s_id}` }
                    onClick={ handleClick }
                    onChange={ () => { } }
                    checked={ jawapan.j_id === soalan.jawapan_betul.j_id }
                    required
                    disabled={ disabled }
                    className={ `jawapan-input` }
                />
                <i
                    className={ `fas fa-check ${jawapan.j_id === soalan.jawapan_betul.j_id ? 'jawapan-selected-text' : ''}` }
                    style={ { display: jawapan.j_id === soalan.jawapan_betul.j_id ? 'block' : 'none', margin: '10px 15px', width: '15px', height: '15px' } }
                    disabled={ disabled || jawapan.j_id === soalan.jawapan_betul.j_id }
                />
            </div>
        </div>
    );
}

export default KuizKemaskini;