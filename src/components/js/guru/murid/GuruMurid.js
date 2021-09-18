import
{
    useRouteMatch,
    Link
} from 'react-router-dom';
import { Url, useTitle } from '../../utils';
import { TableMurid } from '../ListTable';
import BoxWithTitle from '../../boxes/BoxWithTitle';

export function GuruMurid( { user, ...rest } )
{
    useTitle( 'Pengurusan Murid' );
    let { url } = useRouteMatch();

    return (
        <BoxWithTitle icon={ <i className="fas fa-users" /> } title="Pengurusan Murid">
            <h4>Senarai Murid</h4>
            <TableMurid limit={ 10 } />

            <div style={ { marginTop: '10px' } }>
                <Link className="link bg5" to={ Url( `${url}/baru` ) }>
                    <i className="fas fa-plus" /> Tambah Murid
                </Link>
                <Link className="link bg5" to={ Url( `${url}/import` ) }>
                    <i className="fas fa-upload" /> Import Data Murid
                </Link>
            </div>

        </BoxWithTitle>
    );
}

export default GuruMurid;