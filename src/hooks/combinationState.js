import { useState, useEffect } from 'react';

const combinationState = () => {
    const [ combination, setCombination ] = useState([]);
    useEffect(async () => {
        await fetch("http://localhost:500/findSynergies")
        .then(response => response.json())
        .then(data => setCombination(data));
    }, []);
    return combination;
};

export default combinationState;
