import React from 'react';


export function Box( { className = '', children, ...rest } )
{
    return (
        <div className={`box ${className}`} {...rest} >
            {children}
        </div>
    );
}

export function BoxHeader( { className = '', children, right, ...rest } )
{
    return (
        <div className={`box-header ${className}`} {...rest}>
            <h3 style={{ display: 'inline-block' }}>{children}</h3>
            <div className="header-right">
                {
                    right
                }
            </div>
        </div>
    );
}

export function BoxBody( { className = '', children, ...rest } )
{
    return (
        <div className={`box-body ${className}`} {...rest}>
            {children}
        </div>
    );
}

const exportFunc = { Box, BoxHeader, BoxBody };

export default exportFunc;

// export default {Box: Box, BoxHeader: BoxHeader, BoxBody: BoxBody};