import { Switch, Route, useRouteMatch } from "react-router-dom";
import KelasBaru from "./KelasBaru";
import KelasImport from "./KelasImport";
import KelasKemaskini from "./KelasKemaskini";

export default function KelasRouteController()
{
  let { path } = useRouteMatch();
  return (
    <Switch>
      <Route path={ `${path}/baru` }>
        <KelasBaru />
      </Route>
      <Route path={ `${path}/import` }>
        <KelasImport />
      </Route>
      <Route path={ `${path}/:idKelas/kemaskini` }>
        <KelasKemaskini />
      </Route>
    </Switch>
  );
}