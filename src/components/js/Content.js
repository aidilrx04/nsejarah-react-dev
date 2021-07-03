import
{
    Route,
    Switch,
} from 'react-router-dom';
import Main from './Main';
import KuizRouteController from './kuiz/Kuiz';
import GuruPageRouteController from './guru/Guru';
import PrivateRoute from './PrivateRoute';
import ErrorBox from './boxes/ErrorBox';
import { Url } from './utils';

function Content()
{
    return (
        <Switch>
            <Route exact path={Url( "/" )} >
                <Main />
            </Route>
            <Route path={Url( "/kuiz/:idKuiz" )}>
                <KuizRouteController />
            </Route>
            <PrivateRoute path={Url( "/guru" )} only="guru">
                <GuruPageRouteController />
            </PrivateRoute>
            <Route path="*">
                <div id="mainContainer">
                    <ErrorBox>
                        404. Page Not Found!
                        <br />
                        <small>The page you requested is not found.</small>
                    </ErrorBox>
                </div>
            </Route>
        </Switch>
    );
}

/* function UserKuiz()
{
    let {idKuiz, idUser} = useParams();
    return (
        <h1>Kuiz Page with ID: {idKuiz} and Subpath user with id: {idUser}</h1>
    );
}
 */
/* function Kuiz()
{

    let {idKuiz} = useParams();
    let [loaded, setLoaded] = useState( false );
    let [kuiz, setKuiz] = useState( async () => await loadKuiz( idKuiz ) )
    async function loadKuiz( id )
    {
        const url = 'http://localhost/nsejarah-react';
        const target = 'api/kuiz.php';
        const query = 'id=' + id;
        const rurl = `${url}/${target}?${query}`;


        let response = await fetch( rurl );
        let data = await response.json();

        setLoaded( true );
        setKuiz( data.data);
    }


    return (
        <>
            <div id="mainContainer">
                <div id="main">
                    <Box className="Kuiz">
                        <BoxHeader>Kuiz</BoxHeader>
                        <BoxBody  style={{height: '400px', position: 'relative'}}>
                            <div>
                                <h2>{kuiz.kz_nama}</h2>
                                {Object.keys(kuiz).length > 0 && Object.keys( kuiz ).map( key => <li>{key}: {kuiz[key]}</li> ) }
                            </div>

                            { !loaded && <div  style={{height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                                <Spinner text="Memuat" style={{fontSize: '35px', fontWeight: 'bold'}}/>
                            </div> }
                        </BoxBody>
                    </Box>
                </div>
                <div id="side">
                    asdafsdgds
                </div>
            </div>
        </>
    );
} */

// function KuizUser()
// {
//     let {userId} = useParams();
//     return (<h1>Kuiz with usr page: {userId}</h1>);
// }

/* function Id()
{
    let {path} = useRouteMatch();
    // let {id} = useParams();
    return (
        <Switch>
            <Route exact path={path}>
                <h1>ID Route</h1>
            </Route>
            <Route path={`${path}/location`}>
                <h1>ID Location</h1>
            </Route>
        </Switch>
    );
} */

export default Content;