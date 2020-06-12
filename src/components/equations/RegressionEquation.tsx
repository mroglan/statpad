

interface IRegEquation {
    type: string;
    info: {
        a?:number;
        b?:number;
        c?:number;
        d?:number;
        e?:number;
    }
}

export default function RegressionEquation({type, info}: IRegEquation) {
    if(type === 'linear') {
        return (
            <>
                y = {info.a.toFixed(4)}x + {info.b.toFixed(4)}
            </>
        )
    } else if(type === 'quadratic') {
        return (
            <>
                y = {info.a.toFixed(4)}x<sup>2</sup> + {info.b.toFixed(4)}x + {info.c.toFixed(4)}
            </>
        )
    } else if(type === 'cubic') {
        return (
            <>
                y = {info.a.toFixed(4)}x<sup>3</sup> + {info.b.toFixed(4)}x<sup>2</sup> + {info.c.toFixed(4)}x + {info.d.toFixed(4)}
            </>
        )
    } else if(type === 'quartic') {
        return (
            <>
                y = {info.a.toFixed(4)}x<sup>4</sup> + {info.b.toFixed(4)}x<sup>3</sup> + {info.c.toFixed(4)}x<sup>2</sup> + {info.d.toFixed(4)}x + {info.e.toFixed(4)}
            </>
        )
    } else if(type === 'ln') {
        return (
            <>
                y = {info.a.toFixed(4)}ln(x) + {info.b.toFixed(4)}
            </>
        )
    } else if(type === 'exponential') {
        return (
            <>
                y = {info.a.toFixed(4)}e<sup>{info.b.toFixed(4)}x</sup>
            </>
        )
    } else if(type === 'power') {
        return (
            <>
                y = {info.a.toFixed(4)}x<sup>{info.b.toFixed(4)}</sup>
            </>
        )
    }
}