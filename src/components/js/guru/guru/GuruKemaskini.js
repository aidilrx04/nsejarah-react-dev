import
{
    useState,
    useEffect,
    useContext
} from 'react';

import
{
    useParams,
    Redirect
} from 'react-router-dom';

import Box from '../../boxes/Box';
import { API, Url, useTitle } from '../../utils';
import { UserContext } from '../../contexts/UserContext';


export function GuruKemaskini()
{
    useTitle( 'Kemaskini Guru' );

    const user = useContext( UserContext );
    let { idGuru } = useParams();
    let [guru, setGuru] = useState( {} );
    let [newGuru, setNewGuru] = useState( {} );
    let [disabled, setDisabled] = useState( false );
    let [redirect, setRedirect] = useState( null );


    useEffect( () =>
    {
        API.getGuru( idGuru ).then( ( data ) =>
        {
            if ( data.success )
            {
                setGuru( data.data );
                setNewGuru( {} );
            }
        } );

        return () =>
        {
            setGuru( {} );
            setRedirect( null );
        };
    }, [idGuru] );

    useEffect( () =>
    {
        if ( guru.hasOwnProperty( 'g_id' ) )
        {
            setNewGuru( { ...guru } );
        }

        return () =>
        {

        };
    }, [guru] );

    useEffect( () =>
    {
        return () =>
        {
            // if( newGuru.hasOwnProperty( 'g_id' ) )
            // {
            //     setNewGuru( {} );
            // }
        };
    }, [newGuru] );

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

    function isSame()
    {
        let same = true;
        switch ( true )
        {
            case newGuru.g_nokp !== guru.g_nokp:
                same = false;
                break;
            case newGuru.g_nama !== guru.g_nama:
                same = false;
                break;
            case newGuru.g_katalaluan !== guru.g_katalaluan:
                same = false;
                break;
            case newGuru.g_jenis !== guru.g_jenis:
                same = false;
                break;

            default:
                same = true;
        }

        return same;
    }

    async function handleSubmitForm( event )
    {
        setDisabled( true );
        event.preventDefault();

        console.log( newGuru );
        API.kemaskini( newGuru, user.token, 'guru' ).then( resp =>
        {
            if ( resp.success )
            {
                API.getGuru( resp.data.g_id ).then( data =>
                {
                    setGuru( data.data );

                    setRedirect( `/guru/guru/${data.data.g_id}` );
                } );
            }

            setDisabled( false );
        } );
        // .catch( err => console.log( err ) );

    }

    return (
        <Box.Box>
            {
                redirect !== null && <Redirect to={Url( redirect )} />
            }
            <Box.BoxHeader>
                <i className="fas fa-pen" /> Kemaskini Guru
            </Box.BoxHeader>
            <Box.BoxBody>
                {
                    guru.hasOwnProperty( 'g_id' ) &&
                    <form onSubmit={e => handleSubmitForm( e )}>
                        <div className="input-container">
                            <label htmlFor="nokp">No. KP Guru</label>
                            <input
                                defaultValue={newGuru.g_nokp}
                                onChange={handleChangeNokp}
                                type="text"
                                id="nokp"
                                maxLength="12"
                                disabled={disabled}
                                required
                            />
                        </div>

                        <div className="input-container">
                            <label htmlFor="nama">Nama Guru</label>
                            <input
                                defaultValue={newGuru.g_nama}
                                onChange={handleChangeNama}
                                type="text"
                                id="nama"
                                maxLength="50"
                                disabled={disabled}
                                required
                            />
                        </div>

                        <div className="input-container">
                            <label htmlFor="katalaluan">Katalaluan Guru</label>
                            <input
                                defaultValue={newGuru.g_katalaluan}
                                onChange={handleChangeKatalaluan}
                                type="text"
                                id="katalaluan"
                                maxLength="50"
                                disabled={disabled}
                                required
                            />
                        </div>

                        <div className="input-container">
                            <label htmlFor="jenis">Jenis</label>
                            <select
                                id="jenis"
                                onChange={handleChangeJenis}
                                value={newGuru.g_jenis}
                                disabled={disabled}
                            >
                                <option value="admin"> Admin </option>
                                <option value="guru"> Guru </option>
                            </select>
                        </div>
                        <br />
                        <button
                            className="submit-btn"
                            disabled={isSame() || disabled}
                        >Kemaskini</button>
                    </form>}
            </Box.BoxBody>
        </Box.Box>
    );
}

export default GuruKemaskini;