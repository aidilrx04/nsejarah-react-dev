export default function Spinner({ text = 'Loading...', spin = true, hideSpinOnStop = true, style, ...rest })
{
    return <span style={{display: 'block', width: '100%', textAlign: 'center', ...style}} {...rest}> {spin === true && hideSpinOnStop === true && <i className={`fas fa-spinner ${spin ? 'fa-spin' : ''}`}/>} {text}</span>;
}