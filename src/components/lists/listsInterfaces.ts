

export interface Component {
    _id: string;
    project: string;
    name: string;
    type: string;
    createDate: string;
    updateDate: string;
}

export interface Project {
    _id: string;
    owner: string;
    editors: string[];
    name: string;
    createDate: string;
    updateDate: string;
    description: string;
}