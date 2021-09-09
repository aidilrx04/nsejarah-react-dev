import { useContext, useEffect, useState, useMemo } from "react";
import { Box, BoxBody, BoxHeader } from "../../boxes/Box";
import Papa from 'papaparse';
import { API, PUBLIC_URL, rand, Url } from '../../utils';
import { Link } from "react-router-dom";
import { UserContext } from '../../contexts/UserContext';

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
        <ImportDataWrapper convert={ convertToMuridObj } jenis="murid">
            <ImportDataForm />
            {/* <SenaraiTingkatan /> */ }
        </ImportDataWrapper>
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
            </BoxBody>
        </Box>
    );
}

// export default function MuridImport()
// {

//     const [ file, setFile ] = useState( null );
//     const [ logs, setLogs ] = useState( [/* [message: string, type: string, time: string] */ ] );
//     const [ isUpload, setIsUpload ] = useState( false );
//     const user = useContext( UserContext );

//     useEffect( () =>
//     {
//         return () =>
//         {
//             setIsUpload( false );
//             setFile( null );
//         };
//     }, [] );

//     useEffect( () =>
//     {
//         // note(aidil): only upload file when submit btn is click   
//         if ( isUpload && file !== null ) 
//         {
//             Papa.parse( file, {
//                 header: true,
//                 complete( data )
//                 {
//                     addLog( 'File loaded' );

//                     // check error
//                     const errors = data.errors;
//                     if ( errors.length > 0 )
//                     {
//                         console.log( file );
//                         errors.forEach( ( error ) =>
//                         {
//                             const code = error.code;
//                             let msg = 'ERROR: ';

//                             console.log( error );
//                             switch ( code )
//                             {
//                                 case 'TooFewFields':
//                                     msg += `Data yang diperlukan tidak mencukupi pada baris. ${error.row + 1}.`;
//                                     break;
//                                 case 'TooManyFields':
//                                     msg += `Data yang berlebihan dikesan pada baris ${error.row + 1}`;
//                                     break;

//                                 default:
//                                     break;
//                             }

//                             addLog( msg, 'error' );
//                         } );
//                     }

//                     addLog( 'Uploading data...' );

//                     // NOTE(aidil): upload data starts with the index 0
//                     ( function upload( index )
//                     {
//                         if ( data.data[ index ] && isUpload )
//                         {
//                             const _data = data.data[ index ];
//                             const converted = convertToMuridObj( _data );

//                             if ( converted )
//                             {
//                                 API.baru( converted, user.token, 'murid' ).then( _data =>
//                                 {
//                                     if ( isUpload ) // prevent react from updating component after dismount
//                                     {
//                                         if ( _data.success )
//                                         {
//                                             addLog( `Murid ${converted.m_nokp} upload success` );
//                                         }
//                                         else
//                                         {
//                                             addLog( `Murid ${converted.m_nokp} upload failed. Reason: ` + _data.message );
//                                         }
//                                         upload( index + 1 );
//                                     }

//                                 } );
//                             }
//                             else
//                             {
//                                 upload( index + 1 );
//                                 //console.log( converted );
//                                 addLog( `A murid failed to convert into the right object` );
//                             }
//                         }
//                         else
//                         {
//                             addLog( 'Done.' );
//                             //console.log( data.data.length > 0 ? 'Done' :  );
//                         }
//                     } )( 0 );

//                     setIsUpload( false );


//                 },
//                 error( err ) { console.log( err ); }
//             } );
//         }
//     }, [ isUpload, file, user ] );

//     function handleSubmit( e )
//     {
//         e.preventDefault();
//         addLog( 'Uploading file...' );
//         setIsUpload( true );
//     }

//     function addLog( msg, type = 'message' )
//     {
//         const date = new Date();
//         const now = `${date.getFullYear()}/${date.getMonth()}/${date.getDay()} ${date.getHours()}:${date.getSeconds()} ${date.getMilliseconds()}`;
//         setLogs( l => [ ...l, [ `${now} > ${msg}`, type ] ] );
//     }

