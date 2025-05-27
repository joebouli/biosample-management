export interface BioSample {
    id: number;
    location: string;
    sampleTypeName: string;
    samplingDate: string;
    operatorName: string;
}

export interface CommentCreateRequest {
    content: string;
    author: string;
}

export interface Comment {
    id: number;
    bioSampleId: number;
    content: string;
    author: string;
    createdAt: string;
}

export interface BioSampleCreate {
    location: string;
    sampleTypeName: string;
    samplingDate: string;
    operatorName: string;
}

export interface CommentCreate {
    content: string;
    author: string;
}

export interface PaginatedResponse<T> {
    results: T[];
    totalCount: number;
}