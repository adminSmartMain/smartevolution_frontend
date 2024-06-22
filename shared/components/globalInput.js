import MuiTextField from "@styles/fields";

export default function GlobalInput() {
  return (
    <MuiTextField
      variant="standard"
      margin="normal"
      fullWidth
      InputProps={{
        disableUnderline: true,
      }}
    />
  );
}
