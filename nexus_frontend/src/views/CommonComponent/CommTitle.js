const { DialogTitle, IconButton } = require("@mui/material");
const { GridCloseIcon } = require("@mui/x-data-grid");

function CommTitle(props) {
    const { children, onClose, ...other } = props;
    return (
      <DialogTitle sx={{ m: 0, p: 2 }} {...other} className='add-user-title'>
        {children}
        {onClose ? (
          <IconButton
            aria-label='close'
            onClick={onClose}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}>
            <GridCloseIcon />
          </IconButton>
        ) : null}
      </DialogTitle>
    );
  }
export default CommTitle;