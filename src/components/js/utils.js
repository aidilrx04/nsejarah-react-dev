import { useEffect } from "react";

export const baseUrl = 'http://localhost/nsejarah-react/';
export const PUBLIC_URL = process.env.PUBLIC_URL;

export async function baru( data, token, jenis = 'murid' )
{
    const target = 'api/baru.php';
    const request = await fetch( baseUrl + target + '?jenis=' + jenis,
        {
            method: 'POST',
            headers:
            {
                'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify( { data: data } )
        });

    const response = await request.json();
    return response;
}

export async function kemaskini( dataKemaskini, token, jenis = 'murid', )
{
    const target = 'api/kemaskini.php';
    const request = await fetch( baseUrl + target + '?jenis=' + jenis, {
        method: 'POST',
        headers: {
            'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify( {data: dataKemaskini} )
    } );

    const response = await request.json();

    return response;

}

export async function getKuizByTing( idTing )
{
    const target = 'api/kuiz.php';

    const request = await fetch( baseUrl + target + '?id_ting=' + idTing );

    const data = await request.json();

    return data;
}

export async function getJawapanMurid( idMurid, idKuiz )
{
    const target = 'api/leaderboard.php';

    const request = await fetch( `${baseUrl}${target}?id=${idKuiz}&id_murid=${idMurid}` );

    const data = request.json();

    return data;
}

export async function getKelas( idKelas = null )
{
    const target = 'api/kelas.php';
    const request = await fetch( `${baseUrl}${target}` + (idKelas !== null ? `?id_kelas=${idKelas}` : '') );

    const data = request.json();

    return data;
}

export async function login( nokp, katalaluan, jenis = 'murid' )
{
    const target = 'api/login.php';
    const request = await fetch( baseUrl + target, 
        {
            method: 'POST',
            headers: { 'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8' },
            body: JSON.stringify( {data: {nokp, katalaluan, jenis}} )
        }
    );

    // console.log( request );

    const data = request.json();

    return data;
}

export async function del( data, token )
{
    const target = 'api/padam.php';
    const request = await fetch( baseUrl + target, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/xxx-form-urlencoded; charset=UTF-8',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify( {data: [...data]} )
    });
    const resp = await request.json();

    return resp;
}

export function rand()
{
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let r = '';
    for( let i = 0; i < 100; i++ )
    {
      let n = Math.floor(Math.random() * chars.length);
      let c = chars[n];
      r += c;
    }
    return r;
} 


export async function getKuiz( id = null )
{
    const query = `?id=${id}`;
    const target = 'api/kuiz.php';
    const request = await fetch( `${baseUrl}${target}${query}` );

    // console.log( url );
    // console.log( await request.text()  );
    const data = await request.json();
    // console.log( data );
    return data;
}

export async function searchKuiz( keyword = null, options = {})
{
    const query = new URLSearchParams({keyword, ...options}).toString();
    const target = 'api/search.php';
    const request = await fetch( `${baseUrl}${target}?${query}` );
    const data = await request.json();

    return data;
}

export async function getJawapan( idJawapan ) {
    const target = 'api/get.php';
    const request = await fetch( `${baseUrl}${target}?type=jawapan&id=${idJawapan}` );

    const data = await request.json();
    return data;
}
export async function getSoalan( idSoalan ) {
    const target = 'api/get.php';
    const request = await fetch( `${baseUrl}${target}?type=soalan&id=${idSoalan}` );

    const data = await request.json();
    return data;
}

export function Url( url )
{
    // console.log( PUBLIC_URL );
    if( url.substr( 0, PUBLIC_URL.length) === PUBLIC_URL )
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
  return url.replace(/([^:]\/)\/+/g, "$1");
}

// + react

/**
 * Set the current page title
 * @param string title Title
 * @return void
 */
export function useTitle(title, separator = '|', postfix = 'NSejarah')
{
    useEffect( () => document.title = `${title} ${separator} ${postfix}`, [title, separator, postfix]);
}