import { useEffect, useState } from "react";
import { Box, BoxBody, BoxHeader } from "../../boxes/Box";
import { API, PUBLIC_URL, Url } from '../../utils';
import { Link } from "react-router-dom";
import ImportDataWrapper from "../ImportDataWrapper";


export default function MuridImport()
{
    function convertToMuridObj( data, generateID )
    {
        // validate data need to have 4 properties only
        // verifyObject(data, mustHaveProp)
        if ( Object.keys( data ).length !== 4 ) return;

        // trim xtra space in data
        Object.keys( data ).forEach( k =>
        {
            data[ k ] = data[ k ].trim();
        } );

        const muridObj = {
            m_id: generateID()
        };
        const legalProps = {
            NoKPMurid: 'm_nokp',
            NamaMurid: 'm_nama',
            KatalaluanMurid: 'm_katalaluan',
            IDTingkatan: 'm_kelas'
        };

        // insert prop to muridObj
        Object.keys( legalProps ).forEach( key =>
        {
            muridObj[ legalProps[ key ] ] = data[ key ];
        } );



        return muridObj;

    }
    return (
        <>
            <ImportDataWrapper convert={ convertToMuridObj } jenis="murid">
                <ImportDataForm />
            </ImportDataWrapper>
            <SenaraiTingkatan />
        </>
    );
}

function ImportDataForm( props )
{
    const { upload, cancel, reset, status, STATUS } = props;
    const { logs } = status;
    const [ file, setFile ] = useState( () => status.file || null );
    const isUploading = status.status !== STATUS.NOT_START && status.status !== STATUS.DONE;

    function handleSubmit( e )
    {
        e.preventDefault();
        upload( file );
    }
    return (
        <Box>
            <BoxHeader>
                <i className="fas fa-upload" /> Import Data Murid
            </BoxHeader>
            <BoxBody>
                <form onSubmit={ e => handleSubmit( e ) }>
                    {
                        status.status === STATUS.NOT_START
                            ? <>
                                <div className="input-container">
                                    <input
                                        disabled={ isUploading }
                                        type="file"
                                        accept=".csv"
                                        onChange={ e => setFile( e.target.files[ 0 ] ) }
                                        required
                                    />
                                </div>
                                <button disabled={ isUploading } >Submit</button>
                            </>
                            : <div className="uploading">
                                <button className="link bg3" onClick={ cancel } disabled={ status.status !== STATUS.UPLOADING }>
                                    Cancel
                                </button>
                                <button disabled={ status.status === STATUS.UPLOADING } onClick={ reset }>
                                    Upload new
                                </button>
                                <br />
                                <small>PERINGATAN: Jangan tutup laman sewaktu memuat naik data untuk mengelakkan kerosakan data</small>
                            </div>
                    }

                </form>

                <div className="log" style={ {
                    display: status.status !== STATUS.NOT_START ? 'block' : 'none',
                    background: '#00000011',
                    height: '200px',
                    overflow: 'auto',
                    padding: '10px 5px',
                    margin: '10px 0'
                } }>
                    <h4>Log</h4>

                    <ul style={ {
                        lineHeight: '1.01em',
                        fontSize: '14px'
                    } }>
                        {
                            logs.map( log => (
                                <li key={ logs.indexOf( log ) } style={ { marginBottom: '2px', background: "#00000012" } }>
                                    <small> <b>{ log[ 2 ] } &gt; </b> { log[ 0 ] }</small>
                                </li>
                            ) )
                        }
                    </ul>
                </div>
                <div>
                    <br />
                    <p>
                        Untuk memuat naik data murid, Sila gunakan template yang telah disediakan
                        <br />
                        <a href={ `${PUBLIC_URL}/data-murid.csv` } download>Klik untuk download Template</a>
                    </p>
                    <p>
                        Untuk melihat senarai <strong>ID Tingkatan</strong> sila pergi ke <Link to={ Url( '/guru/tingkatan' ) } target="_blank">Senarai Tingkatan</Link> atau lihat senarai tingkatan di bawah
                    </p>
                </div>

                <br />

            </BoxBody>
        </Box>
    );
}
function SenaraiTingkatan()
{
    const [ listTing, setListTing ] = useState( [] );
    const [ isLoad, setIsLoad ] = useState( false );

    useEffect( () =>
    {
        return () =>
        {
            setListTing( [] );
            setIsLoad( false );
        };
    }, [] );

    useEffect( () =>
    {
        API.getListTingkatan( 99999 ).then( data =>
        {
            if ( data.success )
            {
                setListTing( data.data.data );
            }
            setIsLoad( true );
        } );
    }, [] );


    return (
        <Box id="senarai-tingkatan">
            <BoxHeader>
                Senarai Tingkatan
            </BoxHeader>
            <BoxBody>
                {
                    isLoad
                        ? listTing.length > 0
                            ? <>
                                <table className="table center table-content">
                                    <thead>
                                        <tr>
                                            <th>ID Tingkatan</th>
                                            <th>Nama Tingkatan</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            listTing.map( ting => (
                                                <tr key={ ting.kt_id }>
                                                    <td>{ ting.kt_id }</td>
                                                    <td>{ ting.kt_ting } { ting.kelas.k_nama }</td>
                                                </tr>
                                            ) )
                                        }
                                    </tbody>
                                </table>
                            </>
                            : 'Tiada Tingkatan ditemui'
                        : 'Loading...'
                }
            </BoxBody>
        </Box>
    );
}

