import { createContext, Fragment, useEffect, useState } from "react";
import { useParams } from "react-router";
import { Box, BoxBody, BoxHeader } from "../../boxes/Box";
import ErrorBox from "../../boxes/ErrorBox";
import { getKuiz } from "../../utils";

const KuizContext = createContext();

export function KuizProvider( { value = {}, children,...rest } )
{
    return <KuizContext.Provider>
        <KuizKemaskini />
    </KuizContext.Provider>
}


export function KuizKemaskini( {user, ...rest} )
{
    useEffect(() => document.title = 'Kemaskini Kuiz', []);

    let {idKuiz} = useParams();
    let [valid, setValid] = useState(true);
    let [found, setFound] = useState(true)
    let [kuiz, setKuiz] = useState({});
    let [newKuiz, setNewKuiz] = useState({});
    let [userData, setUserData] = useState({});
    
    useEffect( () => {
        user.getUserData().then( data => {
            setUserData(data);
        });

        getKuiz( idKuiz ).then( data => {
            if( data.success )
            {
                setKuiz( data.data );
            }
            else
            {
                setFound(false);
            }
        });
    }, [idKuiz, user] );

    useEffect( () => {
        if( userData.hasOwnProperty('g_id') && kuiz.hasOwnProperty('kz_id') )
        {
            //check if kz_guru == g_id && admin then ok
            //check if kz_guru == g_id && not admin then ok
            //check if kz_guru != g_id && not admin then not ok
            // console.log( userData.g_id );
            // console.log( kuiz.kz_guru );
            if( ( userData.g_id === kuiz.kz_guru ) || ( userData.g_jenis === 'admin' ) )
            {
                // console.log( kuiz );
                kuiz.soalan.setSoalan = function (i, n)
                {
                    this[i] = n;
                }
                setNewKuiz( {...kuiz} );
                setValid(true);
            }
            else
            {
                setValid( false );
            }
        }
    }, [userData, kuiz]);

    useEffect( () => {
        // console.log( newKuiz.soalan );
    }, [newKuiz]);
    return (
        <>
        {
            valid && found && newKuiz.hasOwnProperty('kz_id') &&
            <>
                <Box>
                    <BoxHeader>
                        <i className="fas fa-pen"/> Kemaskini Kuiz
                    </BoxHeader>
                    <BoxBody>
                        <form>
                            <div>
                                <h3>Maklumat Kuiz</h3>

                                <label htmlFor="nama">Nama Kuiz:</label>
                                <input defaultValue={newKuiz.kz_nama} type="text" id="nama" maxLength="200" required/>
                                
                                <label htmlFor="tarikh">Tarikh Kuiz:</label>
                                <input defaultValue={newKuiz.kz_tarikh} type="date" id="tarikh" min={`${new Date().getDate()}-${new Date().getMonth()}-${new Date().getFullYear()}`} required/>

                                <label htmlFor="jenis">Jenis Kuiz:</label>
                                <select defaultValue={newKuiz.kz_jenis} id="jenis">
                                    <option value="latihan"> Latihan </option>
                                    <option value="kuiz"> Kuiz </option>
                                </select>

                                <label htmlFor="masa">Masa Kuiz('kuiz' sahaja): </label>
                                <input type="number" min="1" max="1000" defaultValue={newKuiz.kz_jenis === 'latihan' ? '' : newKuiz.kz_masa} disabled={newKuiz.kz_jenis === 'latihan'}/>
                            </div>

                            <button type="button" onClick={e => console.log(newKuiz.soalan)}>Papar Soalan</button>
                        </form>
                    </BoxBody>
                </Box>

                <Box>
                    <BoxHeader>
                    <i className="fas fa-list-ol"/> Senarai Soalan
                    </BoxHeader>
                </Box>
            </>
        }
        {
            !found &&
            <ErrorBox>
                404. Tiada data dijumpai
                <br/>
                <small>Tiada data berkenaan kuiz dengan ID: {idKuiz} dijumpai</small>
            </ErrorBox>
        }
        {
            !valid &&
            <ErrorBox>
                403. Akses tanpa kebenaran
                <br/>
                <small>Anda cuba mengakses laman yang dilindungi</small>
            </ErrorBox>
        }
        </>
    );
}

export default KuizKemaskini;