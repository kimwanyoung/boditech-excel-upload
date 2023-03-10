/* eslint-disable react-hooks/exhaustive-deps */
import styled from "styled-components";
import Spreadsheet from "react-spreadsheet";
import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { columnName } from "../../mocks/Rows";
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import { Button, IconButton } from "@mui/material";
import CompanyModal from "../../components/CompanyModal";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { Stack } from "@mui/system";
import { useDispatch, useSelector } from "react-redux";
import { agencySelector, logout, statusSelector } from "../user/userSlice";
import { getAdminData, getCurrentData, selectSheetData } from "./sheetSlice";


const Admin = () => {
  const columnNames = columnName
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const agencyName = useSelector(agencySelector);
  const pagingList = useSelector(state => state.sheet.sheetPageNum)
  const excel = useSelector(selectSheetData)
  const status = useSelector(statusSelector)

  const [offset, setOffset] = useState(0);
  const [isSearching, setIsSearching] = useState(false);
  const [value, setValue] = useState('');

  useEffect(() => {
    columnNames.shift()
    if (status === 'success' && !value) {
      dispatch(getAdminData(offset));
    } else if (status === 'success' && value) {
      dispatch(getCurrentData(value))
    }
    else {
      navigate('/')
    }
  }, [offset, navigate, status, dispatch, value])

  const handleLogout = () => {
    dispatch(logout())
  }

  const clearInput = () => {
    setValue('');
  }
  return (
    <AppWrapper>
      <Box position="absolute" top="0" left="0" width="30vw" height="30vh">
        <List>
          <ListItem>
            <ListItemIcon>
              <FiberManualRecordIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="This is the administrator page." />
          </ListItem>
        </List>
      </Box>
      <BtnContainer>
        <BtnWrapper onClick={() => {
          clearInput();
          setIsSearching(false)
          setOffset(0)
          dispatch(getAdminData(offset));
        }} variant="contained">
          FCST lookup
        </BtnWrapper>
      </BtnContainer>
      <TableWrapper>
        <TitleLayout>
          <TitleWrapper>
            <FileTitle>
              <h2>{agencyName}</h2>
              <BtnWrapper variant="outlined" onClick={handleLogout}>Logout</BtnWrapper>
            </FileTitle>
          </TitleWrapper>
          <FilterWrapper>
            <FileTitle>Filter</FileTitle>
            <CompanyModal value={value} setValue={setValue} setIsSearching={setIsSearching} />
          </FilterWrapper>
          {!isSearching && <PagingWrapper>
            <Paging>{offset >= pagingList ? offset - 30 : offset} - {offset + 30 > pagingList ? pagingList : offset + 30} of {pagingList}</Paging>
            <IconButton onClick={() => setOffset(prev => {
              if (prev - 30 <= 0) return prev = 0;
              else return prev - 30;
            })}>
              <ArrowBackIosIcon />
            </IconButton>
            <Stack direction="row" spacing={1}>
              <IconBtn onClick={() => setOffset(prev => {
                if (prev + 30 >= pagingList) return prev;
                else return prev + 30;
              })}>
                <ArrowForwardIosIcon />
              </IconBtn>
            </Stack>
          </PagingWrapper>}
        </TitleLayout>
        <SpreadsheetWrapper columnLabels={columnNames} data={excel} />
      </TableWrapper>
    </AppWrapper>
  );
}

export default Admin;

const FilterWrapper = styled.div`
  display: flex;
  align-items:center;
  margin-right: 2rem;
`

const IconBtn = styled(IconButton)`
  display: flex !important;
  align-items: center !important;
  justify-content:center !important;
`

const PagingWrapper = styled.div`
  display:flex;
  align-items: center;
  justify-content: space-around;
  height: 100%;
  width: 20rem;
  padding-top: 0.5rem;
  font-weight: 600;
  margin-right: 1rem;
`

const Paging = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-around;
  width: 7rem;
  height: 20px;
`

const AppWrapper = styled.div`
  position:relative;
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
  width: 100vw;
  height: 100vh;
`
const BtnWrapper = styled(Button)`
  width: 10rem;
  margin-right: 1rem !important;
  margin-left: 1rem !important;
`

const TableWrapper = styled.div`
  display: flex;
  align-items:flex-start;
  justify-content: center;
  flex-direction: column;
  max-height: 100vh;
  width: 100%;
  overflow:scroll;

  *{
    color: darkslategray !important;
  }
`

const SpreadsheetWrapper = styled(Spreadsheet)`
  margin: 0 !important;
  max-height:58vh;

  * {
     text-align: center !important;
  }
`

const FileTitle = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 1.1rem;
  font-weight: 600;
  margin:1rem 0.5rem 1rem 1rem;
`

const TitleWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
`

const BtnContainer = styled.div`
  position: absolute;
  top:0;
  right:0;
  display: flex;
  justify-content:flex-end;
  width: 100%;
  margin-top: 1rem;
`

const TitleLayout = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 5rem;
  width: 100%;
`