import React from 'react';
import styled from 'styled-components';
import { FaEye, FaEdit, FaTrash } from 'react-icons/fa';

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background-color: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
`;

const TableHeader = styled.thead`
  background-color: #f5f5f5;
  border-bottom: 1px solid #e0e0e0;
`;

const TableHeaderCell = styled.th`
  padding: 15px;
  text-align: left;
  font-weight: 600;
  font-size: 13px;
  color: #666;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const TableBody = styled.tbody`
  tr {
    border-bottom: 1px solid #e0e0e0;
    transition: background-color 0.2s ease;

    &:hover {
      background-color: #fafafa;
    }
  }
`;

const TableCell = styled.td`
  padding: 15px;
  font-size: 14px;
  color: #333;
  max-width: 300px;
  word-break: break-word;
`;

const StatusBadge = styled.span`
  display: inline-block;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  background-color: ${props => props.$status ? '#e6f4ea' : '#fbe4e6'};
  color: ${props => props.$status ? '#0f8419' : '#c5192d'};
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 10px;
  justify-content: flex-start;
`;

const ActionBtn = styled.button`
  width: 32px;
  height: 32px;
  border: none;
  background-color: #f0f0f0;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666;
  transition: all 0.2s ease;

  &:hover {
    background-color: #e0e0e0;
    color: #333;
  }

  &.delete:hover {
    background-color: #ffebee;
    color: #c5192d;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 40px;
  color: #999;
  font-size: 14px;
`;

/**
 * DynamicTable Component
 * Flexible table that can render any number of columns
 * 
 * @param {Array} columns - Array of column definitions. Each column:
 *   - key: string - data key to access
 *   - label: string - column header label
 *   - width: string (optional) - CSS width value
 *   - render: function (optional) - custom render function(value, row)
 *   - type: string (optional) - 'status', 'number', 'text' (default)
 * 
 * @param {Array} data - Array of data objects to display
 * @param {Function} onView - Callback when view button clicked
 * @param {Function} onEdit - Callback when edit button clicked
 * @param {Function} onDelete - Callback when delete button clicked
 * @param {Boolean} showActions - Show action buttons (default: true)
 * 
 * Example usage:
 * <DynamicTable
 *   columns={[
 *     { key: 'name', label: 'Name' },
 *     { key: 'price', label: 'Price', type: 'number' },
 *     { key: 'active', label: 'Status', type: 'status' }
 *   ]}
 *   data={services}
 *   onEdit={handleEdit}
 *   onDelete={handleDelete}
 * />
 */
const DynamicTable = ({
  columns,
  data,
  onView,
  onEdit,
  onDelete,
  showActions = true,
}) => {
  const handleActionClick = (action, id, e) => {
    e.preventDefault();
    e.stopPropagation();
    
    switch (action) {
      case 'view':
        onView && onView(id);
        break;
      case 'edit':
        onEdit && onEdit(id);
        break;
      case 'delete':
        if (window.confirm('Are you sure you want to delete this item?')) {
          onDelete && onDelete(id);
        }
        break;
      default:
        break;
    }
  };

  const renderCellValue = (row, column) => {
    const value = row[column.key];

    // Custom render function
    if (column.render) {
      return column.render(value, row);
    }

    // Type-based rendering
    switch (column.type) {
      case 'status':
        return <StatusBadge $status={value}>{value ? 'active' : 'inactive'}</StatusBadge>;
      
      case 'number':
        return typeof value === 'number' ? value.toFixed(2) : value;
      
      case 'date':
        return new Date(value).toLocaleDateString();
      
      case 'currency':
        return typeof value === 'number' ? `$${value.toFixed(2)}` : value;
      
      default:
        return value || '-';
    }
  };

  if (!data || data.length === 0) {
    return <EmptyState>No data available</EmptyState>;
  }

  return (
    <Table>
      <TableHeader>
        <tr>
          {columns.map((column) => (
            <TableHeaderCell key={column.key} style={{ width: column.width }}>
              {column.label}
            </TableHeaderCell>
          ))}
          {showActions && <TableHeaderCell>Actions</TableHeaderCell>}
        </tr>
      </TableHeader>
      <TableBody>
        {data.map((row) => (
          <tr key={row.id || Math.random()}>
            {columns.map((column) => (
              <TableCell key={column.key} style={{ width: column.width }}>
                {renderCellValue(row, column)}
              </TableCell>
            ))}
            {showActions && (
              <TableCell>
                <ActionButtons>
                  {onView && (
                    <ActionBtn
                      title="View"
                      onClick={(e) => handleActionClick('view', row.id, e)}
                    >
                      <FaEye />
                    </ActionBtn>
                  )}
                  {onEdit && (
                    <ActionBtn
                      title="Edit"
                      onClick={(e) => handleActionClick('edit', row.id, e)}
                    >
                      <FaEdit />
                    </ActionBtn>
                  )}
                  {onDelete && (
                    <ActionBtn
                      className="delete"
                      title="Delete"
                      onClick={(e) => handleActionClick('delete', row.id, e)}
                    >
                      <FaTrash />
                    </ActionBtn>
                  )}
                </ActionButtons>
              </TableCell>
            )}
          </tr>
        ))}
      </TableBody>
    </Table>
  );
};

export default DynamicTable;
