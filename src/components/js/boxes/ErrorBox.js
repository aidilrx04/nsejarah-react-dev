import { useEffect } from 'react';
import Box from './Box';

export function ErrorBox({ children, ...rest })
{
    useEffect(() => document.title = "RALAT", []);
    return (
        <Box.Box {...rest}>
            <Box.BoxHeader>
                <i className="fas fa-exclamation-triangle"/> Ralat
            </Box.BoxHeader>
            <Box.BoxBody style={{padding: '0px'}}>
                <div style={{display: 'flex', minHeight: '400px', backgroundColor: '#ff000077', justifyContent: 'center', alignItems: 'center', textAlign: 'center', flexDirection: 'column', padding: '5px 10px'}}>
                    <div style={{width: '100%'}}>
                        <i className="fas fa-exclamation-triangle" style={{fontSize: '50px'}}/>
                    </div>
                    <div style={{fontSize: '25px'}}>
                        {children}
                    </div>
                </div>
            </Box.BoxBody>
        </Box.Box>
    );
}

export default ErrorBox;