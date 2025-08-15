import React, { useState } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    MenuItem,
    Button,
    Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid2";

interface AddCustomerDialogProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (data: CustomerData) => void;
}

interface CustomerData {
    name: string;
    address: string;
    gstin: string;
    state: string;
    stateCode: string;
    phone: string;
    email: string;
}

const states = [
    { code: "09", name: "Uttar Pradesh" },
    { code: "27", name: "Maharashtra" },
    { code: "07", name: "Delhi" },
    { code: "29", name: "Karnataka" },
    { code: "33", name: "Tamil Nadu" },
    { code: "24", name: "Gujarat" },
];

const AddCustomerDialog: React.FC<AddCustomerDialogProps> = ({
    open,
    onClose,
    onSubmit,
}) => {
    const [formData, setFormData] = useState<CustomerData>({
        name: "",
        address: "",
        gstin: "",
        state: "",
        stateCode: "",
        phone: "",
        email: "",
    });

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleStateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selected = states.find((s) => s.name === e.target.value);
        setFormData((prev) => ({
            ...prev,
            state: selected?.name || "",
            stateCode: selected?.code || "",
        }));
    };

    const handleSubmit = () => {
        if (!formData.name || !formData.address || !formData.state || !formData.email) {
            alert("Please fill all required fields.");
            return;
        }
        onSubmit(formData);
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>
                <Typography variant="h6">Add New Customer</Typography>
                <Typography variant="body2" color="text.secondary">
                    Add a new customer to your database
                </Typography>
            </DialogTitle>

            <DialogContent dividers>
                <Grid container spacing={2}>
                    {/* Customer Name */}
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Customer Name *"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                        />
                    </Grid>

                    {/* Address */}
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Address *"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            multiline
                            rows={3}
                        />
                    </Grid>

                    {/* GSTIN */}
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="GSTIN (Optional)"
                            name="gstin"
                            value={formData.gstin}
                            onChange={handleChange}
                        />
                    </Grid>

                    {/* State */}
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            select
                            label="State *"
                            name="state"
                            value={formData.state}
                            onChange={handleStateChange}
                        >
                            <MenuItem value="">
                                <em>Select State</em>
                            </MenuItem>
                            {states.map((state) => (
                                <MenuItem key={state.code} value={state.name}>
                                    {state.name}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>

                    {/* State Code */}
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="State Code"
                            name="stateCode"
                            value={formData.stateCode}
                            InputProps={{ readOnly: true }}
                        />
                    </Grid>

                    {/* Phone */}
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Phone Number"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            type="tel"
                        />
                    </Grid>

                    {/* Email */}
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            type="email"
                        />
                    </Grid>
                </Grid>
            </DialogContent>

            <DialogActions>
                <Button onClick={onClose} color="inherit">
                    Cancel
                </Button>
                <Button onClick={handleSubmit} variant="contained" color="primary">
                    Add Customer
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default AddCustomerDialog;
