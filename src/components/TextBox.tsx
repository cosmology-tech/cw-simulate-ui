import { Input } from "antd";
import React from "react";
const { TextArea } = Input;
interface IProps {
    payload:string;
    setPayload:(val:string)=>void
}

const TextBox = ({payload,setPayload}:IProps) => {
  //TODO: Throttle input change.
  const onInputChange = (event:any) =>{
    setPayload(event.target.value);
  }
 return( <TextArea
    placeholder="Put your JSON block here"
    value={payload}
    bordered={true}
    size="large"
    allowClear={true}
    onChange={onInputChange}
  />)
};

export default TextBox;
