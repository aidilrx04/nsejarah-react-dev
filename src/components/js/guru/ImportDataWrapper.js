import { useContext, useEffect, useState } from "react/cjs/react.development";
import { UserContext } from "../contexts/UserContext";
import Papa from 'papaparse';
import { API, rand } from '../utils';

export const STATUS = {
    NOT_START: 0,
    FILE_UPLOAD: 1,
    UPLOADING: 2,
    CANCELLED: 3,
    DONE: 4
};

const defaultStatus = {
    status: STATUS.NOT_START,
    logs: [],
    file: null
};
export default function ImportDataWrapper( { convert, jenis, children } )
{


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
        const now = `${date.getFullYear()}/${date.getMonth()}/${date.getDay()} ${date.getHours()}:${date.getSeconds()} ${date.getMilliseconds()}`;
        setStatus( ps => ( { ...ps, logs: [ ...ps.logs, [ msg, type, now ] ] } ) );
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

    const additionalProps = { upload, cancel, reset, status, STATUS };

    children = children ? ( Array.isArray( children ) ? children : [ children ] ).map( ( { type: ChildType, props } ) =>
    {
        // pass necessary props
        return <ChildType { ...props } { ...additionalProps } key={ rand() } />;
    } ) : children;
    return children;
}