import React, {useEffect, useMemo, useRef, useState} from "react";
import {WindowComponent} from "../../../types/windows/Window";
import {MakeWindow} from "../../Modules/WindowBase/MakeWindow";
import Chart from "react-apexcharts";
import ApexCharts from "apexcharts";
import {CardContent, CardHeader, Divider, Grid, makeStyles, Tooltip, Typography, useTheme} from "@material-ui/core";
import {ApexOptions} from "apexcharts";
import {Sleep} from "../../../Util/Sleep";
import {useGetterSetter} from "../../../GameNetworking/Utils/useGetterSetter";

const limit = 8;

const useStyles = makeStyles((theme) => ({
    root: {
        width: "100%",
        height: "100%",
        display: "flex",
        flexFlow: "column"
    },
    chart: {
        boxSizing: "border-box",
        width: "100%",
        height: "100%",
        flexGrow: 1
    },
    title: {
        ...theme.typography.subtitle2
    },
    text: {
        textAlign: "right"
    }
}));

const FPSGraph: WindowComponent = () => {
    const theme = useTheme();
    const styles = useStyles();

    const ref = useRef<Chart>(null);
    // const [getFPS, setFPS, FPS] = useGetterSetter<number[]>([]);
    const [currentFPS, setCurrentFPS] = useState(0);

    useEffect(() => {
        let cancelled = false;

        let FPS: number[] = [];

        (async () => {
            let t = 0;
            while (!cancelled) {
                t++;
                const current = Math.floor(((Math.sin(t / 10) + 1) / 2) * 100);
                setCurrentFPS(current);

                if (t % 20 !== 0)
                {
                    await Sleep(10);
                    continue;
                }
                FPS.push(current);
                if (FPS.length > limit)
                    FPS = FPS.slice(Math.max(FPS.length - limit, 0) - 1, FPS.length);
                //@ts-ignore
                const chart = ref.current?.chart as typeof ApexCharts['prototype'];
                chart?.updateSeries([{
                    data: FPS
                }], false);
            }
        })().then();

        return () => {
            cancelled = true;
        }
    }, []);

    const options: ApexOptions = useMemo(() => ({
        chart: {
            type: "line",
            height: "100%",
            width: "100%",
            toolbar: {
                show: false
            },
            zoom: {
                enabled: false
            },
            animations: {
                enabled: false
            },

        },
        stroke: {
            curve: "stepline",
            width: 4
        },
        fill: {
            type: "solid"
        },
        xaxis: {
            labels: {
                show: false
            },
            range: limit,
        },
        yaxis: {
            tooltip: {
                enabled: false
            },
            min: 0,
            max: 100,
            floating: false,
            decimalsInFloat: 0
        },
        dataLabels: {
            enabled: false
        },
        series: [{
            data: [],
            color: theme.palette.secondary.main
        }]
    }), [theme.transitions.duration.shortest]);

    return <div className={styles.root}>
        <CardHeader
            titleTypographyProps={{
                className: styles.title
            }}
            title="FPS Counter"
            action={<Tooltip title="FPS">
                <Typography className={styles.text}>
                    {currentFPS.toString()}
                </Typography>
            </Tooltip>}
        />
        <Divider />
        <CardContent className={styles.chart}>
            <Chart
                ref={ref as any}
                type={options.chart?.type}
                height={options.chart?.height}
                width={options.chart?.width}
                options={options}
                series={options.series}
            />
        </CardContent>
    </div>;
};

FPSGraph.defaultSize = {
    width: 12,
    height: 6
};

export default MakeWindow(FPSGraph);