//     function convertToMuridObj( data )
//     {
//         // validate data need to have 4 properties only
//         // verifyObject(data, mustHaveProp)
//         if ( Object.keys( data ).length !== 4 ) return;

//         // trim xtra space in data
//         Object.keys( data ).forEach( k =>
//         {
//             data[ k ] = data[ k ].trim();
//         } );

//         const muridObj = {
//             m_id: rand()
//         };
//         const legalProps = {
//             NoKPMurid: 'm_nokp',
//             NamaMurid: 'm_nama',
//             KatalaluanMurid: 'm_katalaluan',
//             IDTingkatan: 'm_kelas'
//         };

//         // insert prop to muridObj
//         Object.keys( legalProps ).forEach( key =>
//         {
//             muridObj[ legalProps[ key ] ] = data[ key ];
//         } );



//         return muridObj;

//     }

//     return (
//         <>
//             <Box>
//                 <BoxHeader>
//                     <i className="fas fa-upload" /> Import Data Murid
//                 </BoxHeader>
//                 <BoxBody>
//                     <form onSubmit={ e =>
//                     {
//                         return handleSubmit( e );
//                     } }>
//                         <div className="input-container">
//                             <input
//                                 disabled={ isUpload }
//                                 type="file"
//                                 accept=".csv"
//                                 onChange={ e => setFile( e.target.files[ 0 ] ) }
//                                 required
//                             />
//                         </div>
//                         <button disabled={ isUpload } >Submit</button>
//                         <br />
//                         { isUpload && <small>PERINGATAN: Jangan tutup laman sewaktu memuat naik data untuk mengelakkan kerosakan data</small> }
//                     </form>

//                     <div className="log" style={ {
//                         //display: isUpload ? 'block' : 'none',
//                         background: '#00000011',
//                         height: '200px',
//                         overflow: 'auto',
//                         padding: '10px 5px',
//                         margin: '10px 0'
//                     } }>
//                         <h4>Log</h4>

//                         <ul style={ {
//                             lineHeight: '1.01em',
//                             fontSize: '14px'
//                         } }>
//                             {
//                                 logs.map( log => (
//                                     <li key={ logs.indexOf( log ) } style={ { marginBottom: '2px', background: "#00000012" } }>
//                                         <small>{ log[ 0 ] }</small>
//                                     </li>
//                                 ) )
//                             }
//                         </ul>
//                     </div>
//                     <div>
//                         <br />
//                         <p>
//                             Untuk memuat naik data murid, Sila gunakan template yang telah disediakan
//                             <br />
//                             <a href={ `${PUBLIC_URL}/data-murid.csv` } download>Klik untuk download Template</a>
//                         </p>
//                         <p>
//                             Untuk melihat senarai <strong>ID Tingkatan</strong> sila pergi ke <Link to={ Url( '/guru/tingkatan' ) } target="_blank">Senarai Tingkatan</Link> atau lihat senarai tingkatan di bawah
//                         </p>
//                     </div>
//                 </BoxBody>
//             </Box >

//             {/* <SenaraiTingkatan /> */ }

//             <ImportDataWrapper convert={ convertToMuridObj } jenis="murid">
//                 <TestWrap />
//             </ImportDataWrapper>
//         </>
//     );
// }



