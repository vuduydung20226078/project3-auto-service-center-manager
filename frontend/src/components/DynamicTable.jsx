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
  background-color: ${props => props.$bgColor || '#f0f0f0'};
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.$color || '#666'};
  transition: all 0.2s ease;

  &:hover {
    background-color: ${props => props.$hoverBg || '#e0e0e0'};
    color: ${props => props.$hoverColor || '#333'};
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

const TableWrapper = styled.div`
  width: 100%;
`;

const PaginationContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background-color: white;
  border-top: 1px solid #e0e0e0;
  border-radius: 0 0 8px 8px;
`;

const PaginationInfo = styled.div`
  font-size: 14px;
  color: #666;
`;

const PaginationButtons = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`;

const PageButton = styled.button`
  padding: 8px 12px;
  border: 1px solid #e0e0e0;
  background-color: ${props => props.$active ? '#4c00b4' : 'white'};
  color: ${props => props.$active ? 'white' : '#666'};
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    background-color: ${props => props.$active ? '#3c009d' : '#f5f5f5'};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const PageSizeSelect = styled.select`
  padding: 8px 12px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  background-color: white;
  outline: none;

  &:focus {
    border-color: #4c00b4;
  }
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
 * @param {Function} customActions - Function that returns array of custom action buttons (row) => [{icon, label, onClick, color}]
 * @param {Boolean} showActions - Show action buttons (default: true)
 * @param {Number} itemsPerPage - Number of items per page (default: 10)
 * @param {Boolean} enablePagination - Enable pagination (default: true)
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
 *   customActions={(row) => [{icon: FaCustomIcon, label: 'Custom', onClick: () => {}, color: '#ff0000'}]}
 *   itemsPerPage={15}
 * />
 */
const DynamicTable = ({
  columns,
  data,
  onView,
  onEdit,
  onDelete,
  customActions,
  showActions = true,
  itemsPerPage = 10,
  enablePagination = true,
}) => {
  const [currentPage, setCurrentPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(itemsPerPage);
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
        return typeof value === 'number' ? (Number.isInteger(value) ? value : value.toFixed(2)) : value;
      
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

  // Pagination calculations
  const totalPages = Math.ceil(data.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedData = enablePagination ? data.slice(startIndex, endIndex) : data;

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (e) => {
    setPageSize(Number(e.target.value));
    setCurrentPage(1);
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push('...');
        pages.push(currentPage - 1);
        pages.push(currentPage);
        pages.push(currentPage + 1);
        pages.push('...');
        pages.push(totalPages);
      }
    }
    return pages;
  };

  return (
    <TableWrapper>
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
        {paginatedData.map((row) => (
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
                  {customActions && customActions(row).map((action, idx) => {
                    const Icon = action.icon;
                    return (
                      <ActionBtn
                        key={idx}
                        title={action.label}
                        $color={action.color}
                        $hoverColor={action.color}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          action.onClick(row);
                        }}
                      >
                        <Icon />
                      </ActionBtn>
                    );
                  })}
                </ActionButtons>
              </TableCell>
            )}
          </tr>
        ))}
      </TableBody>
    </Table>
    
    {enablePagination && data.length > 0 && (
      <PaginationContainer>
        <PaginationInfo>
          Showing {startIndex + 1}-{Math.min(endIndex, data.length)} of {data.length} items
        </PaginationInfo>
        
        <PaginationButtons>
          <PageSizeSelect value={pageSize} onChange={handlePageSizeChange}>
            <option value={5}>5 per page</option>
            <option value={10}>10 per page</option>
            <option value={20}>20 per page</option>
            <option value={50}>50 per page</option>
          </PageSizeSelect>
          
          <PageButton
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </PageButton>
          
          {getPageNumbers().map((page, idx) => (
            page === '...' ? (
              <span key={`ellipsis-${idx}`} style={{ padding: '0 8px', color: '#999' }}>...</span>
            ) : (
              <PageButton
                key={page}
                $active={currentPage === page}
                onClick={() => handlePageChange(page)}
              >
                {page}
              </PageButton>
            )
          ))}
          
          <PageButton
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </PageButton>
        </PaginationButtons>
      </PaginationContainer>
    )}
    </TableWrapper>
  );
};

export default DynamicTable;
