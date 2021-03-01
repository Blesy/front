import React, {useState, useEffect} from 'react';
import axios from 'axios';

// Hooks
import useInitialState from '../hooks/useinitialState';
import teamState from '../hooks/teamState';

// Componentes
import '../assets/styles/App.scss';
import Header from '../components/Header';
import Container from '../components/Container';
import Team from '../components/Team';
import Champion from '../components/Champion';
import Synergies from '../components/Synergies';
import Trait from '../components/Trait';
import Champions from '../components/Champions';
import Banner from '../components/Banner';
import Loading from '../components/Loading';
import Comentarios from '../components/Comentarios';

// Filtros de busqueda
import Filters from '../components/filters/Filters';
import F_Synergies from '../components/filters/F_Synergies';
import F_Chosen from '../components/filters/F_Chosen';
import F_Spatula from '../components/filters/F_Spatula';
import F_Quantity from '../components/filters/F_Quantity';
import F_Principal from '../components/filters/F_Principal';

const API = 'https://sheltered-river-57888.herokuapp.com/findChamps';

const App = () => {
    const initialState = useInitialState(API);
    const [team, setTeam] = useState([]);
    const [availables, setAvailables] = useState([]);
    const [loading, setLoading] = useState(false);
    const [traits, setTraits] = useState([]);
    const [total, setTotal] = useState(0);
    const [filters, setFilters] = useState({
        principal: "any",
        numberChamps: 9,
        spatula: "any",
        synergie: "any",
        chosen: "no"
    });

    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({champs: []})
    };
    useEffect(async () => {
        await fetch("https://sheltered-river-57888.herokuapp.com/findTeam", requestOptions)
        .then(response => response.json())
        .then(data => setAvailables(data.map(item => item.name)));
    }, []);

    const getItems = async (tempTeam) => {
        let request = tempTeam.map(item => item.name);
        let response;
        await axios.post("https://sheltered-river-57888.herokuapp.com/findItems", {champs: request})
        .then(function (res)
        {
            response = res.data;
        })
        .catch(function (error)
        {
            if (error.response)
            {
               console.log(error.response.status);
            }
            response = null;
        });
        return response;
    }

    const req = async (tempTeam, filter) => {
        let request = tempTeam.map(item => item.name);
        setFilters(filter);
        filter['champs'] = request;
        setLoading(true);
        await axios.post("https://sheltered-river-57888.herokuapp.com/findTeam", filter)
        .then(function (res)
        {
            setAvailables(res.data.map(item => item.name))
            setLoading(false);
        })
        .catch(function (error)
        {
            if (error.response)
            {
               console.log(error.response.status);
            }
            setLoading(false);
        });
    }

    const getTotal = (tempTrait) => {
        let sumTraits = 0;
        for (const trait of tempTrait) {
            console.log(trait.range);
            switch (trait.range) {
                case "platinum":
                    sumTraits += trait.platinum;
                    break;
                case "gold":
                    sumTraits += trait.gold;
                    break;
                case "silver":
                    sumTraits += trait.silver;
                    break;
                case "bronze":
                    sumTraits += trait.bronze;
                    break;
                default:
                    break;
            }
        }
        setTotal(sumTraits);
    }
    const getTraits = (tempTeam) => {
        let teamTrait = [];
        let counts = {};
        for (const array of tempTeam) {
            for (const inside of array.traits) {
                teamTrait.push(JSON.stringify(inside));
            }
        }
        let unique = [...new Set(teamTrait)];
        teamTrait = teamTrait.map(item => JSON.parse(item));
        unique = unique.map(item => JSON.parse(item));
        teamTrait.forEach(function(x) { counts[x.id] = (counts[x.id] || 0)+1; });
        for (const trait of unique) {
            trait['count'] = counts[trait.id];
            if (trait.name.toLowerCase() === filters.chosen.toLowerCase()) {
                trait.count++;
            }
            if (trait.count >= trait.platinum && trait.platinum) {
                trait['range'] = "platinum";
            } else if (trait.count >= trait.gold && trait.gold) {
                trait['range'] = "gold";
            } else if (trait.count >= trait.silver && trait.silver) {
                trait['range'] = "silver";
            } else if (trait.count >= trait.bronze && trait.bronze) {
                trait['range'] = "bronze";
            } else {
                trait['range'] = "";
            }
        }
        unique.sort(function (a, b) {
            if (a.count < b.count) {
              return 1;
            }
            if (a.count > b.count) {
              return -1;
            }
            return 0;
        });
        getTotal(unique);
        setTraits(unique);
    }

    const rem = async (prop) => {
        let tempTeam = [];
        Object.keys(team).forEach(function(key) {
            if (team[key].name !== prop)
                tempTeam.push(team[key])
        });
        setTeam(tempTeam)
        await req(tempTeam, filters);
        getTraits(tempTeam);
    }

    const add = async (prop) => {
        let included = false;
        let tempTeam = [];
        for (const champ of team) {
            tempTeam.push(champ);
            if (champ.name === prop)
                included = true;
        }
        if (!included)
            tempTeam.push({name: prop});
        tempTeam = await getItems(tempTeam);
        setTeam(tempTeam);
        await req(tempTeam, filters);
        getTraits(tempTeam);
    }

    return (
        <div className="App">
            {loading ? (<Loading />) : null}
            <Container>
                <Team>
                    {
                        team.length > 0 ?
                        team.map((item, index) =>
                            <Champion key={index} name={item.name} items={item.items} team={value => rem(value)} classes={"image pointer"} />
                        ) : null
                    }
                </Team>
                <Synergies total={total}>
                    {
                        traits.length > 0 ?
                        traits.map((item) => 
                            <Trait key={item.id} trait={item} chosen={filters.chosen} />
                        ) : null
                    }
                </Synergies>
                <Champions>
                    {
                        initialState.map((item) => 
                            <Champion key={item.name} name={item.name} team={value => {availables.includes(item.name) ? add(value) : null}}
                            classes={availables.includes(item.name) ? "image pointer" : "image gray"} />
                        )
                    }
                </Champions>
                <Filters>
                    <F_Chosen chosen={value => {let filter = {...filters}; filter.chosen = value; req(team, filter)}} />
                    <F_Synergies synergies={value => {let filter = {...filters}; filter.synergie = value; req(team, filter)}} />
                    <F_Principal principal={value => {let filter = {...filters}; filter.principal = value; req(team, filter)}} />
                    <F_Spatula spatula={value => {let filter = {...filters}; filter.spatula = value; req(team, filter)}} />
                    <F_Quantity quantity={value => {let filter = {...filters}; filter.numberChamps = value; req(team, filter)}} />
                </Filters>
                <Comentarios/>
            </Container>
        </div>
    );
}

export default App;