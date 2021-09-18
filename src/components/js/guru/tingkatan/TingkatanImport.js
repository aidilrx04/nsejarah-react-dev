import BoxWithTitle from '../../boxes/BoxWithTitle';
import { PUBLIC_URL } from '../../utils';
import ImportDataWrapper from '../ImportDataWrapper';
import { TableGuru, TableTingkatan } from '../ListTable';

function TingkatanImport()
{
    function convertDataToTingkatan( data, id )
    {
        const dataKeys = Object.keys( data ),
            legalProps = {
                Tingkatan: 'kt_ting',
                IDKelas: 'kt_kelas',
                IDGuruTingkatan: 'kt_guru'
            },
            tingkatan = {
                kt_id: id()
            };

        if ( dataKeys.length !== 3 ) return Error( 'Data tidak sah' );


        dataKeys.forEach( key =>
        {
            tingkatan[ legalProps[ key ] ] = data[ key ];
        } );

        console.log( tingkatan );

        return tingkatan;


    }
    return (
        <div>
            <ImportDataWrapper jenis="tingkatan" convert={ convertDataToTingkatan }>
                <div>
                    <small>
                        Untuk memuat naik data tingkatan, Sila gunakan template yang telah disediakan
                        <br />
                        <a href={ `${PUBLIC_URL}/data-tingkatan.csv` } download>Klik untuk download Template</a>
                    </small>

                </div>
            </ImportDataWrapper>
            <BoxWithTitle title="Senarai Tingkatan">

                <TableTingkatan

                    filter={ {
                        kt_id: 'ID Tingkatan',
                        nama_ting: 'Nama Tingkatan'
                    } }
                    limit={ 10 }
                    applyBefore={
                        addNamaTing
                    }
                />
            </BoxWithTitle>
            <BoxWithTitle title="Senarai Guru">
                <TableGuru limit={ 10 } filter={ {
                    g_id: 'ID',
                    g_nama: 'Nama',
                    g_nokp: 'No. KP'
                } } />
            </BoxWithTitle>

        </div>
    );
}

function addNamaTing( ting )
{

    return { ...ting, nama_ting: `${ting.kt_ting} ${ting.kelas.k_nama}` };
}

export default TingkatanImport;