const STATUS = {
    NOT_START: 0,
    FILE_UPLOAD: 1,
    UPLOADING: 2,
    CANCELLED: 3,
    DONE: 4
};
function ImportDataWrapper( { convert, jenis, children } )
{

    const defaultStatus = {
        status: STATUS.NOT_START,
        logs: [],
        file: null
    };
    const [ file, setFile ] = useState( null );
    const [ status, setStatus ] = useState( () => defaultStatus );
    const user = useContext( UserContext );
    const [ isCancel, setIsCancel ] = useState( false );
    const validJenis = [ 'murid', 'kelas', 'tingkatan', 'guru' ]; // kuiz is not supported


    // validate jenis
    if ( validJenis.indexOf( jenis ) < 0 ) throw Error( `Invalid Jenis. '${jenis}' is not a valid jenis` );

    // valid convert func
    if ( typeof convert !== 'function' ) throw Error( 'Invalid convert function. `convert` property must be a function' );

    useEffect( () =>
    {
        console.log( 'mount' );
        return () =>
        {
            console.log( 'dismount' );
        };
    }, [] );

    function upload( file )
    {
        updateStatus( STATUS.FILE_UPLOAD, file );
        setFile( file );
    }

    function updateStatus( status, file = undefined )
    {
        setStatus( ps => ( { ...ps, status: status, file: file ? file : file === undefined ? ps.file : file } ) );
    }

    function reset()
    {
        setStatus( defaultStatus );
        setIsCancel( false );
        setFile( null );
    }

    function cancel()
    {
        updateStatus( STATUS.CANCELLED );
        addLog( "operation cancelled" );
        setIsCancel( true );
    }

    useEffect( () =>
    {
        let isUpload = !isCancel;
        /* console.log( file );
        console.log( isUpload );
        console.log( convert );
        console.log( jenis ); */

        if ( !( file instanceof File ) ) isUpload = false;

        console.log( isUpload );
        if ( file instanceof File &&
            isUpload === true &&
            convert instanceof Function &&
            typeof jenis === 'string' )
        {
            updateStatus( STATUS.UPLOADING );
            Papa.parse( file, {
                header: true,
                download: true,
                chunkSize: 1024,
                chunk: ( row, parser ) =>
                {
                    // abort operation the component is dismount
                    if ( !isUpload )
                    {
                        parser.abort();
                        return;
                    }
                    parser.pause();
                    // console.log( 'run ', count + 1, isUpload );
                    // ++count;

                    ( function uploadData( index )
                    {
                        // abort operation the component is dismount
                        if ( !isUpload ) return;

                        // complete batch upload
                        if ( index > row.data.length - 1 ) return;

                        const data = row.data[ index ];
                        const converted = convert( data, rand );
                        console.log( converted );

                        if ( converted )
                        {
                            API.baru( converted, user.token, jenis ).then( res =>
                            {
                                if ( res.success )
                                {
                                    addLog( `${jenis} upload success` );
                                }
                                else
                                {
                                    addLog( `${jenis} upload failed`, 'error' );
                                }

                                uploadData( index + 1 );
                            } );
                        }
                        else
                        {
                            addLog( 'fail convert' );
                        }

                    } )( 0 );

                    //continue operation /* if convert func return falsy */
                    setTimeout( () =>
                    {
                        parser.resume();

                    }, 2000 );
                },
                complete: () =>
                {
                    console.log( 'done' );
                    updateStatus( STATUS.DONE );
                }
            } );
        }
        else
        {
            console.log( 'Not pass' );
        }

        return () =>
        {
            isUpload = false;
        };
    }, [ file, isCancel, user, convert, jenis ] );


    function addLog( msg, type = 'message' )
    {
        const date = new Date();
        const now = `${date.getFullYear()}/${date.getMonth()}/${date.getDay()} ${date.getHours()}:${date.getSeconds()} ${date.getMilliseconds()}`;
        setStatus( ps => ( { ...ps, logs: [ ...ps.logs, [ msg, type, now ] ] } ) );
    }

    const additionalProps = { upload, cancel, reset, status, STATUS };

    children = children ? ( Array.isArray( children ) ? children : [ children ] ).map( ( { type: ChildType, props } ) =>
    {
        // pass necessary props
        return <ChildType { ...props } { ...additionalProps } key={ rand } />;
    } ) : children;
    return children;
}