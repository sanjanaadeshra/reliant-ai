"use client";
import Table from "@/components/table";
import { useEffect, useState } from "react";


export default function Datatable() {
  //Does an API call to fetch the data and use that to pass it to the table component
  const [data, setData] = useState<{columns: [], rows: []} | null>(null);
  useEffect(() => {
    fetch('http://localhost:3000/api')
    .then((response) => response.json())
    .then((data)=> setData(data))
  }, [])
  // console.log('data', data.columns, data.rows);
  return data ? <Table columns={data.columns} data={data.rows}></Table> : <div>Loading</div>
}
;