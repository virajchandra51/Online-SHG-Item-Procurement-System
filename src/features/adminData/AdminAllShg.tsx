import { ChevronRightRounded } from '@mui/icons-material';
import { Grid, TableBody, TableRow, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { RootState } from '../../app/store';
import {
  StyledContainer,
  StyledPaper,
  StyledTable,
  StyledTableCell,
  StyledTableHead,
  StyledTableHeadCell,
  StyledTablePagination,
  StyledTableRow,
} from '../../components/custom';
import TablePaginationActions from '../../components/custom/TablePaginationActions';
import {
  AdminSHGDataType,
  fetchAllShgData,
  selectAllShgs,
} from './adminDataSlice';
import AdminShgDetails from './AdminShgDetails';

const AdminAllShg = () => {
  const dispatch = useAppDispatch();
  const userToken = useAppSelector((state: RootState) => state.auth.token);
  const shgDataStatus = useAppSelector(
    (state: RootState) => state.admin.shgData.shgDataStatus
  );
  const shgData = useAppSelector(
    selectAllShgs
  ) as unknown as AdminSHGDataType[];

  const [selectedShg, setSelectedShg] = useState<
    AdminSHGDataType | undefined
  >();

  const [page, setPage] = useState<number>(0);
  const rowsPerPage = 5;
  const emptyRows = Math.max(0, (1 + page) * rowsPerPage - shgData?.length);

  const handleChangePage = (
    e: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setPage(newPage);
  };

  useEffect(() => {
    if (shgDataStatus === 'idle') dispatch(fetchAllShgData(userToken));
  }, [dispatch, userToken, shgDataStatus]);
  return (
    <StyledContainer sx={{ flexGrow: 1 }}>
      <Grid
        container
        spacing={3}
      >
        <Grid
          item
          xs={12}
          md={5}
        >
          <StyledPaper>
            <Typography
              variant="h2"
              sx={{ marginBottom: '1rem' }}
            >
              Self Help Group list
            </Typography>
            <StyledTable>
              <StyledTableHead sx={{ fontSize: '1rem' }}>
                <TableRow>
                  {/* <StyledTableHeadCell>Order Id</StyledTableHeadCell> */}
                  <StyledTableHeadCell>Name</StyledTableHeadCell>
                  <StyledTableHeadCell>Contact</StyledTableHeadCell>
                  <StyledTableHeadCell>Location</StyledTableHeadCell>
                </TableRow>
              </StyledTableHead>
              <TableBody>
                {(rowsPerPage > 0
                  ? shgData.slice(
                      page * rowsPerPage,
                      page * rowsPerPage + rowsPerPage
                    )
                  : shgData
                ).map((shg, index: number) => (
                  <StyledTableRow
                    sx={{ fontSize: '0.875rem' }}
                    key={shg._id}
                    selected={selectedShg?._id === shg._id}
                    // selected={selectedRow?.index === index}
                    onClick={() => {
                      setSelectedShg(shg);
                    }}
                  >
                    <StyledTableCell sx={{ marginTop: '1rem' }}>
                      {shg.name}
                    </StyledTableCell>
                    <StyledTableCell sx={{ marginTop: '1rem' }}>
                      {shg.contact}
                    </StyledTableCell>
                    <StyledTableCell sx={{ marginTop: '1rem' }}>
                      {shg.location}
                    </StyledTableCell>
                  </StyledTableRow>
                ))}
                {emptyRows > 0 && (
                  <StyledTableRow style={{ height: 53 * emptyRows }}>
                    <StyledTableCell colSpan={5} />
                  </StyledTableRow>
                )}
                <TableRow>
                  <StyledTablePagination
                    rowsPerPageOptions={[5]}
                    SelectProps={{
                      inputProps: {
                        'aria-label': 'rows per page',
                      },
                      native: true,
                    }}
                    count={shgData.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    ActionsComponent={TablePaginationActions}
                  />
                </TableRow>
              </TableBody>
            </StyledTable>
          </StyledPaper>
        </Grid>
        <Grid
          item
          xs={12}
          md={7}
        >
          <AdminShgDetails shgData={selectedShg as AdminSHGDataType} />
          {/* TODO: Show the detail of each Shgs */}
        </Grid>
      </Grid>
    </StyledContainer>
  );
};

export default AdminAllShg;
