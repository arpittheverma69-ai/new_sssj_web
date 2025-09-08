"use client";
import React, { useState, useEffect } from 'react';
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { TextField, Box, Chip, IconButton, Tooltip } from "@mui/material";
import { FaRegPenToSquare, FaTrashCan, FaEye, FaFlag } from "react-icons/fa6";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import AddCustomer from "../forms/AddCustomer";
import { toast } from "react-toastify";
import { Customer } from "@/types/invoiceTypes";

export default function CustomerTable() {
  const [search, setSearch] = useState("");
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [filteredRows, setFilteredRows] = useState<Customer[]>([]);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/customer');
      const data = await response.json();
      setCustomers(data.customers || []);
    } catch (error) {
      toast.error('Failed to fetch customers', { closeOnClick: true });
      console.error('Error fetching customers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleView = (customer: Customer) => {
    setSelectedCustomer(customer);
    setViewModalOpen(true);
  };

  const handleEdit = (customer: Customer) => {
    setSelectedCustomer(customer);
    setEditModalOpen(true);
  };

  const handleDelete = (customer: Customer) => {
    setSelectedCustomer(customer);
    setDeleteModalOpen(true);
  };

  const handleAdd = () => {
    setSelectedCustomer(null);
    setAddModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedCustomer) return;

    try {
      const response = await fetch(`/api/customer/${selectedCustomer.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('Customer deleted successfully', { closeOnClick: true });
        fetchCustomers();
        setDeleteModalOpen(false);
        setSelectedCustomer(null);
      } else {
        toast.error('Failed to delete customer', { closeOnClick: true });
      }
    } catch (error) {
      toast.error('Error deleting customer', { closeOnClick: true });
      console.error('Error:', error);
    }
  };


  const toggleFlag = async (customer: Customer) => {
    try {
      const response = await fetch(`/api/customer/${customer.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...customer, flagged: !customer.flagged }),
      });

      if (response.ok) {
        fetchCustomers();
        toast.success(`Customer ${customer.flagged ? 'unflagged' : 'flagged'}`, { closeOnClick: true });
      }
    } catch (error) {
      toast.error('Failed to update flag', { closeOnClick: true });
    }
  };

  const columns: GridColDef[] = [
    {
      field: "name",
      headerName: "Name",
      flex: 1,
      renderCell: (params) => (
        <div className="flex items-center gap-2">
          {params.row.flagged && (
            <FaFlag className="text-red-500" size={12} />
          )}
          {params.value}
        </div>
      )
    },
    { field: "email", headerName: "Email", flex: 1 },
    { field: "phone", headerName: "Phone", flex: 1 },
    { field: "city", headerName: "City", flex: 1 },
    {
      field: "gstin",
      headerName: "GSTIN",
      flex: 1,
      renderCell: (params) => params.value || 'N/A'
    },
    {
      field: "_count",
      headerName: "Invoices",
      flex: 0.5,
      renderCell: (params) => (
        <Chip
          label={params.value?.invoices || 0}
          size="small"
          color="primary"
        />
      )
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1.5,
      sortable: false,
      renderCell: (params) => (
        <div className="flex gap-1 items-center h-full">
          <Tooltip title="View">
            <IconButton size="small" onClick={() => handleView(params.row)}>
              <FaEye className="text-blue-500" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Edit">
            <IconButton size="small" onClick={() => handleEdit(params.row)}>
              <FaRegPenToSquare className="text-green-500" />
            </IconButton>
          </Tooltip>
          <Tooltip title={params.row.flagged ? "Unflag" : "Flag"}>
            <IconButton size="small" onClick={() => toggleFlag(params.row)}>
              <FaFlag className={params.row.flagged ? "text-red-500" : "text-gray-400"} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton size="small" onClick={() => handleDelete(params.row)}>
              <FaTrashCan className="text-red-500" />
            </IconButton>
          </Tooltip>
        </div>
      ),
    },
  ];

  useEffect(() => {
    setFilteredRows(
      customers.filter(
        (customer) =>
          customer.name.toLowerCase().includes(search.toLowerCase()) ||
          customer.email?.toLowerCase().includes(search.toLowerCase()) ||
          customer.phone.toLowerCase().includes(search.toLowerCase()) ||
          customer.city.toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search, customers]);

  return (
    <div className="bg-card p-6 md:p-8 rounded-[24px] shadow-lg shadow-black/5 border border-border">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl md:text-2xl font-bold text-foreground">Customers</h3>
        <Button onClick={handleAdd}>Add Customer</Button>
      </div>

      {/* Search */}
      <Box mb={3}>
        <TextField
          label="Search Customers"
          variant="outlined"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          fullWidth
          size="small"
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: '20px',
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: 'var(--primary)',
              },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: 'var(--primary)',
              },
            },
          }}
        />
      </Box>

      {/* DataGrid container */}
      <div style={{ height: 400, width: '100%' }}>
        <DataGrid
          rows={filteredRows}
          columns={columns}
          loading={loading}
          pagination
          initialState={{
            pagination: { paginationModel: { pageSize: 10 } },
          }}
          pageSizeOptions={[5, 10, 25]}
          disableRowSelectionOnClick
          sx={{
            border: 'none',
            '& .MuiDataGrid-cell': {
              borderBottom: '1px solid var(--border)',
            },
            '& .MuiDataGrid-columnHeaders': {
              backgroundColor: 'var(--muted)',
              borderBottom: '2px solid var(--border)',
            },
            '& .MuiDataGrid-footerContainer': {
              borderTop: '1px solid var(--border)',
            },
          }}
        />
      </div>

      {/* View Modal */}
      <Modal
        isOpen={viewModalOpen}
        onClose={() => setViewModalOpen(false)}
        title="Customer Details"
        size="lg"
      >
        {selectedCustomer && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <p className="mt-1 text-sm text-gray-900">{selectedCustomer.name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <p className="mt-1 text-sm text-gray-900">{selectedCustomer.email || 'N/A'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Phone</label>
                <p className="mt-1 text-sm text-gray-900">{selectedCustomer.phone}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">City</label>
                <p className="mt-1 text-sm text-gray-900">{selectedCustomer.city}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">GSTIN</label>
                <p className="mt-1 text-sm text-gray-900">{selectedCustomer.gstin || 'N/A'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Total Invoices</label>
                <p className="mt-1 text-sm text-gray-900">{selectedCustomer._count?.invoices || 0}</p>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Address</label>
              <p className="mt-1 text-sm text-gray-900">{selectedCustomer.address}</p>
            </div>
            <div className="flex justify-end">
              <Button variant="outline" onClick={() => setViewModalOpen(false)}>
                Close
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Add/Edit Modal */}
      {(addModalOpen || editModalOpen) && (
        <AddCustomer
          open={addModalOpen || editModalOpen}
          setOpen={(isOpen) => {
            if (!isOpen) {
              setAddModalOpen(false);
              setEditModalOpen(false);
              setSelectedCustomer(null);
            }
          }}
          customerToEdit={selectedCustomer}
          onCustomerSaved={() => {
            fetchCustomers();
            setAddModalOpen(false);
            setEditModalOpen(false);
          }}
        />
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Confirm Delete"
        size="sm"
      >
        {selectedCustomer && (
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Are you sure you want to delete customer <strong>{selectedCustomer.name}</strong>?
              This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <Button variant="outline" onClick={() => setDeleteModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="danger" onClick={confirmDelete}>
                Delete
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
