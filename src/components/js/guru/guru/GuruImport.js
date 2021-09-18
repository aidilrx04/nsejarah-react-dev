import { PUBLIC_URL } from "../../utils";
import ImportDataWrapper from "../ImportDataWrapper";

export default function GuruImport()
{
    const legalProps = {
        NoKPGuru: 'g_nokp',
        NamaGuru: 'g_nama',
        KatalaluanGuru: 'g_katalaluan',
        JenisGuru: 'g_jenis'
    };
    // const legalJenis = [ 'guru', 'admin' ];
    // const guruKeys = Object.keys( legalProps );


    function convertDataToGuru( data, generateID )
    {
        // ! NOTE(aidil): assumed data is valid by default

        const dataKeys = Object.keys( data );
        const dataLength = dataKeys.length;
        // let valid = true;

        if ( dataLength !== 4 ) return Error( 'Data tidak sah' );



        const guru = {
            g_id: generateID(),
            // g_nama: '',
            // g_katalaluan: '',
            // g_jenis: ''
        };

        dataKeys.forEach( key =>
        {
            guru[ legalProps[ key ] ] = data[ key ];
        } );

        return guru;
    }

    return (
        <ImportDataWrapper jenis="guru" convert={ convertDataToGuru }>
            <div>
                <br />

                <small>
                    <p>
                        Untuk memuat naik data guru, Sila gunakan template yang telah disediakan
                        <br />
                        <a href={ `${PUBLIC_URL}/data-guru.csv` } download>Klik untuk download Template</a>
                    </p>
                </small>
            </div>
        </ImportDataWrapper>
    );
}