import {Typography} from "antd";


interface IProps {
    logs: string[];
}
export const ConsoletRenderer = ({logs}: IProps) => {

    const renderedLogs = [];

    for(let log of logs) {
        renderedLogs.push(<li style={{margin: "20px 20px"}}>{log}</li>);
    }
    return (
        <>
            <ul>
                {renderedLogs}
            </ul>
        </>
    );
};
