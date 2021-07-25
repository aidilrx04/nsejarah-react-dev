import { useEffect, useState } from "react";
import { API_URL, shuffle } from "../utils";

// update_callback expect a function that update the current soalan
export default function Soalan( {
    soalan,
    update_callback = null,
    disabled = false,
    shuffle: shuffleJawapan = false,
    showAnswer = true,
    ...rest
} )
{
    const [ senaraiJawapan, setSenaraiJawapan ] = useState( [] );

    useEffect( () =>
    {
        if ( shuffleJawapan )
        {
            shuffle( soalan.jawapan );
        }
        setSenaraiJawapan( soalan.jawapan );

        return () =>
        {
            setSenaraiJawapan( [] );
        };
    }, [ soalan, shuffleJawapan ] );
    return (
        <div className="soalan" { ...rest }>
            <div className="soalan-teks">
                <span>{ soalan.s_teks }</span>

                {
                    soalan.s_gambar &&
                    <img className="soalan-teks-gambar" src={ ( soalan.s_gambar.startsWith( 'http' ) ? '' : API_URL + '/image/' ) + soalan.s_gambar } alt="" />
                }
            </div>
            <div className="soalan-jawapan-container">
                {
                    senaraiJawapan.map( jawapan => (
                        <button
                            key={ jawapan.j_id }
                            className={ `soalan-jawapan ${soalan.jawapan_murid !== undefined
                                ? soalan.jawapan_murid === jawapan.j_id
                                    ? soalan.jawapan_murid === soalan.jawapan_betul.j_id
                                        ? 'jawapan-betul'
                                        : 'jawapan-salah'
                                    : soalan.jawapan_betul.j_id === jawapan.j_id
                                        ? 'jawapan-betul'
                                        : ''
                                : ''
                                }` }
                            disabled={ ( update_callback && !disabled ) ? false : true }
                            onClick={ ( e ) =>
                            {
                                soalan.jawapan_murid = jawapan.j_id;
                                if ( typeof update_callback === 'function' )
                                    update_callback( soalan );
                            } }
                        >
                            <span>
                                { jawapan.j_teks } {
                                    soalan.jawapan_murid !== undefined
                                        ? soalan.jawapan_murid === jawapan.j_id
                                            ? soalan.jawapan_murid === soalan.jawapan_betul.j_id
                                                ? <i className="fas fa-check" />
                                                : <i className="fas fa-times" />
                                            : jawapan.j_id === soalan.jawapan_betul.j_id
                                                ? <i className="fas fa-check" />
                                                : ''
                                        : ''
                                }
                            </span>
                        </button>
                    ) )
                }
            </div>
        </div >
    );
}