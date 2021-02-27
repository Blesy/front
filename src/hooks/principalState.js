import { useState, useEffect } from 'react';

const principalState = () => {
    const [ principal, setPrincipal ] = useState([]);
    useEffect(async () => {
        await fetch("http://localhost:500/findPrincipal")
        .then(response => response.json())
        .then(data => setPrincipal(data));
    }, []);
    return principal;
};

export default principalState;
