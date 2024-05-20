"use client";
import React, { useEffect, useState } from 'react';
import { useTable } from 'react-table';
import "./table.scss"; 


const Table = ({data, columns}) => {
  //inorder to set the active cell so that user is allowed to move to the next active cell in order to set the value
  const [activeCell, setActiveCell] = useState<{rowIndex: number, columnIndex: number} | null>(null);
  //setting the value once selected so that it can be shown in the table
  const [selectedValues, setSelectedValues] = useState<Record<string, string | undefined>>({});
  const [memoizedData, setData] = useState(React.useMemo(() => data, [data]));
  const memoizedColumns = React.useMemo(() => columns, [columns]);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow
  } = useTable({
    columns: memoizedColumns,
    data: memoizedData
  });

  //here we are setting the first cell that contains alternative values as active
  useEffect(() => {
    for(let rowIndex = 0; rowIndex < data.length; rowIndex++) {
      for(let columnIndex = 0; columnIndex < columns.length; columnIndex++) {
        if(Array.isArray(data[rowIndex][columns[columnIndex].accessor])) {
          setActiveCell({rowIndex, columnIndex});
          return;
        }
      }
    }
  },[data, columns]);

  //on selection of a particular value we are setting the same in selectedValues by using
  //setSelectedValues which we later show to display, we are also moving the active cell to the next cell which has multiple values
  const handleSelectChange = (rowIndex: any, columnIndex: any, event:any) => {
    setSelectedValues(prev => ({
      ...prev,
      [`${rowIndex}_${columnIndex}`] : event.target.value
    }));
    for(let row = rowIndex; row < data.length; row ++) {
      for(let col = 0 ; col < columns.length; col++) {
        if(row === rowIndex && col <= columnIndex+1) 
        {
          continue;
        };
        if(Array.isArray(data[rowIndex][columns[col].accessor])) {
          setActiveCell({rowIndex: row, columnIndex: col});
          return;
        }
      }
    }
    setActiveCell(null);
  };

  //this function is to handle split, here we are creating a new array of data which has all the additonal values for ones not selected yet
  // and gives a view with all potential information.
  const handleSplit = () => {
    const newData: any = [...[]];
    data.forEach((row: any, rowIndex: any) => {
      columns.forEach((col: any, columnIndex: any) => {
        const cellValue = row[col.accessor];
        if(Array.isArray(cellValue) && cellValue.length > 1) {
          const selectedValue = selectedValues[`${rowIndex}_${columnIndex}`];
          const nonSelected = cellValue.filter(value => value !== selectedValue);
          nonSelected.forEach(nonSelectedVal => {
            const newRow = {...row};
            newRow[col.accessor] = nonSelectedVal;
            newData.push(newRow);
          })
        }
      })
    })
    setData(newData);
  }

  return (
    <>
    <table {...getTableProps()} className='ai-result-datatable border-spacing-2'>
      <thead>
        {headerGroups.map(headerGroup => (
          <tr {...headerGroup.getHeaderGroupProps()} key={headerGroup.id}>
            {headerGroup.headers.map(column => (
              <th {...column.getHeaderProps()} key={column.id}>
                {column.render('Header')}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map((row, rowIndex) => {
          prepareRow(row);
          return (
            <tr {...row.getRowProps()} key={row.id}>
              {row.cells.map((cell, columnIndex) => (
                  <td {...cell.getCellProps()} key={cell.column.id}>
                    {Array.isArray(cell.value) && rowIndex === activeCell?.rowIndex && activeCell.columnIndex ? 
                    (
                      <div>
                      <select autoFocus 
                      value={selectedValues[`${rowIndex}_${columnIndex}`] || cell.value[0]}
                      onChange={(event) => handleSelectChange(rowIndex, columnIndex, event)}>
                        {cell.value.map((option, i) => (
                          <option key={i} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                      <span>*
                        {/* This is to keep the selected option by default */}
                        <div className="font-bold"
                        onClick={() => handleSelectChange(rowIndex, columnIndex, {target:{value:cell.value[0]}})}>Keep</div>
                      </span>
                      </div>

                    ) : (
                      selectedValues[`${rowIndex}_${columnIndex}`] || 
                      (Array.isArray(cell.value) ? cell.value[0] : cell.render('Cell'))
                    )
                  }
                  </td>
              ))}
            </tr>
          );
        })}
      </tbody>
    </table>
    <button onClick={() => handleSplit()} className='bg-blue-500 text-white font-bold px-4'>Split</button>
    </>

  );
}

export default Table;
