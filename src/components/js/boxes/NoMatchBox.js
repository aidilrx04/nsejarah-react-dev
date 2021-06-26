import { useHistory } from "react-router";
import ErrorBox from "./ErrorBox";

export function NoMatchBox()
{
    let history = useHistory();
    return (
        <ErrorBox className="flex-12">
            404. Laman tidak dijumpai
            <br/>
            <small>Anda cuba mengakses laman yang tidak wujud/dilindungi. <button onClick={() => history.goBack()}>Kembali</button></small>
        </ErrorBox>
    )
}

export default NoMatchBox;