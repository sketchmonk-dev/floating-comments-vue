interface XYPosition {
    x: number;
    y: number;
}

export interface Comment<D = any> {
    id: string;
    data: D;
    position: XYPosition;
}

export interface FloatingCommentsProps {
    width: number;
    height: number;
}

