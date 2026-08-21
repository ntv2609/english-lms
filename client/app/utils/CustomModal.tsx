import React, { FC } from "react";
import { Modal, Box } from "@mui/material";

interface Props { open: boolean; setOpen: (open: boolean) => void; activeItem: any; component: any; setRoute?: (route: string) => void; }

const CustomModal: FC<Props> = ({ open, setOpen, setRoute, component: Component }) => {
  return (
    <Modal open={open} onClose={() => setOpen(false)} sx={{backdropFilter: 'blur(4px)'}}>
      <Box className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] md:w-[450px] bg-white dark:bg-[#0A0A0A] border border-black/10 dark:border-white/10 rounded-2xl shadow-2xl p-8 md:p-10 outline-none">
        <Component setOpen={setOpen} setRoute={setRoute} />
      </Box>
    </Modal>
  );
};

export default CustomModal;