import csv from './data-murid.csv';

Papaparse.parse( csv, {
    download: true,
    step: ( row ) =>
    {
        console.log( row );
    },
    complete: () =>
    {
        console.log( done );
    }
} );