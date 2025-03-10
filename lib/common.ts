interface XYPosition {
    x: number;
    y: number;
}

export interface Comment {
    id: string;
    user: {
        username: string;
        profileUrl?: string;
    };
    content: string;
    timestamp: string;
    position: XYPosition;
}

export interface FloatingCommentsProps {
    width: number;
    height: number;
}

