import { useEffect, useState } from "react";
import { Box, BoxBody, BoxHeader } from "../boxes/Box";
import { API, useTitle } from "../utils";
import KuizBox from "./KuizBox";

export default function KuizList()
{
    return (
        <Box>
            <BoxHeader>
                <i className="fas fa-search" /> Cari Kuiz
            </BoxHeader>
            <BoxBody>
                <SearchForm />
            </BoxBody>
        </Box>
    );
}

function SearchForm()
{
    useTitle( 'Cari Kuiz' );

    const [ listKuiz, setListKuiz ] = useState( [] );
    const [ query, setQuery ] = useState( '' );
    const [ isLoad, setIsLoad ] = useState( false );

    function handleSubmit( e )
    {
        e.preventDefault();

        setIsLoad( false );
    }

    useEffect( () =>
    {
        return () =>
        {
            setIsLoad( false );
            setListKuiz( [] );
            setQuery( '' );
        };
    }, [] );

    useEffect( () =>
    {
        // get List kuiz
        if ( isLoad === false )
        {
            API.searchKuiz( query, {
                order: 'DESC',
                limit: 100000
            } ).then( data =>
            {
                if ( data.success )
                {
                    setListKuiz( data.data.data );
                }
                else
                {

                    // reset list
                    setListKuiz( [] );
                }

                setIsLoad( true );
            } );
        }


    }, [ query, isLoad ] );

    useEffect( () =>
    {
        console.log( listKuiz );
    }, [ listKuiz ] );
    return (
        <div className="search">
            <div className="search-form">
                <form onSubmit={ e => handleSubmit( e ) }>
                    <div
                        style={ {
                            display: 'flex'
                        } }
                    >
                        <input
                            type="search"
                            value={ query }
                            onChange={ e => setQuery( e.target.value ) }
                            placeholder='Cari Kuiz....'
                            autoFocus
                        />
                        <button><span style={ { whiteSpace: 'nowrap' } }> <i className="fas fa-search" /> Cari </span></button>
                    </div>
                </form>
            </div>
            <div className="search-result" style={ { marginTop: '10px' } }>
                <div className="kuiz-list">
                    {
                        isLoad
                            ? listKuiz.length > 0
                                ? listKuiz.map( kuiz => (
                                    <KuizBox
                                        key={ kuiz.kz_id }
                                        kuiz={ kuiz }
                                        path={ kuiz.kz_id }
                                        className="fadeIn"
                                        style={ { '--order': listKuiz.indexOf( kuiz ) } }
                                    />
                                ) )
                                : 'Tiada kuiz dijumpai'
                            : 'Memuat...'
                    }
                </div>
            </div>
        </div>
    );
}