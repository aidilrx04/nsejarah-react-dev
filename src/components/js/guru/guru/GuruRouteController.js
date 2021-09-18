import { Route, Switch, useRouteMatch } from "react-router-dom";
import GuruGuru from "./GuruGuru";
import GuruDetail from './GuruDetail';
import GuruBaru from './GuruBaru';
import GuruKemaskini from './GuruKemaskini';
import GuruImport from "./GuruImport";

export default function GuruRouteController()
{

  let { path } = useRouteMatch();

  return (
    <Switch>
      <Route exact path={ path }>
        <GuruGuru />
      </Route>
      <Route exact path={ `${path}/baru` }>
        <GuruBaru />
      </Route>
      <Route exact path={ `${path}/import` }>
        <GuruImport />
      </Route>
      <Route path={ `${path}/:idGuru/kemaskini` }>
        <GuruKemaskini />
      </Route>
      <Route path={ `${path}/:idGuru` }>
        <GuruDetail />
      </Route>
    </Switch>
  );
}