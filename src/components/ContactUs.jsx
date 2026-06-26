import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import Form from '../pages/From';
import { RxCross1 } from "react-icons/rx";

export default function ContactUs({ open, setOpen }) {
    return (
        <Dialog
            open={open}
            onClose={() => setOpen(false)}
            maxWidth="md"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: "20px",
                    background:
                        "radial-gradient(circle at top left, rgba(202, 162, 77, 0.15), transparent 45%), radial-gradient(circle at bottom right, rgba(202, 162, 77, 0.12), transparent 45%), #0b0b0b",
                    px: {
                        xs: 1,
                        sm: 0,
                        md: 3
                    },
                    py: {
                        xs: 1,
                        sm: 0
                    },
                },
            }}
        >
            <DialogContent sx={{ position: "relative" }}>
                <RxCross1
                    onClick={() => setOpen(false)}
                    style={{
                        position: "absolute",
                        top: 15,
                        right: 15,
                        cursor: "pointer",
                        color: "white",
                        fontSize: "1.5rem",
                        zIndex: 10,
                    }}
                />
                
                {/* Render the Zoho Form component in modal mode */}
                <Form isModal={true} />
            </DialogContent>
        </Dialog>
    );
}