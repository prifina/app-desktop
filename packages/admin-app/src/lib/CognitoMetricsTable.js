import React from "react";

import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Box,
} from "@blend-ui/core";

import styled from "styled-components";

import PropTypes from "prop-types";

const DataContainer = styled(Box)`
border-radius:20px;
width:450px;
background-color:${props => props.theme.colors.baseWhite};
padding:20px;
height:300px;
`;

const columnHelper = createColumnHelper();

const columns = [
  columnHelper.accessor("TS", {
    cell: info => new Date(info.getValue()).toLocaleString(),
    // footer: info => info.column.id,
  }),
  columnHelper.accessor("SignInSuccesses", {

    cell: info => <div style={{ textAlign: "center" }}>{info.getValue()}</div>,
    header: () => <span>SignIn</span>,
    // footer: info => info.column.id,
  }),
  columnHelper.accessor("SignUpSuccesses", {
    header: () => "SignUp",
    cell: info => <div style={{ textAlign: "center" }}>{info.getValue()}</div>,
    // cell: info => info.renderValue(),
    // footer: info => info.column.id,
  }),
  columnHelper.accessor("TokenRefreshSuccesses", {
    header: () => <span>TokenRefresh</span>,
    cell: info => <div style={{ textAlign: "center" }}>{info.getValue()}</div>,
    // footer: info => info.column.id,
  }),
];

const MetricTable = ({ data, className }) => {
  // const [data, setData] = useState(() => [...defaultData])
  console.log("DATA ", data);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <DataContainer>
      <Box className={className}>

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
                        header.getContext(),
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

      </Box>
    </DataContainer>
  );
};

const StyledTable = styled(MetricTable)`

height:300px;
overflow: auto;

table {
  border-spacing: 0;
  border: 1px solid lightgray;
  width:100%;

}

tbody {
  border-bottom: 1px solid lightgray;

}

tr {
  :last-child {
    td {
      border-bottom: 0;
    }
  }
  :nth-child(even) {background-color: #f2f2f2;}
}

th,td {
  margin: 0;
  border-bottom: 1px solid lightgray;
  border-right: 1px solid lightgray;
  padding: 2px 4px;

  :last-child {
  border-right: 0;
}
}

tfoot {
  color: gray;
}

tfoot th {
  font-weight: normal;
}
`;

MetricTable.propTypes = {
  data: PropTypes.array,
  className: PropTypes.string,
};

StyledTable.displayName = "MetricTable";

export default StyledTable;
