import {Typography} from "antd";
import {json} from "stream/consumers";
import {isNumberObject} from "util/types";


interface IProps {
    logs: string[];
}
export const ConsoleRenderer = ({logs}: IProps) => {

    const renderedLogs = [];

    for(let log of logs) {
        if (typeof(log) != "object") {
            renderedLogs.push(<li style={{fontFamily: "Monaco, Consolas, 'Courier New', monospace"}}>{log}</li>);
        } else {
            renderedLogs.push(<li style={{fontFamily: "Monaco, Consolas, 'Courier New', monospace"}}>{JSON.stringify(log)}</li>);
        }
    }
    return (
        <>
            <ul>
                {renderedLogs}
            </ul>
        </>
    );
};
