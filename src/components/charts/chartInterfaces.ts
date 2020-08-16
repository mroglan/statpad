

type Data = string[][]

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
            interval?: string;
        }
    };
}

interface Axis {
    titles: {
        color: string;
    };
    ticks: {
        xMin?: string;
        xMax?: string;
        xScl?: string;
        yMin?: string;
        yMax?: string;
        yScl?: string;
    };
}

interface MixedAxis extends Axis {
    x: number;
    y: number;
    z: number;
}

interface GraphProperties {
    axis: Axis;
    graphTitle: {
        color: string;
        title?: string;
    };
    legend: {
        display: boolean;
    };
}

interface MixedGraphProperties extends GraphProperties {
    axis: MixedAxis;
}

interface BaseGraphOptions {
    responsive: boolean;
    animation: {
        duration: number;
    };
    responsiveAnimationDuration: number;
    legend: {
        display: boolean;
        labels?: {
            fontColor: string;
        };
    };
    title: {
        display: boolean;
        text: string;
        fontColor: string;
        fontSize: number;
    };
}

interface BaseAxisOptions {
    ticks: {
        fontColor: string;
        beginAtZero?: boolean;
        min?: number;
        max?: number;
        stepSize?: number;
    };
    scaleLabel: {
        display: boolean;
        labelString: string;
        fontColor: string;
        fontSize: number;
    };
}

interface GridAxisOptions extends BaseAxisOptions {
    gridLines: {
        zeroLineWidth: number;
    };
}

export interface PolarAndPieGraphOptions extends BaseGraphOptions {
    scale?: {
        ticks: {
            display: boolean;
        };
    };
}

export interface BarAndHistogramGraphOptions extends BaseGraphOptions {
    scales: {
        xAxes: BaseAxisOptions[];
        yAxes: BaseAxisOptions[];
    }
}

export interface MixedGraphOptions extends BaseGraphOptions {
    scales: {
        xAxes: BaseAxisOptions[];
        yAxes: BaseAxisOptions[];
    }
}

export interface ScatterAndBubbleGraphOptions extends BaseGraphOptions {
    scales: {
        xAxes: GridAxisOptions[];
        yAxes: GridAxisOptions[];
    }
}

export interface ChartDataInterface {
    x: number;
    y: number;
    r?: number;
}

export interface PlotProps {
    data: Data;
    properties: ChartProperties[];
    graphProperties: GraphProperties;
}

export interface MixedPlotProps extends PlotProps {
    graphProperties: MixedGraphProperties;
}