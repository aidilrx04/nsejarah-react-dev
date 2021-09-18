import { Url, useTitle } from '../../utils';
import BoxWithTitle from '../../boxes/BoxWithTitle';
import { TableKelas, TableTingkatan } from '../ListTable';
import { Link } from 'react-router-dom';


export function GuruTingkatan()
{
    useTitle( 'Pengurusan Tingkatan & Kelas' );

    return (

        <>
            <BoxWithTitle title="Pengurusan Tingkatan" icon={ <i className="fas fa-list-ol" /> }>
                <h4>Senarai Tingkatan</h4>
                <TableTingkatan limit={ 10 } />
                <div style={ { marginTop: '10px' } }>
                    <Link to={ Url( `/guru/tingkatan/baru` ) } className="link bg5">
                        <i className="fas fa-plus" /> Tambah Tingkatan
                    </Link>
                    <Link to={ Url( `/guru/tingkatan/import` ) } className="link bg5">
                        <i className="fas fa-upload" /> Import Data Tingkatan
                    </Link>
                </div>
            </BoxWithTitle>

            <BoxWithTitle title="Pengurusan Kelas" icon={ <i className="fas fa-list-ul" /> }>
                <h4>Senarai Kelas</h4>
                <TableKelas limit={ 10 } />
                <div style={ { marginTop: '10px' } }>
                    <Link to={ Url( '/guru/kelas/baru' ) } className="link bg5">
                        <i className="fas fa-plus" /> Tambah Kelas
                    </Link>
                    <Link to={ Url( '/guru/kelas/import' ) } className="link bg5">
                        <i className="fas fa-upload" /> Import Data Kelas
                    </Link>
                </div>
            </BoxWithTitle>
        </>
    );
}

export default GuruTingkatan;