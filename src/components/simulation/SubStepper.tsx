import { Grid, Step, StepContent, StepLabel, Stepper } from "@mui/material";
import { TraceLog } from "@terran-one/cw-simulate";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import React from "react";

interface IProps {
  traceLog: TraceLog[];
}
export const SubStepper = ({ traceLog }: IProps) => {
  let traceTest: TraceLog[] = [
    {
      type: "execute",
      contractAddress: "terra1kpjz6jsyxg0wd5r5hhyquawgt3zva34msdvwue",
      msg: {
        run: {
          program: [
            {
              sub: [
                1,
                {
                  run: {
                    program: [
                      {
                        sub: [
                          1,
                          { run: { program: [{ attr: ["data", "foobar"] }] } },
                          "success",
                        ],
                      },
                    ],
                  },
                },
                "success",
              ],
            },
            {
              sub: [
                1,
                {
                  run: {
                    program: [
                      {
                        sub: [
                          1,
                          { run: { program: [{ attr: ["data", "foobar"] }] } },
                          "success",
                        ],
                      },
                    ],
                  },
                },
                "success",
              ],
            },
          ],
        },
      },
      response: {
        ok: {
          messages: [
            {
              id: 1,
              msg: {
                wasm: {
                  execute: {
                    contract_addr:
                      "terra1kpjz6jsyxg0wd5r5hhyquawgt3zva34msdvwue",
                    msg: "eyJydW4iOnsicHJvZ3JhbSI6W3sic3ViIjpbMSx7InJ1biI6eyJwcm9ncmFtIjpbeyJhdHRyIjpbImRhdGEiLCJmb29iYXIiXX1dfX0sInN1Y2Nlc3MiXX1dfX0=",
                    funds: [],
                  },
                },
              },
              gas_limit: null,
              //@ts-ignore
              reply_on: "success",
            },
            {
              id: 1,
              msg: {
                wasm: {
                  execute: {
                    contract_addr:
                      "terra1kpjz6jsyxg0wd5r5hhyquawgt3zva34msdvwue",
                    msg: "eyJydW4iOnsicHJvZ3JhbSI6W3sic3ViIjpbMSx7InJ1biI6eyJwcm9ncmFtIjpbeyJhdHRyIjpbImRhdGEiLCJmb29iYXIiXX1dfX0sInN1Y2Nlc3MiXX1dfX0=",
                    funds: [],
                  },
                },
              },
              gas_limit: null,
              //@ts-ignore
              reply_on: "success",
            },
          ],
          attributes: [],
          events: [],
          data: null,
        },
      },
      info: {
        sender: "terra1f44ddca9awepv2rnudztguq5rmrran2m20zzd6",
        funds: [],
      },
      trace: [
        {
          type: "execute",
          contractAddress: "terra1kpjz6jsyxg0wd5r5hhyquawgt3zva34msdvwue",
          msg: {
            run: {
              program: [
                {
                  sub: [
                    1,
                    { run: { program: [{ attr: ["data", "foobar"] }] } },
                    "success",
                  ],
                },
              ],
            },
          },
          response: {
            ok: {
              messages: [
                {
                  id: 1,
                  msg: {
                    wasm: {
                      execute: {
                        contract_addr:
                          "terra1kpjz6jsyxg0wd5r5hhyquawgt3zva34msdvwue",
                        msg: "eyJydW4iOnsicHJvZ3JhbSI6W3siYXR0ciI6WyJkYXRhIiwiZm9vYmFyIl19XX19",
                        funds: [],
                      },
                    },
                  },
                  gas_limit: null,
                  //@ts-ignore
                  reply_on: "success",
                },
              ],
              attributes: [],
              events: [],
              data: null,
            },
          },
          info: {
            sender: "terra1kpjz6jsyxg0wd5r5hhyquawgt3zva34msdvwue",
            funds: [],
          },
          trace: [
            {
              type: "execute",
              contractAddress: "terra1kpjz6jsyxg0wd5r5hhyquawgt3zva34msdvwue",
              msg: { run: { program: [{ attr: ["data", "foobar"] }] } },
              response: {
                ok: {
                  messages: [],
                  attributes: [{ key: "data", value: "foobar" }],
                  events: [],
                  data: null,
                },
              },
              info: {
                sender: "terra1kpjz6jsyxg0wd5r5hhyquawgt3zva34msdvwue",
                funds: [],
              },
              trace: [],
              debugMsgs: [],
            },
            {
              type: "reply",
              contractAddress: "terra1kpjz6jsyxg0wd5r5hhyquawgt3zva34msdvwue",
              msg: {
                id: 1,
                result: {
                  ok: {
                    events: [
                      {
                        type: "execute",
                        attributes: [
                          {
                            key: "_contract_addr",
                            value:
                              "terra1kpjz6jsyxg0wd5r5hhyquawgt3zva34msdvwue",
                          },
                        ],
                      },
                      {
                        type: "wasm",
                        attributes: [
                          {
                            key: "_contract_addr",
                            value:
                              "terra1kpjz6jsyxg0wd5r5hhyquawgt3zva34msdvwue",
                          },
                          { key: "data", value: "foobar" },
                        ],
                      },
                    ],
                    data: null,
                  },
                },
              },
              response: {
                ok: {
                  messages: [],
                  attributes: [],
                  events: [
                    {
                      type: "reply_id",
                      attributes: [{ key: "key1", value: "value1" }],
                    },
                  ],
                  data: null,
                },
              },
              trace: [],
              debugMsgs: [],
            },
          ],
          debugMsgs: [],
        },
        {
          type: "reply",
          contractAddress: "terra1kpjz6jsyxg0wd5r5hhyquawgt3zva34msdvwue",
          msg: {
            id: 1,
            result: {
              ok: {
                events: [
                  {
                    type: "execute",
                    attributes: [
                      {
                        key: "_contract_addr",
                        value: "terra1kpjz6jsyxg0wd5r5hhyquawgt3zva34msdvwue",
                      },
                    ],
                  },
                  {
                    type: "execute",
                    attributes: [
                      {
                        key: "_contract_addr",
                        value: "terra1kpjz6jsyxg0wd5r5hhyquawgt3zva34msdvwue",
                      },
                    ],
                  },
                  {
                    type: "wasm",
                    attributes: [
                      {
                        key: "_contract_addr",
                        value: "terra1kpjz6jsyxg0wd5r5hhyquawgt3zva34msdvwue",
                      },
                      { key: "data", value: "foobar" },
                    ],
                  },
                  {
                    type: "reply",
                    attributes: [
                      {
                        key: "_contract_addr",
                        value: "terra1kpjz6jsyxg0wd5r5hhyquawgt3zva34msdvwue",
                      },
                      { key: "mode", value: "handle_success" },
                    ],
                  },
                  {
                    type: "wasm-reply_id",
                    attributes: [
                      {
                        key: "_contract_addr",
                        value: "terra1kpjz6jsyxg0wd5r5hhyquawgt3zva34msdvwue",
                      },
                      { key: "key1", value: "value1" },
                    ],
                  },
                ],
                data: null,
              },
            },
          },
          response: {
            ok: {
              messages: [],
              attributes: [],
              events: [
                {
                  type: "reply_id",
                  attributes: [{ key: "key1", value: "value1" }],
                },
              ],
              data: null,
            },
          },
          trace: [],
          debugMsgs: [],
        },
        {
          type: "execute",
          contractAddress: "terra1kpjz6jsyxg0wd5r5hhyquawgt3zva34msdvwue",
          msg: {
            run: {
              program: [
                {
                  sub: [
                    1,
                    { run: { program: [{ attr: ["data", "foobar"] }] } },
                    "success",
                  ],
                },
              ],
            },
          },
          response: {
            ok: {
              messages: [
                {
                  id: 1,
                  msg: {
                    wasm: {
                      execute: {
                        contract_addr:
                          "terra1kpjz6jsyxg0wd5r5hhyquawgt3zva34msdvwue",
                        msg: "eyJydW4iOnsicHJvZ3JhbSI6W3siYXR0ciI6WyJkYXRhIiwiZm9vYmFyIl19XX19",
                        funds: [],
                      },
                    },
                  },
                  gas_limit: null,
                  //@ts-ignore
                  reply_on: "success",
                },
              ],
              attributes: [],
              events: [],
              data: null,
            },
          },
          info: {
            sender: "terra1kpjz6jsyxg0wd5r5hhyquawgt3zva34msdvwue",
            funds: [],
          },
          trace: [
            {
              type: "execute",
              contractAddress: "terra1kpjz6jsyxg0wd5r5hhyquawgt3zva34msdvwue",
              msg: { run: { program: [{ attr: ["data", "foobar"] }] } },
              response: {
                ok: {
                  messages: [],
                  attributes: [{ key: "data", value: "foobar" }],
                  events: [],
                  data: null,
                },
              },
              info: {
                sender: "terra1kpjz6jsyxg0wd5r5hhyquawgt3zva34msdvwue",
                funds: [],
              },
              trace: [],
              debugMsgs: [],
            },
            {
              type: "reply",
              contractAddress: "terra1kpjz6jsyxg0wd5r5hhyquawgt3zva34msdvwue",
              msg: {
                id: 1,
                result: {
                  ok: {
                    events: [
                      {
                        type: "execute",
                        attributes: [
                          {
                            key: "_contract_addr",
                            value:
                              "terra1kpjz6jsyxg0wd5r5hhyquawgt3zva34msdvwue",
                          },
                        ],
                      },
                      {
                        type: "wasm",
                        attributes: [
                          {
                            key: "_contract_addr",
                            value:
                              "terra1kpjz6jsyxg0wd5r5hhyquawgt3zva34msdvwue",
                          },
                          { key: "data", value: "foobar" },
                        ],
                      },
                    ],
                    data: null,
                  },
                },
              },
              response: {
                ok: {
                  messages: [],
                  attributes: [],
                  events: [
                    {
                      type: "reply_id",
                      attributes: [{ key: "key1", value: "value1" }],
                    },
                  ],
                  data: null,
                },
              },
              trace: [],
              debugMsgs: [],
            },
          ],
          debugMsgs: [],
        },
        {
          type: "reply",
          contractAddress: "terra1kpjz6jsyxg0wd5r5hhyquawgt3zva34msdvwue",
          msg: {
            id: 1,
            result: {
              ok: {
                events: [
                  {
                    type: "execute",
                    attributes: [
                      {
                        key: "_contract_addr",
                        value: "terra1kpjz6jsyxg0wd5r5hhyquawgt3zva34msdvwue",
                      },
                    ],
                  },
                  {
                    type: "execute",
                    attributes: [
                      {
                        key: "_contract_addr",
                        value: "terra1kpjz6jsyxg0wd5r5hhyquawgt3zva34msdvwue",
                      },
                    ],
                  },
                  {
                    type: "wasm",
                    attributes: [
                      {
                        key: "_contract_addr",
                        value: "terra1kpjz6jsyxg0wd5r5hhyquawgt3zva34msdvwue",
                      },
                      { key: "data", value: "foobar" },
                    ],
                  },
                  {
                    type: "reply",
                    attributes: [
                      {
                        key: "_contract_addr",
                        value: "terra1kpjz6jsyxg0wd5r5hhyquawgt3zva34msdvwue",
                      },
                      { key: "mode", value: "handle_success" },
                    ],
                  },
                  {
                    type: "wasm-reply_id",
                    attributes: [
                      {
                        key: "_contract_addr",
                        value: "terra1kpjz6jsyxg0wd5r5hhyquawgt3zva34msdvwue",
                      },
                      { key: "key1", value: "value1" },
                    ],
                  },
                ],
                data: null,
              },
            },
          },
          response: {
            ok: {
              messages: [],
              attributes: [],
              events: [
                {
                  type: "reply_id",
                  attributes: [{ key: "key1", value: "value1" }],
                },
              ],
              data: null,
            },
          },
          trace: [],
          debugMsgs: [],
        },
      ],
      debugMsgs: [],
    },
  ];
  const [isOpen, setIsOpen] = React.useState(false);
  const [activeStep, setActiveStep] = React.useState(0);
  const handleStep = (step: number) => {
    setActiveStep(step);
  };

  return (
    <Grid item sx={{ width: "100%" }}>
      <Stepper
        nonLinear
        activeStep={activeStep}
        orientation="vertical"
        sx={{ width: "90%" }}
      >
        {traceTest?.map((traceObj: TraceLog, index: number) => {
          return (
            <Step
              ref={(el) =>
                activeStep === index &&
                activeStep === traceLog.length - 1 &&
                el?.scrollIntoView()
              }
              key={`${index}`}
              onClick={() => handleStep(index)}
            >
              <StepLabel>
                <Grid sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Grid container alignItems="center">
                    {activeStep === index &&
                    isOpen &&
                    traceObj.trace &&
                    traceObj.trace.length > 0 ? (
                      <ArrowDropDownIcon onClick={() => setIsOpen(false)} />
                    ) : (
                      <ArrowRightIcon
                        onClick={() => {
                          setIsOpen(true);
                        }}
                      />
                    )}
                    {traceObj.type}
                  </Grid>
                </Grid>
              </StepLabel>
              <StepContent>
                {activeStep === index &&
                  isOpen &&
                  traceObj.trace &&
                  traceObj.trace.length > 0 && (
                    <SubStepper traceLog={traceObj.trace} />
                  )}
              </StepContent>
            </Step>
          );
        })}
      </Stepper>
    </Grid>
  );
};
