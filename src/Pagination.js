import React from "react";
import { Box, IconButton, Typography, Select, MenuItem, useMediaQuery } from "@mui/material";
import { ReactComponent as ChevronLeftIcon } from "../src/components/Icons/left-arrow.svg";
import { ReactComponent as ChevronRightIcon } from "../src/components/Icons/right-arrow.svg";
import { useTheme } from "@mui/material/styles";

const Pagination = ({
  totalEntries,
  entriesPerPage,
  currentPage,
  onPageChange,
  onEntriesPerPageChange,
}) => {
  const totalPages = Math.ceil(totalEntries / entriesPerPage);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  return (
    <Box className="flex justify-between items-center mt-6">
      <Box className="flex items-center">
        <Typography variant="body2" color="textSecondary" className="mr-2 pr-2">
          Showing
        </Typography>
        <Select
          value={entriesPerPage}
          onChange={onEntriesPerPageChange}
          size="small"
          className="mr-2 dropdown-svg bg-orange-400 text-white"
        >
          <MenuItem value={10}>10</MenuItem>
          <MenuItem value={25}>25</MenuItem>
          <MenuItem value={50}>50</MenuItem>
        </Select>
        <Typography variant="body2" color="textSecondary">
          of {totalEntries} entries
        </Typography>
      </Box>

      <Box className="flex items-center">
        {!isMobile && (
            <Typography variant="body2" color="textSecondary">
                Page {currentPage} of {totalPages}
            </Typography>
            )}
        <IconButton
          aria-label="previous page"
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
        >
          <ChevronLeftIcon />
        </IconButton>
        <Typography variant="body2" color="textSecondary">
          {currentPage}
        </Typography>
        <IconButton
          aria-label="next page"
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
        >
          <ChevronRightIcon />
        </IconButton>
      </Box>
    </Box>
  );
};

export default Pagination;
