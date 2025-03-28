import { useState, useEffect } from "react";

const useResizablePanel = () => {
    const initialHeight = window.innerHeight / 2; // Dynamically set initial height to half the screen
    const [topHeight, setTopHeight] = useState(initialHeight);
    const [isResizing, setIsResizing] = useState(false);

    const bottomHeight = window.innerHeight - topHeight - 1; 

    const handleMouseDown = (e) => {
        e.preventDefault(); // Prevent default drag behavior
        setIsResizing(true);
    };

    const handleMouseMove = (e) => {
        if (!isResizing) return;
        e.preventDefault(); // Prevent text selection while dragging
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
            window.addEventListener("mousemove", handleMouseMove);
            window.addEventListener("mouseup", handleMouseUp);
            window.addEventListener("mouseleave", handleMouseUp);
            window.addEventListener("blur", handleMouseUp);
        } else {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseup", handleMouseUp);
            window.removeEventListener("mouseleave", handleMouseUp);
            window.removeEventListener("blur", handleMouseUp);
        }

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseup", handleMouseUp);
            window.removeEventListener("mouseleave", handleMouseUp);
            window.removeEventListener("blur", handleMouseUp);
        };
    }, [isResizing]);

    return { topHeight,bottomHeight, handleMouseDown };
};

export default useResizablePanel;
