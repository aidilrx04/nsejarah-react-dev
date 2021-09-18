import { Box, BoxBody, BoxHeader } from "./Box";

export default function BoxWithTitle( { title, icon, children, ...rest } )
{
    return (
        <Box { ...rest }>
            <BoxHeader>
                { icon } { title }
            </BoxHeader>
            <BoxBody>
                { children }
            </BoxBody>
        </Box>
    );
}