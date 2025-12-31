import { classNames } from '../../../utils/helpers';

const Table = ({ columns, data, onRowClick, className = '', ...props }) => {
  return (
    <div className="overflow-x-auto">
      <table className={classNames("min-w-full divide-y divide-gray-300", className)} {...props}>
        <thead>
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                scope="col"
                className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
              >
                {column.title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {data.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              onClick={() => onRowClick && onRowClick(row)}
              className={classNames(
                onRowClick && "cursor-pointer hover:bg-gray-50",
                rowIndex % 2 === 0 ? "bg-white" : "bg-gray-50"
              )}
            >
              {columns.map((column) => (
                <td
                  key={`${rowIndex}-${column.key}`}
                  className="whitespace-nowrap px-3 py-4 text-sm text-gray-900"
                >
                  {column.render ? column.render(row[column.key], row) : row[column.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;