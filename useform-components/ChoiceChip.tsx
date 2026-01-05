import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import { IoCloseOutline, IoCloseSharp } from 'react-icons/io5';
import { MouseEventHandler } from 'react';

export default function CustomDeleteIconChips({ onClick, label = "", color, background }: { color?: string; background?: string; onClick?: MouseEventHandler<SVGElement>; label?: string }) {

    return (
        <Stack direction="row" spacing={1}>
            <Chip
                slotProps={{
                    root: { sx: { bgcolor: background || "#F4F9FF", ":hover": { bgcolor: background || "#F4F9FF" }, color: color } },
                }}
                label={label}
                onDelete={onClick}
                deleteIcon={<IoCloseOutline onClick={onClick} className='text-[#5F6368] text-[8px] text-sm' />}
            />

        </Stack>
    )
}