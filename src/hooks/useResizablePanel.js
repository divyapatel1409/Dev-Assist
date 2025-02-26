import { useState, useEffect } from "react";

const useResizablePanel = () => {
    const initialHeight = window.innerHeight / 2; // Dynamically set initial height to half the screen
    const [topHeight, setTopHeight] = useState(initialHeight);
    const [isResizing, setIsResizing] = useState(false);

    const handleMouseDown = () => {
        setIsResizing(true);
    };

    const handleMouseMove = (e) => {
        if (!isResizing) return;
        let newHeight = e.clientY;
        if (newHeight < 100) newHeight = 100;
        if (newHeight > window.innerHeight - 100) newHeight = window.innerHeight - 100;
        setTopHeight(newHeight);
    };

    const handleMouseUp = () => {
        setIsResizing(false);
    };

    useEffect(() => {
        if (isResizing) {
            document.addEventListener("mousemove", handleMouseMove);
            document.addEventListener("mouseup", handleMouseUp);
        } else {
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);
        }

        return () => {
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);
        };
    }, [isResizing]);

    return { topHeight, handleMouseDown };
};

export default useResizablePanel;
