import React from 'react';
import {Results} from "./Games";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import {ResultChart} from "./ResultChart";

ChartJS.register(ArcElement, Tooltip, Legend);

const ResultDisplay = (props: {results: Results}) => {
    const {results} = props;
    return (
        <div className="Results">
            <span>
            There were {results.successes} successful runs out of {results.totalAttempts} for a {(results.successes / results.totalAttempts * 100).toFixed(2)}% success rate
            </span>
            <br/>

            <span>
                Of the {results.totalAttempts - results.successes} failures, {results.failedGamesOver5Mana} gained greater than 5 floating mana.
                Which may have been saved by a shifting woodland activation
            </span>

            <ResultChart results={results}/>
        </div>
    )
}

export default ResultDisplay;