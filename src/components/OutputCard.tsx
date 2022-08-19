import React from 'react';
import { Card } from 'antd';
import { JSONTree } from 'react-json-tree';
import { Typography } from "antd";

const { Paragraph } = Typography;
interface IProps {
    response:JSON|undefined|any;
    placeholder:string;
}
const theme = {
  scheme: 'chalk',
  author: 'chris kempson (http://chriskempson.com)',
  base00: '#FFFFFF',
  base01: '#202020',
  base02: '#303030',
  base03: '#505050',
  base04: '#b0b0b0',
  base05: '#d0d0d0',
  base06: '#e0e0e0',
  base07: '#f5f5f5',
  base08: '#fb9fb1',
  base09: '#eda987',
  base0A: '#ddb26f',
  base0B: '#acc267',
  base0C: '#12cfc0',
  base0D: '#6fc2ef',
  base0E: '#e1a3ee',
  base0F: '#deaf8f'
}

export const OutputCard = ({response, placeholder}:IProps) =>{
    return (
    <Card style={{ width: '100%', margin:10, overflow:"scroll" }} bordered bodyStyle={{padding:"10"}}>
       {response!==undefined ? (
          <JSONTree data={response} theme={theme} invertTheme={false} />
        ) : (
          <Paragraph disabled>
            {placeholder}
          </Paragraph>
        )}
    </Card>
    )
}