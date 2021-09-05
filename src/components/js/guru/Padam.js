import { useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { Box, BoxBody, BoxHeader } from "../boxes/Box";
import { UserContext } from "../contexts/UserContext";
import { API, Url } from "../utils";

function Padam()
{

    let [ urlParams, setUrlParams ] = useState( new URLSearchParams( window.location.search ) );
    let [ data, setData ] = useState( [] );
    let history = useHistory();
    const user = useContext( UserContext );

    useEffect( () =>
    {
        if ( urlParams !== null && urlParams !== undefined )
        {
            const table = urlParams.get( 'table' );
            const column = urlParams.get( 'col' );
            const value = urlParams.get( 'val' );

            setData( [ table, column, value ] );
        }

        return () =>
        {
            setUrlParams( null );
        };
    }, [ urlParams ] );

    useEffect( () =>
    {
        if ( Object.keys( data ).length > 0 )
        {
            //delete function
            API.del( data, user.token ).then( data =>
            {
                if ( data.success )
                {
                    alert( 'Data berjaya dipadam' );
                    const redir = urlParams.get( 'redir' );
                    if ( redir )
                    {
                        history.push( Url( redir ) );
                    }
                }
                else
                {
                    alert( 'Data gagal dipadam' );
                    // console.log( data );
                    history.goBack();
                }
            } );
        }

        return () =>
        {
            if ( Object.keys( data ).length > 0 )
            {
                setData( {} );
            }
        };
    }, [ data, user, history, urlParams ] );

    return (
        <Box className="error-box">
            <BoxHeader>
                <i className="fas fa-trash-alt" /> Memadam....
            </BoxHeader>
            <BoxBody style={ {
                fontSize: '1.8em'
            } }>
                {/* <Spinner text="Memadam..." spin={true} /> */ }
                <i className="fas fa-spinner fa-spin" /> Memadam...
            </BoxBody>
        </Box>
    );
}

export default Padam;