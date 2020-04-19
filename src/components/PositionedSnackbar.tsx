import React from 'react';
import Snackbar, { SnackbarOrigin } from '@material-ui/core/Snackbar';

export interface ISnackbarProps extends SnackbarOrigin {
  vertical: 'top' | 'bottom';
  horizontal: 'left' | 'right' | 'center';
  open: boolean;
  message: string;
  autoHideDuration: number;
  handleSnackbarToggle: (message?: string) => void;
}

export default function PositionedSnackbar(props: ISnackbarProps) {
  const { vertical, horizontal, open, message, handleSnackbarToggle, autoHideDuration } = props;

  const handleClose = () => {
    handleSnackbarToggle();
  };

  return (
    <div>
      <Snackbar
        anchorOrigin={{ vertical, horizontal }}
        autoHideDuration={autoHideDuration}
        key={`${vertical},${horizontal}`}
        open={open}
        onClose={handleClose}
        message={message}
      />
    </div>
  );
}
