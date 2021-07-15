import
{
    useState,
    useEffect,
    useContext
} from 'react';

import
{
    useParams,
    useHistory
} from 'react-router-dom';

import Box from '../../boxes/Box';
import { API, Url, useTitle } from '../../utils';
import { UserContext } from '../../contexts/UserContext';
import TailSpinLoader from '../../TailSpinLoader';
import ErrorBox from '../../boxes/ErrorBox';

export function GuruKemaskini()
{
    useTitle( 'Kemaskini Guru' );

    const user = useContext( UserContext );
    let { idGuru } = useParams();
    let [ guru, setGuru ] = useState( {} );
    let [ newGuru, setNewGuru ] = useState( {} );
    let [ disabled, setDisabled ] = useState( false );
    let [ status, setStatus ] = useState( null );
    const history = useHistory();
    const [ isLoad, setIsLoad ] = useState( false );


    useEffect( () =>
    {
        API.getGuru( idGuru ).then( ( data ) =>
        {
            if ( data.success )
            {
                setGuru( data.data );
                setNewGuru( {} );
            }
            setIsLoad( true );
        } );

        return () =>
        {
            setGuru( {} );
            setIsLoad( false );
        };
    }, [ idGuru ] );

    useEffect( () =>
    {
        if ( guru.hasOwnProperty( 'g_id' ) )
        {
            setNewGuru( { ...guru } );
        }

        return () =>
        {
            setNewGuru( g => { } );
        };
    }, [ guru ] );

    function handleChangeNokp( e )
    {
        setNewGuru( { ...newGuru, g_nokp: e.target.value } );
    }

    function handleChangeNama( e )
    {
        setNewGuru( { ...newGuru, g_nama: e.target.value } );
    }

    function handleChangeKatalaluan( e )
    {
        setNewGuru( { ...newGuru, g_katalaluan: e.target.value } );
    }

    function handleChangeJenis( e )
    {
        console.log( e.target.value );
        setNewGuru( { ...newGuru, g_jenis: e.target.value } );
    }

    async function handleSubmitForm( event )
    {
        setDisabled( true );
        event.preventDefault();
        setStatus( null );

        console.log( newGuru );
        API.kemaskini( newGuru, user.token, 'guru' ).then( data =>
        {
            console.log( data );
            if ( data.success )
            {
                alert( 'Guru berjaya dikemaskini' );
                history.push( Url( `/guru/guru/${data.data.g_id}` ) );
            }
            setStatus( data );
            setDisabled( false );
        } );
    }

    return (
        isLoad
            ? guru.hasOwnProperty( 'g_id' )
                ? <Box.Box>

                    <Box.BoxHeader>
                        <i className="fas fa-pen" /> Kemaskini Guru
                    </Box.BoxHeader>
                    <Box.BoxBody>
                        <form onSubmit={ e => handleSubmitForm( e ) }>
                            {
                                status && !status.success &&
                                <h4 className="status-fail">
                                    { status.message }
                                </h4>
                            }
                            <div className="input-container">
                                <label htmlFor="nokp">No. KP Guru</label>
                                <input
                                    defaultValue={ newGuru.g_nokp }
                                    onChange={ handleChangeNokp }
                                    type="text"
                                    id="nokp"
                                    maxLength="12"
                                    disabled={ disabled }
                                    required
                                />
                            </div>

                            <div className="input-container">
                                <label htmlFor="nama">Nama Guru</label>
                                <input
                                    defaultValue={ newGuru.g_nama }
                                    onChange={ handleChangeNama }
                                    type="text"
                                    id="nama"
                                    maxLength="50"
                                    disabled={ disabled }
                                    required
                                />
                            </div>

                            <div className="input-container">
                                <label htmlFor="katalaluan">Katalaluan Guru</label>
                                <input
                                    defaultValue={ newGuru.g_katalaluan }
                                    onChange={ handleChangeKatalaluan }
                                    type="text"
                                    id="katalaluan"
                                    maxLength="50"
                                    disabled={ disabled }
                                    required
                                />
                            </div>

                            <div className="input-container">
                                <label htmlFor="jenis">Jenis</label>
                                <select
                                    id="jenis"
                                    onChange={ handleChangeJenis }
                                    value={ newGuru.g_jenis }
                                    disabled={ disabled }
                                >
                                    <option value="admin"> Admin </option>
                                    <option value="guru"> Guru </option>
                                </select>
                            </div>
                            <button disabled={ disabled }>
                                <i className="fas fa-arrow-right" /> Kemaskini
                            </button>
                        </form>
                    </Box.BoxBody>
                </Box.Box>
                : <ErrorBox>
                    404 Data tidak dijumpai
                </ErrorBox>
            : <TailSpinLoader />

    );
}

export default GuruKemaskini;