import { useState, createContext, useContext, useEffect, createRef } from 'react';
import { Box, BoxHeader, BoxBody } from '../../boxes/Box';
import { API, rand, Url, useTitle } from '../../utils';
import { UserContext } from '../../contexts/UserContext';
import { useHistory } from 'react-router-dom';


//template
const template = {
    "kz_id": "1",
    "kz_nama": "",
    "kz_guru": null,
    "kz_ting": "",
    "kz_tarikh": "",
    "kz_jenis": "latihan",
    "kz_masa": null,
    "soalan": [
        {
            "s_id": "1",
            "s_teks": "",
            "s_gambar": null,
            "jawapan": [
                {
                    "j_id": "1",
                    "j_teks": ""
                },
                {
                    "j_id": "2",
                    "j_teks": ""
                },
                {
                    "j_id": "3",
                    "j_teks": ""
                },
                {
                    "j_id": "4",
                    "j_teks": ""
                }
            ],
            "jawapan_betul": {}
        },
        // {
        //     "s_id": "2",
        //     "s_teks": "Soalan 2. Ini adalah soalan 3",
        //     "s_gambar": null,
        //     "jawapan": [
        //         {
        //             "j_id": "1",
        //             "j_teks": "Ya"
        //         },
        //         {
        //             "j_id": "2",
        //             "j_teks": "Tidak"
        //         },
        //         {
        //             "j_id": "3",
        //             "j_teks": "Mungkin"
        //         },
        //         {
        //             "j_id": "4",    
        //             "j_teks": "Tidak tahu"
        //         }
        //     ],
        //     "jawapan_betul": {
        //         "j_id": "2"
        //     }
        // }
    ]
};


const KuizBaruContext = createContext( template );
export function KuizBaru( { children = {}, ...rest } )
{
    useTitle( 'Tambah Kuiz' );

    let [ kuiz, setKuiz ] = useState( template );
    let [ disabled, setDisabled ] = useState( false );
    let history = useHistory();
    const user = useContext( UserContext );

    useEffect( () =>
    {
        // console.log( kuiz );

        if ( !kuiz.kz_guru )
        {
            kuiz.kz_guru = user.data.g_id;
        }
    }, [ kuiz, user ] );

    function handleSubmit( e )
    {
        e.preventDefault();
        setDisabled( true );

        if ( kuiz.soalan.length !== 0 )
        {
            API.baru( kuiz, user.token, 'kuiz' ).then( data =>
            {
                // console.log( data );
                if ( data.success )
                {
                    // window.location.href = `http://localhost:3000/guru/kuiz/${data.data.kz_id}`;


                    // upload image
                    const newKuiz = data.data;
                    const gambarSoalan = kuiz.soalan
                        .map( ( s ) =>
                        {
                            let val;
                            if ( s.s_gambar !== null )
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
                        .filter( s =>
                        {
                            return s !== null;
                        } );

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
                            alert( 'Kuiz berjaya ditambah' );
                            history.push( Url( `/guru/kuiz/${newKuiz.kz_id}` ) );
                        } );
                    }
                    else
                    {
                        alert( 'Kuiz berjaya ditambah' );
                        history.push( Url( `/guru/kuiz/${newKuiz.kz_id}` ) );
                    }
                }

                setDisabled( false );
            } );
        }
        else
        {
            alert( 'Kuiz hendaklah mempunyai sekurang-kurangnya satu(1) soalan' );
            setDisabled( false );
        }
    }
    return (
        <KuizBaruContext.Provider value={ { kuiz, setKuiz, disabled } }>
            <form style={ { padding: 0 } } onSubmit={ e => handleSubmit( e ) }>
                <KuizFormBox></KuizFormBox>
                <KuizSoalanFormBox></KuizSoalanFormBox>
            </form>
        </KuizBaruContext.Provider>

    );

}

