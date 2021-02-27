import { useState, useEffect } from 'react';

const principalState = () => {
    const [ principal, setPrincipal ] = useState([]);
    useEffect(async () => {
        await fetch("http://localhost:500/findChosen")
        .then(response => response.json())
        .then(data => setPrincipal(data));
    }, []);
    return principal;
};

export default principalState;