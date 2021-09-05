import { useEffect, useState } from "react";
import { Box, BoxBody, BoxHeader } from "./boxes/Box";
import { API } from "./utils";

export default function StatisticWeb()
{
    const [ statistic, setStatistic ] = useState( null );

    useEffect( () =>
    {
        API.getStatistik().then( data =>
        {
            if ( data.success )
            {
                setStatistic( data.data );
            }
        } );

        return () =>
        {
            setStatistic( null );
        };
    }, [] );

    return (
        <Box>
            <BoxHeader>
                <i className="fas fa-chart-bar" /> Statistik Web
            </BoxHeader>
            <BoxBody>
                {
                    statistic
                        ? Object.keys( statistic ).map( key => (
                            <p key={ key } style={ { textTransform: 'capitalize' } }>
                                <b>{ key }</b>: { statistic[ key ] }
                            </p>
                        ) )
                        : ''
                }
            </BoxBody>
        </Box>
    );
}