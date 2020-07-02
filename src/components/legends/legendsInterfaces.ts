

export interface ChartProperties {
    type: string;
    label?: string;
    regressionType?: string;
    regressionInfo: {
        a?: number;
        b?: number;
        c?: number;
        d?: number;
        e?: number;
        r?: number;
        r2?: number;
    };
    x: {
        num: number;
    };
    y: {
        num: number;
    };
    z: {
        num: number;
    };
    options: {
        points: {
            color: string;
            radius: number;
            maxRadius: number;
        };
        line: {
            color: string;
            width: number;
            tension: number;
        };
        bar: {
            backgroundColor: string;
            borderColor: string;
            borderWidth: number;
        }
    };
}