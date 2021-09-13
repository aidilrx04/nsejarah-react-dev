import ImportDataWrapper from "../ImportDataWrapper";

export default function GuruImport()
{
    const legalProps = {
        NoKPGuru: 'g_nokp',
        NamaGuru: 'g_nama',
        KatalaluanGuru: 'g_katalaluan',
        JenisGuru: 'g_jenis'
    };
    const legalJenis = [ 'guru', 'admin' ];
    const guruKeys = Object.keys( legalProps );


    function convertDataToGuru( data, generateID )
    {
        const dataKeys = Object.keys( data );
        const dataLength = dataKeys.length;
        let valid = true;

        if ( dataLength !== 3 ) return Error( 'Data tidak sah' );



        const guru = {
            g_id: generateID(),
            // g_nama: '',
            // g_katalaluan: '',
            // g_jenis: ''
        };

        const legalProp;
    }

    return (
        <ImportDataWrapper jenis="guru">

        </ImportDataWrapper>
    );
}