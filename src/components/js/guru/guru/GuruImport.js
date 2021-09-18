<<<<<<< HEAD
import { PUBLIC_URL } from "../../utils";
=======
>>>>>>> 6cd14c27e2c480d6a9ba7a25be44d891d2b4ed7e
import ImportDataWrapper from "../ImportDataWrapper";

export default function GuruImport()
{
    const legalProps = {
        NoKPGuru: 'g_nokp',
        NamaGuru: 'g_nama',
        KatalaluanGuru: 'g_katalaluan',
        JenisGuru: 'g_jenis'
    };
<<<<<<< HEAD
    // const legalJenis = [ 'guru', 'admin' ];
    // const guruKeys = Object.keys( legalProps );
=======
    const legalJenis = [ 'guru', 'admin' ];
    const guruKeys = Object.keys( legalProps );
>>>>>>> 6cd14c27e2c480d6a9ba7a25be44d891d2b4ed7e


    function convertDataToGuru( data, generateID )
    {
<<<<<<< HEAD
        // ! NOTE(aidil): assumed data is valid by default

        const dataKeys = Object.keys( data );
        const dataLength = dataKeys.length;
        // let valid = true;

        if ( dataLength !== 4 ) return Error( 'Data tidak sah' );
=======
        const dataKeys = Object.keys( data );
        const dataLength = dataKeys.length;
        let valid = true;

        if ( dataLength !== 3 ) return Error( 'Data tidak sah' );
>>>>>>> 6cd14c27e2c480d6a9ba7a25be44d891d2b4ed7e



        const guru = {
            g_id: generateID(),
            // g_nama: '',
            // g_katalaluan: '',
            // g_jenis: ''
        };

<<<<<<< HEAD
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
=======
        const legalProp;
    }

    return (
        <ImportDataWrapper jenis="guru">

>>>>>>> 6cd14c27e2c480d6a9ba7a25be44d891d2b4ed7e
        </ImportDataWrapper>
    );
}