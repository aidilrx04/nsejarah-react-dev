import { useState, useEffect, useContext } from "react";
import { Box, BoxBody, BoxHeader } from "../boxes/Box";
import { UserContext } from "../contexts/UserContext";
import Papa from 'papaparse';
import { API, rand } from "../utils";
import ScrollToBottom from 'react-scroll-to-bottom';
<<<<<<< HEAD
import { css, /* keyframes */ } from 'glamor';
=======
import { css } from 'glamor';
>>>>>>> 6cd14c27e2c480d6a9ba7a25be44d891d2b4ed7e


const validJenis = [ 'murid', 'kelas', 'tingkatan', 'guru' ]; // kuiz is not supported

const defaultConvertFunc = () =>
{
    return Error( 'Invalid convert function' );
};

export default function ImportDataWrapper( { jenis, convert = defaultConvertFunc, children } )
{
    // prop validation
    if ( typeof jenis !== 'string' ) throw Error( 'Invalid jenis' );
    if ( validJenis.indexOf( jenis ) === -1 ) throw Error( 'Invalid jenis' );

    const user = useContext( UserContext );
    const [ csvFile, setCsvFile ] = useState( null );
    const [ isUpload, setIsUpload ] = useState( false );
    const [ isCancel, setIsCancel ] = useState( false );
    const [ isDone, setIsDone ] = useState( false );
    const [ logs, setLogs ] = useState( [] );
<<<<<<< HEAD
    const [ [ berjaya, gagal ], setResult ] = useState( [ 0, 0 ] );
=======
>>>>>>> 6cd14c27e2c480d6a9ba7a25be44d891d2b4ed7e

    useEffect( () =>
    {
        return () =>
        {
            setIsCancel( true );
            setCsvFile( null );
            setIsUpload( false );
            setIsDone( false );
            setLogs( [] );
        };
    }, [] );

    useEffect( () =>
    {
        let isUploading = !isCancel;
<<<<<<< HEAD

        if ( !( csvFile instanceof File ) ) isUploading = false;

=======

        if ( !( csvFile instanceof File ) ) isUploading = false;

>>>>>>> 6cd14c27e2c480d6a9ba7a25be44d891d2b4ed7e
        if ( isCancel )
        {
            console.log( 'cancelled' );
            addLog( 'Operation cancelled' );
        }

        if (
            isUploading && isUpload
        )
        {
            addLog( 'Uploading Data...' );
            Papa.parse( csvFile, {
                header: true,
                download: true,
                chunkSize: 512,
                skipEmptyLines: true,
                chunk: ( chunk, parser ) =>
                {
                    //debugger;

                    if ( !isUploading )
                    {
                        parser.abort();
                        return;
                    }

                    // pause chunk to complete upload all rows in current
                    // before continue
                    parser.pause();


                    const chunkData = chunk.data;

                    // function uploadData 
                    // and auto start/auto call 
                    // to upload rows starting with index 0
                    ( function uploadData( index )
                    {
                        if ( !isUploading ) return;

                        if ( index > chunkData.length - 1 )
                        {
                            // try to resume chunk loading
                            parser.resume();

                            // abort operation
                            return;
                        }
<<<<<<< HEAD

                        const row = chunkData[ index ];

                        // auto trim row
                        Object.keys( row ).forEach( ( key ) =>
                        {
                            if ( typeof row[ key ] === 'string' ) row[ key ] = row[ key ].trim();
                        } );

                        console.log( row );

                        const convertedRow = convert( row, rand );

                        if ( convertedRow instanceof Error === false )
                        {
=======

                        const row = chunkData[ index ];

                        // auto trim row
                        Object.keys( row ).forEach( ( key ) =>
                        {
                            if ( typeof row[ key ] === 'string' ) row[ key ] = row[ key ].trim();
                        } );

                        console.log( row );

                        const convertedRow = convert( row, rand );

                        if ( convertedRow instanceof Error === false )
                        {
>>>>>>> 6cd14c27e2c480d6a9ba7a25be44d891d2b4ed7e
                            // no error continue uploading

                            API.baru( convertedRow, user.token, jenis ).then( res =>
                            {
                                if ( !isUploading ) return;

                                if ( res.success )
                                {
                                    // do smthing with success
                                    console.log( 'Upload success' );
                                    addLog( `1 ${capitalize( jenis )} berjaya dimuatnaik` );
<<<<<<< HEAD
                                    setResult( rs => [ rs[ 0 ] + 1, rs[ 1 ] ] );
=======
>>>>>>> 6cd14c27e2c480d6a9ba7a25be44d891d2b4ed7e
                                }
                                else
                                {
                                    console.log( 'Upload fail' );
                                    addLog( `1 ${capitalize( jenis )} gagal dimuatnaik`, 'error' );
<<<<<<< HEAD
                                    setResult( rs => [ rs[ 0 ], rs[ 1 ] + 1 ] );
=======
>>>>>>> 6cd14c27e2c480d6a9ba7a25be44d891d2b4ed7e
                                }

                                setTimeout( () =>
                                {
                                    uploadData( index + 1 );
                                }, 250 );

                            } );
                        }
                        else
                        {
                            // do somthing with the error
                            //console.log( 'Fail to convert, Reason:' + convertedRow.message );
                            addLog( `1 ${capitalize( jenis )} gagal untuk diformat, Sebab: ${convertedRow.message}  `, 'error' );

                            // continue to the next row in chunk
                            setTimeout( () =>
                            {
                                uploadData( index + 1 );
                            }, 250 );

                        }
                    } )( 0 );


                },
                complete: () =>
                {
                    console.log( 'complete' );

                    addLog( 'Operation completed' );
                    setIsUpload( false );
                    setIsDone( true );
                }
            } );
        }

        return () =>
        {
            isUploading = false;
        };
    }, [ csvFile, isCancel, isUpload, user, convert, jenis ] );
<<<<<<< HEAD

    // useEffect( () => console.log( csvFile ), [ csvFile ] );
    // useEffect( () => console.log( logs ), [ logs ] );
    //useEffect( () => console.log( isUpload ), [ isUpload ] );
    // useEffect( () =>
    // {
    //     if ( isCancel ) console.log( 'cancel' );
    //     console.log( isCancel );
    // }, [ isCancel ] );

    function addLog( msg, type = 'message' )
    {
        const date = new Date();
        const now = `${date.getFullYear()}/${date.getMonth()}/${date.getDay()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()} ${date.getMilliseconds()}`;
        setLogs( ps => ( [ ...ps, [ msg, type, now ] ] ) );
    }

    function reset()
    {
        setIsUpload( false );
        setCsvFile( null );
        setIsCancel( false );
        setLogs( [] );
        setIsDone( false );
    }


    function handleSubmit( e )
    {
=======

    // useEffect( () => console.log( csvFile ), [ csvFile ] );
    // useEffect( () => console.log( logs ), [ logs ] );
    //useEffect( () => console.log( isUpload ), [ isUpload ] );
    // useEffect( () =>
    // {
    //     if ( isCancel ) console.log( 'cancel' );
    //     console.log( isCancel );
    // }, [ isCancel ] );

    function addLog( msg, type = 'message' )
    {
        const date = new Date();
        const now = `${date.getFullYear()}/${date.getMonth()}/${date.getDay()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()} ${date.getMilliseconds()}`;
        setLogs( ps => ( [ ...ps, [ msg, type, now ] ] ) );
    }

    function reset()
    {
        setIsUpload( false );
        setCsvFile( null );
        setIsCancel( false );
        setLogs( [] );
        setIsDone( false );
    }


    function handleSubmit( e )
    {
>>>>>>> 6cd14c27e2c480d6a9ba7a25be44d891d2b4ed7e
        e.preventDefault();
        addLog( 'File uploaded' );
        setIsUpload( true );
        setIsCancel( false );
    }
    return (
        <Box>
            <BoxHeader>
                Import Data { capitalize( jenis ) }
            </BoxHeader>
            <BoxBody>
                {
                    !isUpload && !isDone
                        ? (
                            <form onSubmit={ e => handleSubmit( e ) }>
                                <div className="input-container">
                                    <input type="file" onChange={ e => setCsvFile( e.target.files[ 0 ] ) } accept=".csv" required />
                                </div>

                                <button>
                                    <i className="fas fa-upload" /> Muat Naik
                                </button>
                            </form>
                        )
                        : (
                            <div className="process">
                                <form onSubmit={ e => e.preventDefault() }>
                                    <button className="link bg3" disabled={ isDone || isCancel } onClick={ () =>
                                    {
                                        setIsDone( true );
                                        setIsUpload( false );
                                        setIsCancel( true );
                                    } }>
                                        <i className="fas fa-times" /> Batalkan Operasi
                                    </button>

                                    <button disabled={ isUpload } onClick={ reset }>
                                        <i className="fas fa-upload" /> Muat naik fail baru
                                    </button>
                                </form>
                            </div>
                        )
                }

                <div className="process-log" style={ {
                    background: "#00000011",
                    display: isUpload || isDone ? 'block' : 'none',
                    padding: '10px 5',
                    margin: '10px 0'
                } }>
<<<<<<< HEAD
                    <div style={ {
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '5px 10px'
                    } }>
                        <h4>Process Log</h4>
                        <div>
                            { berjaya } berjaya, { gagal } gagal
                        </div>
                    </div>
                    <ScrollToBottom mode="bottom" className={ `${css( { height: 200 } )}` } >
=======
                    <h4>Process Log</h4>
                    <ScrollToBottom mode="bottom" className={ `${css( { height: 200 } )}` }>
>>>>>>> 6cd14c27e2c480d6a9ba7a25be44d891d2b4ed7e
                        <LogContent logs={ logs } />
                    </ScrollToBottom>
                </div>


                { children }
            </BoxBody>
        </Box>
    );
}

function capitalize( str )
{
    str = str.split( ' ' );
    str = str.map( word => word[ 0 ].toUpperCase() + word.substr( 1, word.length ) );

    return str.join( ' ' );
}


<<<<<<< HEAD
/* const fadeIn = keyframes( {
    from: {
        opacity: 0
    },
    to: {
        opacity: 1
    }
} ); */
=======
>>>>>>> 6cd14c27e2c480d6a9ba7a25be44d891d2b4ed7e

function LogContent( { logs = [] } )
{
    // idk what happen, the is scroll-to-bottom behaviour is actually
    // implemented by default
    /* const [ 
sticky ] = useSticky();
    const [ atBottom ] = useAtBottom();
    const scrollToBottom = useScrollToBottom();

    useEffect( () => console.log( sticky ), [ sticky ] );
    useEffect( () => console.log( atBottom ), [ atBottom ] ); */
    /* useEffect( () =>
    {
        console.log( logs );
        scrollToBottom( { behaviour: 'smooth' } );
    }, [ logs, scrollToBottom ] ); */

    return (
        <ul style={ {
<<<<<<< HEAD
            lineHeight: '1.1em',
=======
            lineHeight: '1.01em',
>>>>>>> 6cd14c27e2c480d6a9ba7a25be44d891d2b4ed7e
            fontSize: '14px'

        } } >
            {
                logs.map( ( log, index ) => (
<<<<<<< HEAD
                    <li key={ index } style={ { marginBottom: '2px', background: "#00000012", padding: '10px 0' } } className={ `${log[ 1 ] === 'error' ? css( { color: 'red' } ) : ''}` }>
=======
                    <li key={ index } style={ { marginBottom: '2px', background: "#00000012" } } className={ `${log[ 1 ] === 'error' ? css( { color: 'red' } ) : ''}` }>
>>>>>>> 6cd14c27e2c480d6a9ba7a25be44d891d2b4ed7e
                        <b style={ { color: 'black' } }> [ { log[ 2 ] } ] &gt;</b> { log[ 0 ] }
                    </li>
                ) )
            }
            <div className="emtp" style={ { height: 80 } }></div>
            {/* {
                !sticky && scrollToBottom()
            } */}
        </ul>
    );
}