import { Switch, Route, useRouteMatch } from "react-router-dom";
import GuruMurid from './GuruMurid';
import MuridBaru from "./MuridBaru";
import MuridDetail from "./MuridDetail";
import MuridKemaskini from "./MuridKemaskini";
import MuridImport from './MuridImport';

export default function MuridRouteController()
{
  let { path } = useRouteMatch();
  return (
    <Switch>
      <Route exact path={ path }>
        <GuruMurid />
      </Route>
      <Route path={ `${path}/baru` }>
        <MuridBaru />
      </Route>
      <Route path={ `${path}/import` }>
        <MuridImport />
      </Route>
      <Route path={ `${path}/:idMurid/kemaskini` }>
        <MuridKemaskini />
      </Route>
      <Route path={ `${path}/:idMurid` }>
        <MuridDetail />
      </Route>

    </Switch>
  );
}