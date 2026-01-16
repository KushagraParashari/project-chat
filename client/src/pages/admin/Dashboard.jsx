import React from 'react'
import AdminLayout from '../../components/layout/AdminLayout'
import { Typography } from '@mui/material'
import moment from 'moment'
import { Paper, Stack, Button } from '@mui/material';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import { Container } from '@mui/system';
import Box from '@mui/material/Box';
import { SearchField, CurveButton } from '../../components/styles/StyledComponents';
import { Group as GroupIcon, Person as PersonIcon, Message as MessageIcon } from '@mui/icons-material';
import { LineChart, DoughnutChart } from '../../components/specific/Charts';
import {useFetchData} from "6pp"
import {server} from "../../constants/server"

const Dashboard = () => {

  const {loading, data , error} = useFetchData(`${server}/api/v1/admin/stats`, "dashboard-stats")

  const Appbar = <Paper sx={{ padding: 2, textAlign: 'center', borderRadius: "1rem" }}>
    <Stack direction="row" spacing={"1rem"} justifyContent="space-between">
      <AdminPanelSettingsIcon sx={{ fontSize: "3rem" }} />
      <SearchField placeholder='Search...' />
      <CurveButton>Search</CurveButton>
      <Box flexGrow={1} />
      <Typography display={{ xs: 'none', sm: 'block' }} >{moment().format("dddd, D MMMM YYYY")}</Typography>
    </Stack>
  </Paper>

  const Widgets = <Stack direction={{ xs: " colume", sm: "row" }} spacing={2} justifyContent={"space-between"} alignItems={"center"} flexWrap={"wrap"} sx={{ marginTop: "2rem" }}>
    <Widget title={"Users"} value={100} Icon={<PersonIcon />} />
    <Widget title={"Chats"} value={50} Icon={<GroupIcon />} />
    <Widget title={"Messages"} value={200} Icon={<MessageIcon />} />
  </Stack>
  return loading?<></> :(
    <AdminLayout>
      <Container component={"main"}>
        {
          Appbar
        }
        <Stack direction={"row"} spacing={"2rem"} flexWrap={"wrap"} >
          <Paper sx={{ padding: 2, textAlign: 'center', flex: 1, minWidth: "200px", borderRadius: "1rem", height: "25rem" }} elevation={3}>
            <Typography >Last Messages</Typography>
            <LineChart value={[46, 57, 76, 45, 76]} />
          </Paper>
          <Paper
            sx={{
              padding: 2,
              textAlign: "center",
              flex: 1,
              minWidth: "200px",
              borderRadius: "1rem",
              height: "25rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            elevation={3}
          >
            <Box position="relative" width="fit-content" height="fit-content">
              <DoughnutChart value={[57, 32]} labels={["red", "blue"]} />
              <Stack
                position="absolute"
                top="50%"
                left="50%"
                sx={{ transform: "translate(-50%, -50%)" }}
                direction="row"
                spacing={1}
                justifyContent="center"
                alignItems="center"
              >
                <GroupIcon />
                <Typography>Vs</Typography>
                <PersonIcon />
              </Stack>
            </Box>
          </Paper>
        </Stack>
        {Widgets}
      </Container>
    </AdminLayout>
  )
}

const Widget = ({ title, value, Icon }) => <Paper sx={{ padding: 2, textAlign: 'center', borderRadius: "1rem" }}>
  <Stack direction={"row"} spacing={2} justifyContent={"space-between"} alignItems={"center"}>
    <Typography sx={{
      color: "rgba(0,0,0,0.7)", borderRadius: "50%", border: "5px solid rgba(0,0,0,0.2)", padding: "0.5rem", width: "5rem", height: "5rem", display: "flex", justifyContent: "center", alignItems: "center"

    }}
    >{value}</Typography>
    <Stack>
      {Icon}
      <Typography>{title}</Typography>
    </Stack>
  </Stack>

</Paper>

export default Dashboard