import React from 'react';
import { PUBLIC_URL } from '../../utils';
import ImportDataWrapper from '../ImportDataWrapper';

function KelasImport()
{
    function convertDataToKelas( data, id )
    {
        const dataKeys = Object.keys( data );
        const legalProp = {
            NamaKelas: 'k_nama'
        };

        const kelas = {
            k_id: id()
        };

        dataKeys.forEach( key =>
        {
            kelas[ legalProp[ key ] ] = data[ key ];
        } );

        return kelas;
    }

    return (
        <div>
            <ImportDataWrapper jenis="kelas" convert={ convertDataToKelas }>
                <div>
                    <small>
                        Untuk memuat naik data kelas, Sila gunakan template yang telah disediakan
                        <br />
                        <a href={ `${PUBLIC_URL}/data-kelas.csv` } download>Klik untuk download Template</a>
                    </small>
                </div>
            </ImportDataWrapper>
        </div>
    );
}

export default KelasImport;
