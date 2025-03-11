import React from "react";
import { Download, Loader } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";

const Table = ({
  columns,
  data,
  globalActions, // Optional actions like edit, delete, etc.
  handleDownloadInvoice, // Optional prop for download functionality
  sendWhatsAppMessage, // Optional prop for WhatsApp functionality
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100">
      {data.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full">
            {/* Table Header */}
            <thead>
              <tr className="text-left border-b border-gray-200">
                {columns.map((column, index) => (
                  <th
                    key={index}
                    className="p-4 text-gray-600 font-medium"
                  >
                    {column.header}
                  </th>
                ))}
                {globalActions && (
                  <th className="p-4 text-gray-600 font-medium">Actions</th>
                )}
              </tr>
            </thead>

            {/* Table Body */}
            <tbody>
              {data.map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  className={`border-b border-gray-100 hover:bg-gray-50 ${
                    rowIndex % 2 === 0 ? "bg-gray-50" : "bg-white"
                  }`}
                >
                  {columns.map((column, colIndex) => (
                    <td key={colIndex} className="p-4">
                      {renderCellContent(
                        column,
                        row,
                        handleDownloadInvoice,
                        sendWhatsAppMessage
                      )}
                    </td>
                  ))}
                  {globalActions && (
                    <td className="p-4">
                      <div className="flex gap-2">
                        {globalActions.map((action, actionIndex) => (
                          <button
                            key={actionIndex}
                            onClick={() => action.handler(row)}
                            className={`p-1 rounded-md ${action.className}`}
                            disabled={
                              action.label.type === FaWhatsapp && row.whatsappSent
                            }
                          >
                            {action.label}
                          </button>
                        ))}
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center text-gray-600 py-16">
          <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto flex items-center justify-center">
            <svg
              className="w-6 h-6 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <p className="mt-4 font-medium">No records found</p>
          <p className="text-sm text-gray-500 mt-1">
            Try adjusting your filters or search terms
          </p>
        </div>
      )}
    </div>
  );
};

// Helper function to render cell content
const renderCellContent = (
  column,
  row,
  handleDownloadInvoice,
  sendWhatsAppMessage
) => {
  // Check if column has a custom render function
  if (column.render) {
    return column.render(row);
  }

  const value = row[column.accessor];

  // Handle date formatting
  if (column.accessor === "createdAt") {
    const date = new Date(value);
    return (
      <p className="text-sm text-gray-700">
        {date.toLocaleDateString("en-US", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })}{" "}
        ·{" "}
        {date.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        })}
      </p>
    );
  }

  // Handle status column
  if (column.accessor === "status") {
    return (
      <span
        className={`font-medium ${
          value.toLowerCase() === "pending"
            ? "text-red-500"
            : value.toLowerCase() === "confirmed" || value?.toLowerCase() === "success"
            ? "text-green-500"
            : "text-gray-500"
        }`}
      >
        {value}
      </span>
    );
  }

  // Handle payment status column
  if (column.accessor === "paymentStatus") {
    return (
      <span
        className={`font-medium ${
          value.toLowerCase() === "pending"
            ? "text-red-500"
            : value.toLowerCase() === "paid"
            ? "text-green-500"
            : "text-gray-500"
        }`}
      >
        {value}
      </span>
    );
  }

  // Handle download button for invoice
  if (column.accessor === "download") {
    return (
      <div className="flex justify-center items-center">
        <DownloadButton
          handleDownloadInvoice={handleDownloadInvoice}
          orderId={row.orderId}
        />
      </div>
    );
  }

  if (column.accessor === "sendMessage") {
    return (
      <div className="flex justify-center items-center">
        <SendMessageButton sendWhatsAppMessage={sendWhatsAppMessage} row={row} />
      </div>
    );
  }

  // Default rendering
  return typeof value === "function" ? value(row) : value;
};

const DownloadButton = ({ handleDownloadInvoice, orderId }) => {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    await handleDownloadInvoice(orderId);
    setLoading(false);
  };

  return (
    <button
      onClick={handleClick}
      className="text-blue-500 hover:text-blue-700 flex justify-center text-center items-center"
      title="Download Invoice"
      disabled={loading}
    >
      {loading ? (
        <Loader size={20} className="animate-spin" />
      ) : (
        <Download size={20} />
      )}
    </button>
  );
};

const SendMessageButton = ({ sendWhatsAppMessage, row }) => {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    await sendWhatsAppMessage(row);
    setLoading(false);
  };

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className="flex items-center gap-2 text-white bg-green-500 p-2 rounded-md hover:text-green-500 hover:bg-gray-100 transition-all"
    >
      {loading ? (
        <Loader size={20} className="animate-spin" />
      ) : (
        <FaWhatsapp size={20} className="text-white hover:text-green-500" />
      )}
    </button>
  );
};

export default Table;