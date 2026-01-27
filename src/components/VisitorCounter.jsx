import React, { useEffect, useState } from "react";
// import CountUp from "react-countup";

const API_URL = "https://api.ssbwithisv.in/api";

function VisitorCounter() {
    const [visits, setVisits] = useState(0);

    useEffect(() => {
        const fetchVisitors = async () => {
            try {
                const res = await fetch(`${API_URL}/visit`); // GET call (increment)
                const data = await res.json();

                if (data.success) {
                    setVisits(data.visits);
                }
            } catch (error) {
                console.error("Visitor API error:", error);
            }
        };

        fetchVisitors();
    }, []);

    return (
        <p>Total Visitors  {visits}</p>
    );
}

export default VisitorCounter;
