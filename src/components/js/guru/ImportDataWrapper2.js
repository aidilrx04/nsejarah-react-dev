import { useContext, useEffect, useState, createContext } from "react";
import { UserContext } from "../contexts/UserContext";
import Papa from 'papaparse';
import { API, rand } from '../utils';

export const STATUS = {
    NOT_START: 'Not Start',
    FILE_UPLOAD: 'File dimuat naik',
    UPLOADING: '<i className="fas fa-spinner fa-spin"/> Memuat naik Data...',
    CANCELLED: 'Operasi dibatalkan',
    DONE: 'Data selesai dimuat naik'
};

const defaultStatus = {
    status: STATUS.NOT_START,
    file: null
};

export default function ImportDataWrapper( { convert, jenis, children } )
{


    const [ file, setFile ] = useState( null );
    const [ status, setStatus ] = useState( () => defaultStatus );
    const user = useContext( UserContext );
    const [ isCancel, setIsCancel ] = useState( false );
    const [ errors, setErrors ] = useState( [] );
    const [ logs, setLogs ] = useState( [] );
    const validJenis = [ 'murid', 'kelas', 'tingkatan', 'guru' ]; // kuiz is not supported


    // validate jenis
    if ( validJenis.indexOf( jenis ) < 0 ) throw Error( `Invalid Jenis. '${jenis}' is not a valid jenis` );

    // valid convert func
    if ( typeof convert !== 'function' ) throw Error( 'Invalid convert function. `convert` property must be a function' );

    useEffect( () =>
    {
        return () =>
        {
            setFile( null );
            setStatus( defaultStatus );
            setIsCancel( false );
        };
    }, [] );

    function addLog( msg, type = 'message' )
    {
        const date = new Date();
        const now = `${date.getFullYear()}/${date.getMonth()}/${date.getDay()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()} ${date.getMilliseconds()}`;
        setLogs( ps => ( [ ...ps, [ msg, type, now ] ] ) );
    }

    function addError( msg )
    {
        const date = new Date();
        const now = `${date.getFullYear()}/${date.getMonth()}/${date.getDay()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()} ${date.getMilliseconds()}`;

        setErrors( ps => [ [ msg, now ], ...ps ] );
    }

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
                        //console.log( converted );

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

                                setTimeout( () =>
                                {
                                    uploadData( index + 1 );
                                }, 200 );
                            } );
                        }
                        else
                        {
                            addLog( 'fail convert' );
                            addError( '1 fail to convert' );
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

    const additionalProps = { upload, cancel, reset, status, errors, STATUS };

    children = children ? ( Array.isArray( children ) ? children : [ children ] ).map( ( { type: ChildType, props } ) =>
    {
        // pass necessary props
        return <ChildType { ...props } { ...additionalProps } key={ rand() } />;
    } ) : children;
    return children;
}

export function getStatus( s )
{
    return (
        <span>
            {
                s === STATUS.NOT_START
                    ? <span>Not Start</span>
                    : s === STATUS.FILE_UPLOAD
                        ? <span><i className="fas fa-upload"></i> Fail dimuatnaik</span>
                        : s === STATUS.UPLOADING
                            ? <span><i className="fas fa-spinner" /> Memuat naik data</span>
                            : s === STATUS.CANCELLED
                                ? <span><i className="fas fa-times" /> Operasi dibatalkan oleh pengguna</span>
                                : s === STATUS.DONE
                                    ? <span><i className="fas fa-check" /> Data selesai dimuatnaik</span>
                                    : '?'
            }
        </span>
    );
}