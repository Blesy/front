import { useState, useEffect } from 'react';

const totalState = () => {
    const [ total, setTotal ] = useState([]);
    useEffect(async () => {
        await fetch("http://localhost:500/findTotalChamps")
        .then(response => response.json())
        .then(data => setTotal(data));
    }, []);
    return total;
};

export default totalState;
