
// Sample Data used for an API call. Here the data with an Array represents when we have options of data
const data = [
    { name: 'Sanjana', age: 28, occupation: ['Engineer', 'Developer'] },
    { name: 'Janine', age: ['34','35'], occupation: 'Designer' },
    { name: ['Lavanya', 'Shreyas'], age: 21, occupation: 'Entrepreneur' }
  ];
  
  const columns = [
    {
      Header: 'Name', // header to show the header name in the table
      accessor: 'name' // accessor is the "key" in the data
    },
    {
      Header: 'Age',
      accessor: 'age'
    },
    {
      Header: 'Occupation',
      accessor: 'occupation'
    }
  ];

// Basic GET request to fetch the data for the table
export async function GET() {
    return new Response(JSON.stringify({rows: data, columns: columns}));
}