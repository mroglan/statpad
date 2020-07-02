

interface Comp {
    name: string;
    path: string;
}

interface Tab {
    name: string;
    _id: string;
}

export interface BreadCrumbNav {
    comp: Comp;
}

export interface InnerProjectNavProps {
    tabs: Tab[];
}
