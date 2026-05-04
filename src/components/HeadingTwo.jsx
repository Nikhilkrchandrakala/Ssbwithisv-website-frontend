import { useEffect, useRef, useState } from "react";
import "../style/heading.css";

export default function HeadingTwo({ h1, t1, style }) {
    const headingRef = useRef(null);
    const [hasAnimated, setHasAnimated] = useState(false);
    const [isActive, setIsActive] = useState(false);

    useEffect(() => {
        const el = headingRef.current;
        if (!el) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    if (!hasAnimated) {
                        setIsActive(true);
                        
                        // Trigger "active" state to start CSS transition
                        const timeoutId = setTimeout(() => {
                            setHasAnimated(true);
                            setIsActive(false);
                        }, 2000); // Matches CSS transition duration

                        return () => clearTimeout(timeoutId);
                    }
                } else {
                    // Reset when leaving viewport so it can replay on next scroll
                    setHasAnimated(false);
                    setIsActive(false);
                }
            },
            { threshold: 0 } 
        );

        observer.observe(el);

        return () => {
            observer.disconnect();
        };
    }, [hasAnimated]);

    const statusClass = hasAnimated ? "sweep-done" : "play-sweep";
    const activeClass = isActive ? "active" : "";

    return (
        <h2 ref={headingRef} className={`headingOfSSb ${statusClass} ${activeClass}`} style={style}>
            <span className="word highlight">
                <span className="second-part">{h1}</span>
                {" "}
                {t1 && (
                    <span className="first-part">{t1}</span>
                )}
            </span>
        </h2>
    );
}
