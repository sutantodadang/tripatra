import DataTable from "react-data-table-component";

function DataTabelComponent(props: {
  data: any;
  columns: any;
  title: string;
  titleButton?: string;
  onClick?: any;
}): JSX.Element {
  return (
    <DataTable
      title={props.title}
      columns={props.columns}
      data={props.data}
      pagination
      highlightOnHover
      pointerOnHover
      responsive
      striped
      subHeader
      subHeaderComponent={
        <button
          onClick={props.onClick}
          type="button"
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center me-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          <svg
            className="me-1 -ms-1 w-5 h-5"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
              clipRule="evenodd"
            ></path>
          </svg>
          {props.titleButton}
        </button>
      }
    />
  );
}

export default DataTabelComponent;
