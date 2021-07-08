import { useEffect, useState } from "react";

export const API_URL = 'http://localhost/nsejarah-react/';
export const PUBLIC_URL = process.env.PUBLIC_URL;

//error callbacks
export class ErrorCallback
{
    static errorCallback = {};


    static call( type )
    {
        const callbacks = this.errorCallback[type];

        if ( Array.isArray( callbacks ) )
        {
            for ( let callback of callbacks )
            {
                callback();
            }
        }
    }

    static getCallback( type = null )
    {
        if ( type ) return this.errorCallback[type] || [];
        return this.errorCallback;
    }

    static setCallback( type, callback )
    {
        //prevent non callback 
        if ( typeof callback !== 'function' ) return;

        if ( !Array.isArray( this.errorCallback[type] ) )
        {
            this.errorCallback[type] = [];
        }

        this.errorCallback[type].push( callback );
    }
}

// API CALLS
export class API
{
    static API_URL = '';
    static CONTENT_TYPES = ['application/xxx-form-urlencoded; charset=UTF-8'];
    static options = {
        method: 'GET'
    };


    static setApiUrL( url )
    {
        if ( url[url.length - 1] === '/' )
        {
            url = url.substr( 0, url.length - 1 );
        }
        this.API_URL = url;
    }

    static setHead( head )
    {
        this.options = {
            method: head[0],
            headers: {
                'Content-Type': this.CONTENT_TYPES[head[1]],
                'Authorization': head[2] ? `Bearer ${head[2]}` : ''
            },
            body: head[3]
        };
    }

    static revertHead()
    {
        this.options = {
            method: 'GET'
        };
    }

    static async request( to, options = undefined )
    {
        if ( this.API_URL.length === 0 ) throw new Error( 'Please set url first' );
        const request = await fetch( API_URL + to, options ? options : this.options );
        const status = request.status;
        const response = await request.json();
        const responseStatus = parseInt( response.code );

        if ( ( status >= 300 || status < 200 ) )
        {
            // call error callbacks
            ErrorCallback.call( status );
        }

        if ( responseStatus < 200 || responseStatus >= 300 )
        {
            ErrorCallback.call( responseStatus );
        }

        this.revertHead();

        return response;
    }

    static async login( nokp, katalaluan, jenis = 'murid' )
    {
        const target = '/api/login.php';
        this.setHead( [
            'POST',
            0,
            null,
            JSON.stringify( { data: { nokp, katalaluan, jenis } } )
        ] );

        const request = await this.request( target );

        return request;
    }

    static async baru( data, token, jenis = 'murid' )
    {
        const target = '/api/baru.php';
        this.setHead( [
            'POST',
            0,
            token,
            JSON.stringify( { data: data } )
        ] );
        const request = await this.request( `${target}?jenis=${jenis}` );
        return request;
    }

    static async kemaskini( data, token, jenis = 'murid', )
    {
        const target = '/api/kemaskini.php';
        this.setHead( [
            'POST',
            0,
            token,
            JSON.stringify( { data: data } )
        ] );
        const request = await this.request( `${target}?jenis=${jenis}` );

        return request;

    }

    static async getKuizTing( idTing )
    {
        const target = '/api/kuiz.php';

        const request = await this.request( `${target}?id_ting=${idTing}` );

        return request;
    }

    static async getJawapanMurid( idMurid, idKuiz )
    {
        const target = '/api/leaderboard.php';

        const request = await this.request( `${target}?id_kuiz=${idKuiz}&id_murid=${idMurid}` );

        return request;
    }

    static async getKelas( idKelas )
    {
        const target = '/api/kelas.php';
        const request = await this.request( `${target}?id_kelas=${idKelas}` );

        return request;
    }

    static async getListKelas( limit = 10, page = 1 )
    {
        const target = '/api/kelas.php';
        return await this.request( `${target}?limit=${limit}&page=${page}` );
    }



    static async del( data, token )
    {
        const target = '/api/padam.php';
        this.setHead( [
            'POST',
            0,
            token,
            JSON.stringify( { data: [...data] } )
        ] );
        const request = await this.request( target );
        return request;
    }

    static async getKuiz( id )
    {
        const query = `?id_kuiz=${id}`;
        const target = '/api/kuiz.php';
        const request = await this.request( `${target}${query}` );
        return request;
    }

    static async getListKuiz( limit = 10, page = 1 )
    {
        const target = '/api/kuiz.php';
        return await this.request( `${target}?limit=${limit}&page=${page}` );
    }

    static async searchKuiz( keyword = undefined, options = {} )
    {
        const query = new URLSearchParams( { keyword, ...options } ).toString();
        const target = '/api/search.php';
        const request = await this.request( `${target}?${query}` );

        return request;
    }

