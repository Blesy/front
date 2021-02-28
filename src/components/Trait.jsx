import React from 'react';
import '../assets/styles/components/Trait.scss';
import Images from '../assets/static/Traits/TraitsImages';

const Trait = props => {
    let counter = [];
    let icon;
    let selected = props.trait.count;
    if (props.trait.bronze > 0) {
        if (props.trait.range === "bronze") {
            counter.push(<span className="selected">{props.trait.bronze}</span>);
            icon = "bronze";
        } else {
            counter.push(<span>{props.trait.bronze}</span>);
        }
        counter.push(<span>/</span>);

    }
    if (props.trait.silver > 0) {
        if (props.trait.range === "silver") {
            counter.push(<span className="selected">{props.trait.silver}</span>);
            icon = "silver";
        } else {
            counter.push(<span>{props.trait.silver}</span>);
        }
        counter.push(<span>/</span>);
    }
    if (props.trait.gold > 0) {
        if (props.trait.range === "gold") {
            counter.push(<span className="selected">{props.trait.gold}</span>);
            icon = "gold";
        } else {
            counter.push(<span>{props.trait.gold}</span>);
        }
        counter.push(<span>/</span>);
    }
    if (props.trait.platinum > 0) {
        if (props.trait.range === "platinum") {
            counter.push(<span className="selected">{props.trait.platinum}</span>);
            icon = "platinum";
        } else {
            counter.push(<span>{props.trait.platinum}</span>);
        }
        counter.push(<span>/</span>);
    }
    counter.pop();
    return (
    <div className="trait">
        <div className="tooltip">
            <span className="tooltiptext">{props.trait.name}</span>
            <div className="hexagon hexagon2">
                <div className="hexagon-in1">
                    <div className={icon + " hexagon-in2"}>
                        <img src={Images[props.trait.name]} alt=""/>
                    </div>
                </div>
            </div>
        </div>
        <div className="counter">
            {counter}
        </div>
        <div className="count">
            <span>{selected}</span>
        </div>
    </div>
)};

export default Trait;