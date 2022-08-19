import { Input } from "antd";
import React from "react";
const { TextArea } = Input;
interface IProps {
    payload:string;
    setPayload:(val:string)=>void
    readonly?:boolean
    placeholder:string
}

const TextBox = ({payload,setPayload, readonly, placeholder}:IProps) => {
  //TODO: Throttle input change.
  const onInputChange = (event:any) =>{
    setPayload(event.target.value);
  }
 return( <TextArea
    placeholder={placeholder}
    value={payload}
    bordered={true}
    size="large"
    allowClear={true}
    onChange={onInputChange}
    readOnly={readonly}
    style={{margin:10}}
    autoSize={{ minRows: 6, maxRows: 6 }}
  />)
};

export default TextBox;
