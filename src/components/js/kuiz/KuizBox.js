import React from 'react';
import { BoxBody } from '../boxes/Box';
import
{
    useHistory
} from 'react-router-dom';
import { clearUrl, Url } from '../utils';
import Skeleton from 'react-loading-skeleton';

function KuizBox( { className, kuiz, ...rest } )
{
    let history = useHistory();

    function redir()
    {
        const target = '/kuiz';
        let rurl = `${target}/${kuiz.kz_id}`;
        rurl = clearUrl( rurl );
        // console.log( rurl );
        history.push( Url( rurl ) );
        console.log( 'Oh uea' );
    }


    return (
        <BoxBody className={`KuizBox ${className ? className : ''}`} {...rest} onClick={redir}>
            <div className="content">
                <h4 className="title"> {/* <i className="far fa-star"/> */} {kuiz.kz_nama} {/* <i className="far fa-star"/> */}</h4>
                <p>
                    <li className="color3">
                        <i className="fas fa-list" /> {kuiz.soalan.length} soalan
                    </li>
                    <li className="color4">
                        <i className="far fa-clock" /> {kuiz.kz_tarikh}
                    </li>
                    <li className="color5">
                        <i className="far fa-user" /> {kuiz.guru.g_nama}
                    </li>
                </p>
            </div>
        </BoxBody >
    );
}

export function KuizBoxSkeleton( props )
{
    return (
        <BoxBody className="KuizBox" {...props}>

            <Skeleton height="20" />

            <p>
                <Skeleton width="30%" />
                <Skeleton width="80%" />
                <Skeleton width="60%" />
            </p>
        </BoxBody>
    );
}

export default KuizBox;