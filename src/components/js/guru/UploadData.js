import { Box, BoxBody } from "../boxes/Box";
import Ding from '../kuiz/ding.mp3';

export function UploadData()
{
    function playSound()
    {
        let sound = new Audio(Ding);
        sound.play();
    }
    return (
        <Box>
            <BoxBody>
                <button onClick={playSound}>Play SOund</button>
            </BoxBody>
        </Box>
    );
}

export default UploadData;