function KuizFormBox()
{
    const { kuiz, setKuiz } = useContext( KuizBaruContext );
    let [ senaraiTing, setSenaraiTing ] = useState( [] );
    const user = useContext( UserContext );

    useEffect( () =>
    {
        if ( user.data )
        {
            API.getListTingkatanGuru( user.data.g_id ).then( data =>
            {
                // console.log( data );
                if ( data.success )
                {
                    setSenaraiTing( data.data.data );
                    // default define in template
                    // if ( kuiz.kz_ting === "" ) 
                    // {
                    //     kuiz.kz_ting = data.data.data[ 0 ].kt_id.toString(); // set the default value
                    //     setKuiz( { ...kuiz } );
                    // }
                    setKuiz( kuiz =>
                    {
                        if ( kuiz.kz_ting === "" )
                        {
                            kuiz.kz_ting = data.data.data[ 0 ].kt_id.toString();
                        }
                        return { ...kuiz };

                    } );
                }
            } );
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ user ] );
    return (
        <Box>
            <BoxHeader>
                <i className="fas fa-plus" /> Cipta Kuiz Baharu
            </BoxHeader>
            <BoxBody>
                <div className="input-container">
                    <label htmlFor="nama">Nama Kuiz</label>
                    <input
                        type="text"
                        id="nama"
                        onChange={ e => setKuiz( { ...kuiz, kz_nama: e.target.value } ) }
                        value={ kuiz.kz_nama }
                        maxLength="255"
                        required
                        placeholder="Sila masukkan nama kuiz"
                    />
                </div>

                <div className="input-container">
                    <label htmlFor="ting">Tingkatan</label>
                    <select
                        id="ting"
                        value={ kuiz.kz_ting }
                        onChange={ e => setKuiz( { ...kuiz, kz_ting: e.target.value } ) }
                        required
                    >
                        {
                            senaraiTing.map( ting => (
                                <option
                                    key={ ting.kt_id }
                                    value={ ting.kt_id }
                                > { ting.kt_ting } { ting.kelas.k_nama } </option>
                            ) )
                        }
                    </select>
                </div>

                <div className="input-container">
                    <label htmlFor="tarikh">Tarikh</label>
                    <input
                        type="date"
                        value={ kuiz.kz_tarikh }
                        onChange={ e => setKuiz( { ...kuiz, kz_tarikh: e.target.value } ) }
                        required
                    />

                    <label htmlFor="jenis">Jenis</label>
                    <select
                        id="jenis"
                        value={ kuiz.kz_jenis }
                        onChange={ e => setKuiz( { ...kuiz, kz_jenis: e.target.value } ) }
                        required
                    >
                        <option value="kuiz"> Kuiz </option>
                        <option value="latihan"> Latihan </option>
                    </select>
                </div>

                <div className="input-container">
                    <label htmlFor="masa"> Masa </label>
                    <input
                        type="number"
                        disabled={ kuiz.kz_jenis === 'latihan' }
                        value={ kuiz.kz_masa === null ? 0 : kuiz.kz_masa }
                        onChange={ e => setKuiz( { ...kuiz, kz_masa: e.target.value } ) }
                    />
                </div>

                <button> <i className="fas fa-arrow-right" /> Cipta Kuiz</button>
            </BoxBody>
        </Box>
    );
}

function KuizSoalanFormBox()
{
    const { kuiz, setKuiz } = useContext( KuizBaruContext );
    const templateSoalan = {
        's_id': rand(),
        's_teks': '',
        's_gambar': null,
        jawapan: [
            {
                j_id: rand(),
                j_teks: ''
            },
            {
                j_id: rand(),
                j_teks: ''
            },
            {
                j_id: rand(),
                j_teks: ''
            },
            {
                j_id: rand(),
                j_teks: ''
            }
        ],
        jawapan_betul: {}
    };

    function addSoalan()
    {
        kuiz.soalan.push( templateSoalan );
        setKuiz( { ...kuiz } );
    }
    return (
        <Box>
            <BoxHeader>
                <i className="fas fa-plus" /> Soalan
            </BoxHeader>
            <BoxBody>
                {
                    kuiz.soalan.map( soalan => (
                        <Soalan soalan={ soalan } key={ soalan.s_id } />
                    ) )
                }
                <button type="button" className="bg5" onClick={ addSoalan }> <i className="fas fa-plus" /> Tambah Soalan </button>
            </BoxBody>
        </Box>
    );
}

function Soalan( { soalan, ...rest } )
{
    const { kuiz, setKuiz } = useContext( KuizBaruContext );
    const index = kuiz.soalan.indexOf( soalan );
    const [ gambar, setGambar ] = useState( null );
    const inputRef = createRef();

    useEffect( () =>
    {
        if ( inputRef !== null )
        {
            if ( gambar === null )
            {
                const dt = new DataTransfer();
                inputRef.current.files = dt.files;
            }
        }
    }, [ gambar, inputRef ] );
    function handleChangeTeks( e )
    {
        soalan[ 's_teks' ] = e.target.value;
        updateSoalan();
    }

    function updateSoalan()
    {
        kuiz.soalan[ index ] = soalan;
        setKuiz( { ...kuiz } );
    }

    function deleteSoalan()
    {
        kuiz.soalan.splice( kuiz.soalan.indexOf( soalan ), 1 );

        setKuiz( { ...kuiz } );
    }
    return (
        <div className="soalan">
            <div className="input-container">
                <label htmlFor={ `s-teks-${soalan.s_id}` }>Teks Soalan</label>
                <textarea
                    rows="2"
                    value={ soalan.s_teks }
                    onChange={ handleChangeTeks }
                    required
                    placeholder="Sila masukkan teks soalan."
                >
                </textarea>
            </div>

            <div className="input-container">
                <label htmlFor={ `s-gambar-${soalan.s_id}` }>Gambar</label>
                <div className="preview" style={ {
                    display: gambar !== null ? 'block' : 'none',
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
                            setGambar( null );
                            soalan[ 's_gambar' ] = null;
                            updateSoalan();
                        } }
                    >
                        &times;
                    </span>
                    <img src={ gambar ? gambar : "#" } alt="preview" style={ {
                        maxWidth: '60%'
                    } } />
                </div>

                <input
                    type="file"
                    accept="image/*"
                    ref={ inputRef }
                    onChange={ e =>
                    {
                        soalan[ 's_gambar' ] = e.target.files[ 0 ];
                        // soalan[ 's_gambar' ].append( 'gambar', e.target.value );
                        setGambar( URL.createObjectURL( e.target.files[ 0 ] ) );
                        updateSoalan();
                    } }
                />
            </div>

            <div className="input-container">
                <h4>Jawapan</h4>
                {
                    soalan.jawapan.map( jawapan => (
                        <Jawapan jawapan={ jawapan } soalan={ soalan } key={ jawapan.j_id } />
                    ) )
                }
            </div>
            <button type="button" className="bg3" onClick={ deleteSoalan }> <i className="fas fa-trash-alt" /> Padam Soalan</button>
            <hr style={ { margin: '5px 0' } } />
        </div>
    );
}

function Jawapan( { jawapan, soalan, ...rest } )
{
    const { kuiz, disabled, setKuiz } = useContext( KuizBaruContext );
    const index = kuiz.soalan[ kuiz.soalan.indexOf( soalan ) ].jawapan.indexOf( jawapan );

    function handleChangeTeks( e )
    {
        jawapan[ 'j_teks' ] = e.target.value;
        updateJawapan();
    }

    function updateJawapan()
    {
        kuiz.soalan[ kuiz.soalan.indexOf( soalan ) ].jawapan[ index ] = jawapan;

        setKuiz( { ...kuiz } );
    }

    function updateJawapanBetul()
    {
        kuiz.soalan[ kuiz.soalan.indexOf( soalan ) ].jawapan_betul = jawapan;

        setKuiz( { ...kuiz } );
    }

    return (
        <div style={ {
            display: 'flex',
            marginBottom: '5px'
        } } className="input-container">
            <input
                defaultValue={ jawapan.j_teks }
                onChange={ handleChangeTeks }
                style={ { marginBottom: '0', marginRight: '5px' } }
                required
                placeholder="Sila masukkan teks jawapan"
                disabled={ disabled }
            />
            {/* <button onClick={handleClick} disabled={jawapan.j_id === soalan.jawapan_betul.j_id} style={{background: jawapan.j_id === soalan.jawapan_betul.j_id ? '#00ff00dd' : 'initial', color: jawapan.j_id === soalan.jawapan_betul.j_id ? 'darkgreen' : 'initial', border: `2px solid ${jawapan.j_id === soalan.jawapan_betul.j_id ? 'darkgreen' : 'grey'}`, borderRadius: '5px', cursor: jawapan.j_id !== soalan.jawapan_betul.j_id ? 'pointer' : 'not-allowed'}}>
                { jawapan.j_id === soalan.jawapan_betul.j_id ? <i className="fas fa-check"/> : <i className="fas fa-minus"/> }
            </button> */}
            <div
                style={ { border: "2px solid grey", borderRadius: '5px' } }
                disabled={ jawapan.j_id === soalan.jawapan_betul.j_id || disabled }
                onClick={ updateJawapanBetul }
                className={ `${jawapan.j_id === soalan.jawapan_betul.j_id ? 'jawapan-selected' : 'jawapan'}` }
            >
                <input
                    type="radio"
                    name={ `jawapan-soalan-${soalan.s_id}` }
                    onClick={ updateJawapanBetul }
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
export default KuizBaru;