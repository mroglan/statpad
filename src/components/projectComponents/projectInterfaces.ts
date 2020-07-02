import {ChartProperties, PolarAndPieGraphOptions, BarAndHistogramGraphOptions, MixedGraphOptions, ScatterAndBubbleGraphOptions} from '../charts/chartInterfaces'


export type Data = string[][]

export type InputData = string[][][]


export interface BaseGraph {
    _id?: string;
    type: string;
    component: string;
    charts: ChartProperties[];
    properties: any;
}

export interface PolarOrPieGraph extends BaseGraph {
    properties: PolarAndPieGraphOptions;
}

export interface BarOrHistogramGraph extends BaseGraph {
    properties: BarAndHistogramGraphOptions;
}

export interface MixedGraph extends BaseGraph {
    properties: MixedGraphOptions;
}

export interface ScatterOrBubbleGraph extends BaseGraph {
    properties: ScatterAndBubbleGraphOptions;
}


export interface BaseSimProbTest {
    _id?: string;
    component: string;
    type: string;
    properties: any;
    data: any;
}

interface TreeDiagramData {
    name: string;
    probability: string;
    children: TreeDiagramData[]
}

export interface ITreeDiagram extends BaseSimProbTest {
    properties: number;
    data: TreeDiagramData;
}

type TwoWayTableDataCell = string | null

export interface ITwoWayTable extends BaseSimProbTest {
    data: TwoWayTableDataCell[][];
    properties: {
        horzTitle: string;
        verticalTitle: string;
        displayTotals: boolean;
        contentType: string;
    }
}

export interface ISimulation extends BaseSimProbTest {
    data: {
        output: number[];
    };
    properties: {
        trials: string;
        inputType: string;
        range: {
            max: string;
            min: string;
        };
        datasetNum: number;
        displayGraph: boolean;
    }
}

export interface IGeometricProb extends BaseSimProbTest {
    data: number;
    properties: {
        type: string;
        probability: string;
        successNum: string;
        displayGraph: boolean;
    }
}

export interface IBinomialProb extends BaseSimProbTest {
    data: number;
    properties: {
        type: string;
        trials: string;
        probability: string;
        successes: string;
        displayGraph: boolean;
    }
}


export interface BaseConfidenceInterval {
    _id?: string;
    component: string;
    type: string;
    properties: any;
}

interface OneSampleCIInputs {
    proportion: string;
    mean: string;
    sampleSize: string;
    sampleSD: string;
    datasetNum: number;
    confidence: number;
}

interface TwoSampleCIInputs {
    proportion1: string;
    proportion2: string;
    mean1: string;
    mean2: string;
    sampleSize1: string;
    sampleSize2: string;
    sample1SD: string;
    sample2SD: string;
    dataset1Num: number;
    dataset2Num: number;
    confidence: number;
}

export interface IOneSampleCI extends BaseConfidenceInterval {
    properties: {
        type: string;
        inputMethod: string;
        displayGraph: boolean;
        inputs: OneSampleCIInputs;
    };
}

export interface ITwoSampleCI extends BaseConfidenceInterval {
    properties: {
        type: string;
        inputMethod: string;
        displayGraph: boolean;
        inputs: TwoSampleCIInputs;
    };
}

export interface IRegressionCI extends BaseConfidenceInterval {
    properties: {
        xNum: number;
        yNum: number;
        confidence: number;
        displayGraph: boolean;
    };
}


export interface BaseHypothesisTest {
    _id?: string;
    component: string;
    type: string;
    properties: any;
}

interface OneSampleHTInputs {
    proportion: string;
    mean: string;
    sampleSize: string;
    sampleSD: string;
    datasetNum: number;
    comparison: string;
    nullH: string;
}

interface TwoSampleHTInputs {
    proportion1: string;
    proportion2: string;
    mean1: string;
    mean2: string;
    sampleSize1: string;
    sampleSize2: string;
    sampleSD1: string;
    sampleSD2: string;
    datasetNum1: number;
    datasetNum2: number;
    comparison: string;
}

export interface IOneSampleHT extends BaseHypothesisTest {
    properties: {
        type: string;
        inputMethod: string;
        inputs: OneSampleHTInputs;
    };
}

export interface ITwoSampleHT extends BaseHypothesisTest {
    properties: {
        type: string;
        inputMethod: string;
        inputs: TwoSampleHTInputs;
    };
}

export interface IRegressionHT extends BaseHypothesisTest {
    properties: {
        xNum: number;
        yNum: number;
        comparison: string;
    }
}

interface BaseComponent {
    _id: string;
    project: string;
    name: string;
    type: string;
    createDate: string;
    updateDate: string;
}

export interface DataComp extends BaseComponent {
    data: Data;
}

export interface GraphComp extends BaseComponent {
    graphs: BaseGraph[]
}

export interface SimProbComp extends BaseComponent {
    tests: BaseSimProbTest[]
}

export interface ConIntervalsComp extends BaseComponent {
    intervals: BaseConfidenceInterval[]
}

export interface HypTestsComp extends BaseComponent {
    tests: BaseHypothesisTest[]
}

export type SyncData = (index:number, successful:boolean) => void;

