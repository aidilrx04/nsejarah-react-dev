import Loader from 'react-loader-spinner';

export default function TailSpinLoader ( props )
{
    return (
        <div className="loader-container" { ...props }>
            <Loader type="TailSpin" className="loader" color="#8E2DE2" />
        </div>
    );
}