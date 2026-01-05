import * as React from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { InputAdornment } from "@mui/material";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

type Props = {
  placeholder?: string;
  onChange: (x: React.ChangeEvent<HTMLInputElement>) => void;
  label?: string;
  value?: string;
  onBlur?: () => void
  minRow?: number
  hasIcon?: boolean
  alignCenterInput?: boolean
  focus?: boolean
};

export default function BasicTextFields({
  alignCenterInput = false,
  placeholder = "",
  value,
  onChange,
  onBlur,
  label = "",
  minRow = 1,
  hasIcon = true,
  focus = false
}: Props) {

  const inputRef = React.useRef<HTMLInputElement>(null)

  function selectText() {
    focus && inputRef.current?.select()
  }

  React.useEffect(() => {
    inputRef.current?.select()
  }, [])

  return (
    <Box >
      <CustomLabel text={label} required={false} />
      <TextField

        sx={{ textAlign: "center" }}
        slotProps={{
          htmlInput: {
            style: { textAlign: alignCenterInput ? "center" : "left" },
          },
          input: {
            startAdornment: hasIcon ? (
              <InputAdornment position="start">
                <MagnifyingGlassIcon style={{ width: 20, height: 20, color: '#888' }} />
              </InputAdornment>
            ) : undefined,
          }
        }}
        // inputProps={{ style: { textAlign: alignCenterInput ? "center" : "left" }, }}
        // InputProps={{
        //   // style: { textAlign: "center" },
        //   startAdornment: hasIcon ? (
        //     <InputAdornment position="start">
        //       <MagnifyingGlassIcon style={{ width: 20, height: 20, color: '#888' }} />
        //     </InputAdornment>
        //   ) : undefined,
        // }}
        placeholder={placeholder}
        onClick={selectText}
        inputRef={inputRef}
        size="small"
        fullWidth
        multiline
        minRows={minRow}
        className=" bg-white"
        onBlur={onBlur}
        value={value}
        onChange={onChange}
        variant="outlined"
      />
    </Box>
  );
}
function CustomLabel({ text = "", required = false, isError = false }: { required?: boolean; text: string; isError?: boolean }) {
  return (
    <div className='text-sm my-1' style={{ color: isError ? "red" : undefined }}>{text} {required && <span className='text-error'>*</span>} </div>
  );
}