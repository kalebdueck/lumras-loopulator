import React from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import {reverse} from "node:dns";
import {Results} from "./Games";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

export const options = {
    responsive: true,
    plugins: {
        legend: {
            position: 'top' as const,
        },
        title: {
            display: true,
            text: 'Chart.js Line Chart',
        },
    },
};

const getRange = (e: number) =>
    Array.from({length:e},(v, i)=> i+1);


type ResultChartProps = {
    results: Results
}
export function ResultChart(props: ResultChartProps) {
    const labels = getRange(props.results.totalAttempts - props.results.successes).reverse();

    const data = {
        labels: labels,
        datasets: [
            {
                label: 'Depth Achieved',
                data: props.results.failedGames.map((fail) => {return fail.Deck.cards.length }).sort(),
                borderColor: 'rgb(99,120,255)',
                backgroundColor: 'rgba(41,55,143,0.5)',
            },
        ],
    };

    return <Line options={options} data={data} />;
}

