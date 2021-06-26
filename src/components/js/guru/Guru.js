import React, { useState, useEffect, useContext, Fragment } from 'react';
import { 
    Switch,
    Route,
    useRouteMatch,
    Link
} from 'react-router-dom';

import { UserContext } from '../contexts/UserContext';

import PrivateRoute from '../PrivateRoute';
import UserBox from '../boxes/UserBox';
import Box from '../boxes/Box';
import Padam from './Padam';
import NoMatchBox from '../boxes/NoMatchBox';

//guru components
import GuruIndex from './GuruIndex';
import GuruGuru from './GuruGuru';
import GuruMurid from './GuruMurid';
import GuruTingkatan from './GuruTingkatan';
import GuruKuiz from './GuruKuiz';

//detail components
import GuruDetail from './detail/GuruDetail';
import MuridDetail from './detail/MuridDetail';
import TingkatanDetail from './detail/TingkatanDetail';
import KuizDetail from './detail/KuizDetail';

//kemaskini components
import GuruKemaskini from './kemaskini/GuruKemaskini';
import MuridKemaskini from './kemaskini/MuridKemaskini';
import TingkatanKemaskini from './kemaskini/TingkatanKemaskini';
import KuizKemaskini from './kemaskini/KuizKemaskini';
import KelasKemaskini from './kemaskini/KelasKemaskini';

//baru components
import GuruBaru from './baru/GuruBaru';
import KuizBaru from './baru/KuizBaru';
import KelasBaru from './baru/KelasBaru';
import TingkatanBaru from './baru/TingkatanBaru';
import UploadData from './UploadData';

//css
import '../../css/Navigasi.scss';
import MuridBaru from './baru/MuridBaru';
import { Url, useTitle } from '../utils';

function Guru( {...rest} )
{
    useTitle( 'Laman Guru' );

    const { user } = useContext( UserContext );
    let {path} = useRouteMatch();
    let [guru, setGuru] = useState(null);
    
    useEffect( () => {
        setGuru( user.data );

        return () => setGuru(null);
    }, [user]);

    return (
        
            guru !== null &&
            <div id="mainContainer">
            <div id="main">
                <Switch>
                    <Route exact path={( path )}>
                        <GuruIndex user={user}/>
                    </Route>

                    <PrivateRoute path={( `${path}/guru/:idGuru/kemaskini` )} only='admin'>
                        <GuruKemaskini/>
                    </PrivateRoute>

                  <PrivateRoute path={( `${path}/guru/baru` )} only="admin">
                        <GuruBaru/>
                    </PrivateRoute>

                  <PrivateRoute path={( `${path}/guru/:idGuru` )} only="admin">
                        <GuruDetail/>
                    </PrivateRoute>

                  <PrivateRoute path={( `${path}/guru` )} only="admin">
                        {/* <h3>Senarai Guru</h3> */}
                        <GuruGuru/>
                    </PrivateRoute>

                  <PrivateRoute path={( `${path}/murid/upload` )} only="admin">
                        <UploadData/>
                    </PrivateRoute>

                    <PrivateRoute path={( `${path}/murid/baru` )} only="admin">
                        <MuridBaru/>
                    </PrivateRoute>

                    <PrivateRoute path={( `${path}/murid/:idMurid/kemaskini` )} only="admin">
                        <MuridKemaskini/>
                    </PrivateRoute>

                    <PrivateRoute path={( `${path}/murid/:idMurid`)} only='admin'>
                        <MuridDetail/>
                    </PrivateRoute>

                    <PrivateRoute path={( `${path}/murid` )} only="admin">
                        {/* <h3>Senarai Murid</h3> */}
                        <GuruMurid/>
                    </PrivateRoute>

                    <PrivateRoute path={( `${path}/tingkatan/baru` )} only="admin">
                        <TingkatanBaru/>
                    </PrivateRoute>

                    <PrivateRoute path={( `${path}/tingkatan/:idTing/kemaskini` )} only="admin">
                        <TingkatanKemaskini/>
                    </PrivateRoute>

                    <PrivateRoute path={( `${path}/tingkatan/:idTing` )} only="admin">
                        <TingkatanDetail/>
                    </PrivateRoute>

                    <PrivateRoute path={( `${path}/tingkatan` )} only="admin">
                        {/* <h3>Senarai Tingkatan</h3> */}
                        <GuruTingkatan/>
                    </PrivateRoute>

                    
                    <PrivateRoute path={( `${path}/kelas/baru` )} only="admin">
                        <KelasBaru/>
                    </PrivateRoute>

                    <PrivateRoute path={( `${path}/kelas/:idKelas` )} only="admin">
                        <KelasKemaskini/>
                    </PrivateRoute>

                    <Route path={( `${path}/kuiz/baru` )}>
                        <KuizBaru/>
                    </Route>
                    <Route path={( `${path}/kuiz/:idKuiz/kemaskini` )}>
                        <KuizKemaskini/>
                    </Route>

                    <Route path={( `${path}/kuiz/:idKuiz` )}>
                        <KuizDetail/>
                    </Route>

                    <Route path={( `${path}/kuiz` )}>
                        <GuruKuiz/>
                    </Route>

                    <PrivateRoute path={( `${path}/padam` )} only="admin">
                        <Padam/>
                    </PrivateRoute>
                    
                    <Route path="*">
                        <NoMatchBox/>
                    </Route>
                </Switch>
            </div>
            <div id="side">
                <NavigasiBox>
                    <Link to={Url( `${path}` )}> <i className="fas fa-home"/> Laman Utama</Link>
                    {
                        guru.g_jenis === 'admin' &&
                        <>
                            <Link to={Url( `${path}/guru` )}> <i className="fas fa-user-graduate"/> Pengurusan Guru</Link>
                            <Link to={Url( `${path}/murid` )}> <i className="fas fa-users"/> Pengurusan Murid</Link>
                            <Link to={Url( `${path}/tingkatan` )}> <i className="fas fa-list-ol"/> Pengurusan Tingkatan</Link>
                        </>
                    }
                    <Link to={Url( `${path}/kuiz` )}> <i className="fas fa-book"/> Pengurusan Kuiz</Link>
                </NavigasiBox>
                <UserBox/>
            </div>
        </div>
        
    );
}

function NavigasiBox( {active, children, ...rest} )
{
    let flatten = [];

    if( children.length > 0 )
    {
        for( let i = 0; i < children.length; i++ )
        {
            let c = children[i];
            // console.log( c );
            if( c.type === Fragment )
            {
                // console.log( c );
                let cc = c.props.children;
                // console.log( cc.length );
                if( cc.length > 0 )
                {
                    // console.log( cc )
                    for( let j = 0; j < cc.length; j++ )
                    {
                        // console.log( j );
                        flatten.push( cc[j] );
                    }
                }
                else
                {
                    // console.log( cc );
                    flatten.push( cc );
                }
            }
            else
            {
                if( c !== false )
                {
                    flatten.push( c );
                }
            }
        }
    }
    // console.log( flatten );
    return (
        <Box.Box className="navigasi-guru">
            <Box.BoxHeader>
                <i className="fas fa-bars"/> Navigasi
            </Box.BoxHeader>
            <Box.BoxBody>
                <table className="navigasi table">
                    <tbody>
                        {
                            flatten.length > 0 &&
                            flatten.map( c => c !== null && <tr key={ flatten.indexOf( c ) } >
                                <td>{c}</td>
                            </tr> )
                        }
                    </tbody>
                </table>
            </Box.BoxBody>
        </Box.Box>
    );
}

export default Guru;