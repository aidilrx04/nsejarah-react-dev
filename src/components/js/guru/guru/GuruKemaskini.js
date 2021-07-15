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
            }
            setIsLoad( true );
        } );

        return () =>
        {
            setGuru( {} );
            setIsLoad( false );
        };
    }, [ idGuru ] );

    async function handleSubmitForm( event )
    {
        setDisabled( true );
        event.preventDefault();
        setStatus( null );

        API.kemaskini( guru, user.token, 'guru' ).then( data =>
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
                                    value={ guru.g_nokp }
                                    onChange={ e => setGuru( { ...guru, g_nokp: e.target.value } ) }
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
                                    value={ guru.g_nama }
                                    onChange={ e => setGuru( { ...guru, g_nama: e.target.value } ) }
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
                                    value={ guru.g_katalaluan }
                                    onChange={ e => setGuru( { ...guru, g_katalaluan: e.target.value } ) }
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
                                    onChange={ e => setGuru( { ...guru, g_jenis: e.target.value } ) }
                                    value={ guru.g_jenis }
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