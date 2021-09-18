import
{
    useRouteMatch,
    Link
} from 'react-router-dom';
import
{
    useContext
} from 'react';
import { UserContext } from '../../contexts/UserContext';
import { API, Url, useTitle } from '../../utils';
import BoxWithTitle from '../../boxes/BoxWithTitle';
import { ListTable, ROUTES } from '../ListTable';


export function GuruKuiz()
{
    useTitle( 'Pengurusan Kuiz' );

    const user = useContext( UserContext );
    let { url } = useRouteMatch();
    const filter = user.data.g_jenis === 'admin' ? {
        // admin view
        kz_nama: 'Nama Kuiz',
        kz_jenis: 'Jenis',
        g_nama: 'Guru',
        nama_ting: 'Tingkatan',
        kz_tarikh: 'Tarikh',
        kz_masa: 'Masa',
        aksi: 'Aksi'
    } : {
        // guru view
        kz_nama: 'Nama Kuiz',
        kz_jenis: 'Jenis',
        nama_ting: 'Tingkatan',
        kz_tarikh: 'Tarikh',
        kz_masa: 'Masa',
        aksi: 'Aksi'
    };

    function getKuiz( limit, page )
    {
        const cibai = user.data.g_jenis === 'admin' ? API.getListKuiz( limit, page ) : API.getKuizByGuru( user.data.g_id, limit, page );

        return cibai;
    }

    console.log( filter );

    return (
        <BoxWithTitle>
            <h4>Senarai Kuiz</h4>
            <ListTable
                getListFunc={ getKuiz }
                limit={ 10 }
                filter={ filter }
                before={ ( data ) =>
                {
                    return {
                        ...data,
                        g_nama: data.guru.g_nama,
                        nama_ting: `${data.ting.kt_id} ${data.ting.kelas.k_nama}`,
                        kz_masa: data.kz_masa ? data.kz_masa : 'Tiada',
                        aksi: (
                            <div style={ { whiteSpace: 'nowrap' } }>
                                <Link
                                    className="table-link"
                                    to={ Url( `${ROUTES.KUIZ}/${data.kz_id}` ) }
                                    title="Maklumat Kuiz"
                                >
                                    <i className="fas fa-info-circle" />
                                </Link>
                                <Link
                                    className="success table-link"
                                    to={ Url( `${ROUTES.KUIZ}/${data.kz_id}/kemaskini` ) }
                                    title="Kemaskini Kuiz"
                                >
                                    <i className="fas fa-pen" />
                                </Link>
                                <Link
                                    className="danger table-link"
                                    to={ Url( `/guru/padam?table=kuiz&col=kz_id&val=${data.kz_id}&redir=${ROUTES.KUIZ}` ) }
                                    title="Padam Kuiz"
                                >
                                    <i className="fas fa-trash-alt" />
                                </Link>
                            </div>
                        )
                    };
                } }
            />
            <Link to={ Url( `${url}/baru` ) } className="link bg5" style={ { marginTop: '10px' } }>
                <i className="fas fa-plus" /> Tambah Kuiz
            </Link>
        </BoxWithTitle>
    );
}

export default GuruKuiz;