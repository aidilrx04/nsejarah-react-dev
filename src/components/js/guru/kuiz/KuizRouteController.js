import { Switch, Route, useRouteMatch } from "react-router-dom";
import GuruKuiz from "./GuruKuiz";
import KuizKemaskini from "./KuizKemaskini";
import KuizBaru from "./KuizBaru";
import KuizDetail from "./KuizDetail";

export default function KuizRouteController()
{
  let { path } = useRouteMatch();
  return (
    <Switch>
      <Route exact path={path}>
        <GuruKuiz />
      </Route>
      <Route path={`${path}/baru`}>
        <KuizBaru />
      </Route>
      <Route path={`${path}/:idKuiz/kemaskini`}>
        <KuizKemaskini />
      </Route>
      <Route path={`${path}/:idKuiz`}>
        <KuizDetail />
      </Route>
    </Switch>
  );
}