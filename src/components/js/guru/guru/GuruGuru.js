import
{
    useRouteMatch,
    Link,
} from 'react-router-dom';
import Box from '../../boxes/Box';
import { Url, useTitle } from '../../utils';
import { TableGuru } from '../ListTable';


export function GuruGuru()
{
    useTitle( 'Pengurusan Guru' );

    let { url } = useRouteMatch();

    return (
        <Box.Box>
            <Box.BoxHeader>
                <i className="fas fa-bars" /> Pengurusan Guru
            </Box.BoxHeader>
            <Box.BoxBody>

                <h4>Senarai Guru</h4>
                <TableGuru limit={ 10 } />

                <div style={ { marginTop: '10px' } }>
                    <Link to={ Url( `${url}/baru` ) } className="link bg5"> <i className="fas fa-plus" /> Tambah Guru </Link>
                    <Link to={ Url( `${url}/import` ) } className="link bg5" > <i className="fas fa-upload" /> Import Data Guru </Link>
                </div>
            </Box.BoxBody>
        </Box.Box >
    );
}


export default GuruGuru;