    static async getJawapan( idJawapan )
    {
        const target = '/api/get.php';
        const request = await this.request( `${target}?type=jawapan&id=${idJawapan}` );

        return request;
    }
    static async getSoalan( idSoalan )
    {
        const target = '/api/get.php';
        const request = await this.request( `${target}?type=soalan&id=${idSoalan}` );

        return request;
    }
    static async getLeaderboard( idKuiz )
    {
        const target = 'api/leaderboard.php';
        const request = await this.request( `${target}?id_kuiz=${idKuiz}` );
        return request;
    }
    static async getKuizByGuru( idGuru, limit = 10, page = 1 )
    {
        const target = '/api/kuiz.php';
        const request = await this.request( `${target}?id_guru=${idGuru}&limit=${limit}&page=${page}` );

        return request;
    }

    static async getGuru( idGuru )
    {
        let tambahan = `?id_guru=${idGuru}`;
        const target = '/api/guru.php';
        const request = await this.request( target + tambahan );


        return request;
    }

    static async getListGuru( limit = 10, page = 1 )
    {
        return this.request( `/api/guru.php?limit=${limit}&page=${page}` );
    }


    static async getMurid( idMurid = null )
    {
        const target = '/api/murid.php';
        const tambahan = idMurid !== null ? `?id_murid=${idMurid}` : '';
        const request = await this.request( target + tambahan );

        return request;
    }

    static async getListMurid( limit = 10, page = 1 )
    {
        return await this.request( `/api/murid.php?limit=${limit}&page=${page}` );
    }

    static async getMuridTing( idTing )
    {
        const target = '/api/murid.php';
        const request = await this.request( target + '?id_ting=' + idTing );
        return request;
    }

    static async getListMuridTing( limit = 10, page = 1 )
    {
        const target = '/api/murid.php';
        return await this.request( target + `?limit=${limit}&page=${page}` );
    }

    static async getTingkatan( idTing )
    {
        const target = '/api/tingkatan.php';
        const tambahan = `?id_ting=${idTing}`;
        const request = await this.request( target + tambahan );

        return request;
    }

    static async getListTingkatan( limit = 10, page = 1 )
    {
        const target = '/api/tingkatan.php';
        return await this.request( target + `?limit=${limit}&page=${page}` );
    }

    static async getListTingkatanGuru( idGuru, limit = 10, page = 1 )
    {
        const target = '/api/tingkatan.php';
        const request = await this.request( `${target}?id_guru=${idGuru}&limit=${limit}&page=${page}` );

        return request;
    }


}

export function rand()
{
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let r = '';
    for ( let i = 0; i < 100; i++ )
    {
        let n = Math.floor( Math.random() * chars.length );
        let c = chars[n];
        r += c;
    }
    return r;
}

export function Url( url )
{
    // console.log( PUBLIC_URL );
    if ( url.substr( 0, PUBLIC_URL.length ) === PUBLIC_URL )
    {
        return clearUrl( url );
    }
    else 
    {
        return clearUrl( PUBLIC_URL + url );
    }
}

export function clearUrl( url )
{
    return url.replace( /([^:]\/)\/+/g, "$1" );
}

export function range( n )
{
    const arr = [];
    for ( let i = 0; i < n; i++ )
    {
        arr.push( i );
    }

    return arr;
}

// + react

/**
 * Set the current page title
 * @param string title Title
 * @return void
 */
export function useTitle( title, separator = '|', postfix = 'NSejarah' )
{
    useEffect( () => document.title = `${title} ${separator} ${postfix}`, [title, separator, postfix] );
}

export function usePaging( initial = {} )
{
    const template = {
        limit: 10,
        page: 1,
        count: 0,
        has_next: false,
        init: true,
        loading: true
    };
    const [paging, setPaging] = useState( () => ( { ...template, ...initial } ) );

    function displayPaging()
    {
        return (
            <div className="paging">
                {
                    true &&
                    <button
                        className="prev-page"
                        disabled={paging.page === 1 || paging.loading}
                        onClick={() => setPaging( p => ( { ...p, loading: true, page: p.page - 1 } ) )}
                    >
                        &lt; Sebelumnya
                    </button>

                }

                <span className={`current-page show`}>
                    {paging.page}
                </span>
                {
                    true &&
                    <button
                        className="next-page"
                        disabled={!paging.has_next || paging.loading}
                        onClick={() =>
                        {
                            setPaging( p => ( { ...p, loading: true, page: p.page + 1 } ) );
                        }}
                    >
                        Seterusnya &gt;
                    </button>
                }

            </div>
        );
    }

    return [paging, setPaging, displayPaging];
}
