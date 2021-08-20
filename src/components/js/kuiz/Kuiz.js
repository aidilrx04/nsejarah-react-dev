import ErrorBox from '../boxes/ErrorBox';
import { Url, useTitle } from '../utils';
import { matchPath, Route, Switch, useLocation, useRouteMatch } from 'react-router-dom';
import KuizDetail from './KuizDetail';
import KuizList from './KuizList';
import JawabKuiz from './JawabKuiz';
import NavigasiBox from '../boxes/NavigasiBox';
import UserBox from '../boxes/UserBox';
import Ulangkaji from './Ulangkaji';


function KuizRouteController()
{
    const noSideRoutes = [
        '/kuiz/:idKuiz/answer'
    ].map( route => Url( route ) );
    const { path } = useRouteMatch();
    const loc = useLocation();
    const isNoSidePath = getSidePath( loc.pathname, noSideRoutes );


    useTitle( `Kuiz` );

    // useEffect( () => console.log( path, url ), [ path, url ] );

    function getSidePath( path, routes )
    {
        let cond = false;
        routes.forEach( route =>
        {
            if ( matchPath( path, {
                path: route,
                exact: true
            } ) )
            {
                cond = true;
            }
        } );

        return cond;
    }


    if ( isNoSidePath )
    {
        return (
            <div id="mainContainer">
                <Switch>
                    <Route path={ `${path}/:idKuiz/answer` }>
                        <JawabKuiz />
                    </Route>
                </Switch>
            </div>
        );
    }

    return (
        <div id="mainContainer">
            <div id="main">
                <Switch>
                    <Route exact path={ path }>
                        <KuizList />
                    </Route>


                    <Route path={ `${path}/:idKuiz/ulangkaji/:idMurid` }>
                        <Ulangkaji />
                    </Route>

                    <Route path={ `${path}/:idKuiz` }>
                        <KuizDetail />
                    </Route>

                    <Route path="*">
                        <ErrorBox>
                            404. Laman tidak dijumpai
                            <br />
                            <small>Laman yang anda cuba untuk akses tidak dijumpai</small>
                        </ErrorBox>
                    </Route>
                </Switch>
            </div>

            <div id="side">
                <NavigasiBox />
                <UserBox />
            </div>
        </div >
    );
}




export default KuizRouteController;;;;;;