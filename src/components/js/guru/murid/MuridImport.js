import { useEffect, useState } from "react";
import { Box, BoxBody, BoxHeader } from "../../boxes/Box";
import { API, PUBLIC_URL, Url } from '../../utils';
import { Link } from "react-router-dom";
import ImportDataWrapper from "../ImportDataWrapper";

export default function MuridImport()
{
    function convertToMuridObj( data, generateID )
    {
        console.log( Object.keys( data ).length !== 4 );

        // validate data need to have 4 properties only
        // verifyObject(data, mustHaveProp)
        if ( Object.keys( data ).length !== 4 ) return Error( "Data tidak sah" );

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
            <ImportDataWrapper jenis="murid" convert={ convertToMuridObj }>
                <div>
                    <br />

                    <small>
                        <p>
                            Untuk memuat naik data murid, Sila gunakan template yang telah disediakan
                            <br />
                            <a href={ `${PUBLIC_URL}/data-murid.csv` } download>Klik untuk download Template</a>
                        </p>
                        <p>
                            Untuk melihat senarai <strong>ID Tingkatan</strong> sila pergi ke <Link to={ Url( '/guru/tingkatan' ) } target="_blank">Senarai Tingkatan</Link> atau lihat senarai tingkatan di bawah
                        </p>
                    </small>
                </div>
            </ImportDataWrapper>
            <SenaraiTingkatan />
        </>
    );
}

/* export default function MuridImport()
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
} */

// function ImportDataForm( props )
// {
//     const { upload, cancel, reset, status, STATUS, errors } = props;
//     const [ file, setFile ] = useState( () => status.file || null );
//     const isUploading = status.status !== STATUS.NOT_START && status.status !== STATUS.DONE;

//     function handleSubmit( e )
//     {
//         e.preventDefault();
//         upload( file );
//     }

//     return (
//         <Box>
//             <BoxHeader>
//                 <i className="fas fa-upload" /> Import Data Murid
//             </BoxHeader>
//             <BoxBody>
//                 <form onSubmit={ e => handleSubmit( e ) }>
//                     {
//                         status.status === STATUS.NOT_START
//                             ? <>
//                                 <div className="input-container">
//                                     <input
//                                         disabled={ isUploading }
//                                         type="file"
//                                         accept=".csv"
//                                         onChange={ e => setFile( e.target.files[ 0 ] ) }
//                                         required
//                                     />
//                                 </div>

//                                 <button disabled={ isUploading } >Submit</button>
//                             </>
//                             : <div className="uploading">
//                                 <button className="link bg3" onClick={ cancel } disabled={ status.status !== STATUS.UPLOADING }>
//                                     Cancel
//                                 </button>
//                                 <button disabled={ status.status === STATUS.UPLOADING } onClick={ reset }>
//                                     Upload new
//                                 </button>
//                                 <br />
//                                 <small>PERINGATAN: Jangan tutup laman sewaktu memuat naik data untuk mengelakkan kerosakan data</small>
//                             </div>
//                     }

//                 </form>

//                 <div style={ { padding: 10, display: status.status !== STATUS.NOT_START ? 'block' : 'none' } }>
//                     {/* <b>Status: </b>{ getStatus( status.status ) } */ }
//                 </div>

//                 <div className="error">
//                     {
//                         errors.map( err => (
//                             <div key={ errors.indexOf( err ) }>
//                                 { err[ 0 ] }
//                             </div>
//                         ) )
//                     }
//                 </div>

//                 <div>
//                     <br />


//                     <p>
//                         Untuk memuat naik data murid, Sila gunakan template yang telah disediakan
//                         <br />
//                         <a href={ `${PUBLIC_URL}/data-murid.csv` } download>Klik untuk download Template</a>
//                     </p>
//                     <p>
//                         Untuk melihat senarai <strong>ID Tingkatan</strong> sila pergi ke <Link to={ Url( '/guru/tingkatan' ) } target="_blank">Senarai Tingkatan</Link> atau lihat senarai tingkatan di bawah
//                     </p>
//                 </div>

//                 <br />

//             </BoxBody>
//         </Box>
//     );
// }
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


// function DisplayLog( props )
// {
//     const _container = createRef( null );
//     const _blankElem = createRef( null );

//     const { show, logs } = props;

//     function scrollDown()
//     {

//         if ( _container.current && _blankElem.current ) 
//         {
//             const { current: container } = _container;
//             const { current: blank } = _blankElem;

//             console.log( container.scrollHeight, container.clientHeight, blank.offsetTop );

//             container.scrollBehaviour = 'smooth';
//             //container.scrollTop = blank.offsetTop - container.clientHeight;
//             container.scroll( 0, -container.scrollHeight );

//             //container.scrollTop = blank.offsetTop - 10;
//             //blank.scrollIntoView();
//         }
//         //if ( _dummyScroller.current )
//         //  _dummyScroller.current.scrollIntoView();

//         return true;
//     }

//     useEffect( scrollDown, [ logs ] );
//     return (
//         <div className="log" style={ {
//             // display: show ? 'block' : 'none',
//             background: '#00000011',
//             height: '200px',
//             overflow: 'auto',
//             padding: '10px 5px',
//             margin: '10px 0',
//             // scrollBehavior: 'smooth'
//         } }
//             ref={ _container }
//         >
//             {/* <button onClick={ scrollDown }>Scroll</button> */ }
//             <h4>Log</h4>

//             {
//                 logs.map( log =>
//                 {
//                     return (
//                         <li key={ logs.indexOf( log ) } /* style={ { marginBottom: '2px', background: "#00000012" } } */>
//                             <small> <b>{ log[ 2 ] } &gt; </b> { log[ 0 ] }</small>
//                         </li>
//                     );
//                 } )
//             }

//             <div ref={ _blankElem } style={ { /* height: '80%' */ } } ></div>
//         </div>
//     );
// }

// const CSS_ROOT = css( {
//     height: '200px'
// } );

// function DisplayLogs( { logs = [], show = false } )
// {
//     return (
//         <div /* style={ {
//             height: '200px',
//             overflow: 'auto'
//         } } */>
//             <h4>Log History</h4>

//             <ScrollToBottom mode="bottom" className={ `${css( { height: 200 } )}` }>
//                 <LogContent logs={ logs } />
//             </ScrollToBottom>
//         </div>
//     );
// }

// function LogContent( { logs } )
// {
//     const scrollToBottom = useScrollToBottom();
//     const [ sticky ] = useSticky();
//     useEffect( () =>
//     {
//         console.log( sticky );
//     }, [ sticky ] );
//     //useEffect( () => scrollToBottom( 'smooth' ), [ logs ] );
//     return (
//         <>

//             <ul /*  style={ {
//                 lineHeight: '1.01em',
//                 fontSize: '14px'

//             } } */>

//                 {
//                     logs.map( log =>
//                     {
//                         return (
//                             <li key={ logs.indexOf( log ) } /* style={ { marginBottom: '2px', background: "#00000012" } } */>
//                                 <small> <b>{ log[ 2 ] } &gt; </b> { log[ 0 ] }</small>
//                             </li>
//                         );
//                     } )
//                 }
//             </ul>
//             {
//                 !sticky && scrollToBottom( { behaviour: 'smooth' } )
//             }
//         </>
//     );
// }