import { PUBLIC_URL, Url } from '../../utils';
import { Link } from "react-router-dom";
import ImportDataWrapper from "../ImportDataWrapper";
import { TableTingkatan } from "../ListTable";
import BoxWithTitle from "../../boxes/BoxWithTitle";

export default function MuridImport()
{
    function convertToMuridObj( data, generateID )
    {
        console.log( Object.keys( data ).length !== 4 );

        // validate data need to have 4 properties only
        // verifyObject(data, mustHaveProp)
        if ( Object.keys( data ).length !== 4 ) return Error( "Data tidak sah" );

        const muridObj = {
            m_id: generateID()
        };
        const legalProps = {
            NoKPMurid: 'm_nokp',
            NamaMurid: 'm_nama',
            KatalaluanMurid: 'm_katalaluan',
            IDTingkatan: 'm_kelas'
        };

        // insert prop to muridObj
        Object.keys( legalProps ).forEach( key =>
        {
            muridObj[ legalProps[ key ] ] = data[ key ];
        } );



        return muridObj;
    }
    return (
        <>
            <ImportDataWrapper jenis="murid" convert={ convertToMuridObj }>
                <div>
                    <br />

                    <small>
                        <p>
                            Untuk memuat naik data murid, Sila gunakan template yang telah disediakan
                            <br />
                            <a href={ `${PUBLIC_URL}/data-murid.csv` } download>Klik untuk download Template</a>
                        </p>
                        <p>
                            Untuk melihat senarai <strong>ID Tingkatan</strong> sila pergi ke <Link to={ Url( '/guru/tingkatan' ) } target="_blank">Senarai Tingkatan</Link> atau lihat senarai tingkatan di bawah
                        </p>
                    </small>
                </div>
            </ImportDataWrapper>
            {/* <SenaraiTingkatan /> */ }
            <BoxWithTitle title="Senarai Tingkatan">
                <TableTingkatan
                    filter={ { kt_id: "ID Tingkatan", nama_ting: 'Nama Tingkatan', g_nama: 'Nama Guru' } }
                    applyBefore={ ( d ) => ( { ...d, nama_ting: `${d.kt_ting} ${d.kelas.k_nama}`, g_guru: d.guru.g_nama } ) }
                    limit={ 10 }
                />
            </BoxWithTitle>
        </>
    );
}
