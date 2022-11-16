
import React, { useState, useEffect } from 'react';

import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'

import './tableTest.css'
import { cognitoMetricJSON } from '../lib/mocks/data';

const defaultData = [
  {
    TS: "2022-11-11T14:30:00.000Z",
    SignInSuccesses: 11,
    SignUpSuccesses: 24,
    TokenRefreshSuccesses: 100
  },
  {
    TS: "2022-11-11T13:30:00.000Z",
    SignInSuccesses: 3,
    SignUpSuccesses: 24,
    TokenRefreshSuccesses: 100
  },
  {
    TS: "2022-11-10T14:30:00.000Z",
    SignInSuccesses: 5,
    SignUpSuccesses: 24,
    TokenRefreshSuccesses: 100
  },
]

const columnHelper = createColumnHelper();

const columns = [
  columnHelper.accessor('TS', {
    cell: info => new Date(info.getValue()).toLocaleString(),
    //footer: info => info.column.id,
  }),
  columnHelper.accessor('SignInSuccesses', {

    cell: info => <div style={{ textAlign: "center" }}>{info.getValue()}</div>,
    header: () => <span>SignIn</span>,
    //footer: info => info.column.id,
  }),
  columnHelper.accessor('SignUpSuccesses', {
    header: () => 'SignUp',
    cell: info => <div style={{ textAlign: "center" }}>{info.getValue()}</div>,
    // cell: info => info.renderValue(),
    //footer: info => info.column.id,
  }),
  columnHelper.accessor('TokenRefreshSuccesses', {
    header: () => <span>TokenRefresh</span>,
    cell: info => <div style={{ textAlign: "center" }}>{info.getValue()}</div>,
    //footer: info => info.column.id,
  })
]

const TableTest = () => {

  //const [data, setData] = useState(() => [...defaultData])
  const [data, setData] = useState([]);
  useEffect(() => {

    const tsData = {};
    //console.log(" DATA ", cognitoMetricJSON)
    for (let i = 0; i < cognitoMetricJSON.length; i++) {
      const label = cognitoMetricJSON[i].Label;
      //console.log("LABEL ", label)
      //console.log("TS ", label)
      for (let ts = 0; ts < cognitoMetricJSON[i].Timestamps.length; ts++) {
        const tsVal = cognitoMetricJSON[i].Timestamps[ts];
        if (!tsData?.[tsVal]) {
          //tsData[tsVal] = { [label]: 0 };
          tsData[tsVal] = { SignInSuccesses: 0, SignUpSuccesses: 0, TokenRefreshSuccesses: 0 };
        }
        tsData[tsVal][label] = cognitoMetricJSON[i].Values[ts];

      }

    }
    console.log("TS DATA ", tsData);
    const metricData = Object.keys(tsData).map(t => {
      return { TS: t, ...tsData[t] };
    });
    //console.log(metricData);
    //console.log(metricData.sort((a, b) => (a.TS > b.TS) ? -1 : 1))
    setData(metricData.sort((a, b) => (a.TS > b.TS) ? -1 : 1))

  }, [cognitoMetricJSON])


  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <div className="p-2">
      <table>
        <thead>
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <th key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map(row => (
            <tr key={row.id}>
              {row.getVisibleCells().map(cell => (
                <td key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
        {/* 
        <tfoot>
          {table.getFooterGroups().map(footerGroup => (
            <tr key={footerGroup.id}>
              {footerGroup.headers.map(header => (
                <th key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.footer,
                        header.getContext()
                      )}
                </th>
              ))}
            </tr>
          ))}
        </tfoot>
      */}
      </table>

    </div>
  )
}

//console.log(theme)
export default {
  title: "TableTest",
  component: TableTest
};

const Template = args => <TableTest {...args} />

export const TableTestSB = Template.bind({});
TableTestSB.storyName = "TableTest";
/*
const Template = args => <Wrapper {...args} />

export const DashboardUserCountSB = Template.bind({});

DashboardUserCountSB.storyName = "UserCount";
*/
//tableTest.storyName = "TableTest";
