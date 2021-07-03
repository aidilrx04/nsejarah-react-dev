import { Route, Switch, useRouteMatch } from "react-router-dom";
import GuruTingkatan from "./GuruTingkatan";
import TingkatanBaru from './TingkatanBaru';
import TingkatanDetail from './TingkatanDetail';
import TingkatanKemaskini from './TingkatanKemaskini';


export default function TingkatanRouteController()
{
  let { path } = useRouteMatch();
  return (
    <Switch>
      <Route exact path={path}>
        <GuruTingkatan />
      </Route>
      <Route path={`${path}/baru`}>
        <TingkatanBaru />
      </Route>
      <Route path={`${path}/:idTing/kemaskini`}>
        <TingkatanKemaskini />
      </Route>
      <Route path={`${path}/:idTing`}>
        <TingkatanDetail />
      </Route>
    </Switch>
  );
}