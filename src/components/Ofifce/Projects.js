import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Divider,
  IconButton,
  MenuItem,
  Modal,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { ReactComponent as VisibilityIcon } from "../Icons/quickView.svg";
import { ReactComponent as DeleteIcon } from "../Icons/bin.svg";
import DescriptionIcon from "@mui/icons-material/Description";
import apiClient from "../../api/apiClient";
import Toast from "../Toast";
import { DotLoader } from "react-spinners";
import Pagination from "../../Pagination";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: "8px",
};

const SiteManagement = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [toastData, setToastData] = useState({ bg: null, message: null });
  const [open, setOpen] = useState(false);
  const [selectedSite, setSelectedSite] = useState(null);

  const [employees, setEmployees] = useState([]);
  const [siteHeads, setSiteHeads] = useState([]);
  const [siteAssistants, setSiteAssistants] = useState([]);

  const initialData = {
    name: "",
    location: "",
    siteHead: "",
    assistant: "",
    employees: [],
  };
  const [siteData, setSiteData] = useState(initialData);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const handleEntriesChange = (event) => setEntriesPerPage(event.target.value);

  const showToastMessage = (message, bg) => {
    setToastData({ message, bg });
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  const handleOpen = () => {
    setSiteData(initialData);
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleDelete = async (id) => {
    setLoading(true);
    const response = await apiClient.delete(`/site/${id}`);
    if (response.status === 200) {
      showToastMessage("Site Deleted Successfully", "bg-success");
      fetchSites();
    }
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      if (selectedSite) {
        await apiClient.put(`/projects/${selectedSite._id}`, siteData);
        showToastMessage("Site Updated Successfully", "bg-success");
      } else {
        await apiClient.post("/projects/", siteData);
        showToastMessage("Site Added Successfully", "bg-success");
      }

      handleClose();
      fetchSites();
      setSiteData(initialData);
    } catch (error) {
      console.error("Error adding/updating site:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = (site) => {
    setSelectedSite(site);
    setSiteData({
      name: site.name || "",
      location: site.location || "",
      siteHead: site.siteHead?._id || "",
      assistant: site.assistant?._id || "",
      employees: site.employees.map((emp) => emp._id) || [],
    });
    setOpen(true);
  };

  const fetchSites = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get("/");
      console.log(response)
      if (response.status === 200 && Array.isArray(response.data)) {
        setData(response.data);
      } else {
        setData([]); // Ensure `data` is an array even if the response isn't an array
      }
    } catch (error) {
      console.error("Error fetching sites:", error);
      setData([]); // Set as empty array on error
    } finally {
      setLoading(false);
    }
  };
  
  const paginatedData = Array.isArray(data) 
    ? data.slice((currentPage - 1) * entriesPerPage, currentPage * entriesPerPage)
    : []; // Ensure `paginatedData` is always an array  

    const fetchDropdownData = async () => {
        try {
          const [employeesRes, siteHeadsRes, siteAssistantsRes] = await Promise.all([
            apiClient.get("/users/available/employees"),
            apiClient.get("/users/available/site-head"),
            apiClient.get("/users/available/site-assistant"),
          ]);
      
          // Ensure each set function only sets an array, or defaults to an empty array if data is not an array
          setEmployees(Array.isArray(employeesRes.data) ? employeesRes.data : []);
          setSiteHeads(Array.isArray(siteHeadsRes.data) ? siteHeadsRes.data : []);
          setSiteAssistants(Array.isArray(siteAssistantsRes.data) ? siteAssistantsRes.data : []);

          console.log(siteHeads, '123');
        } catch (error) {
          console.error("Error fetching dropdown data:", error);
          // Set to empty arrays on error to avoid issues
          setEmployees([]);
          setSiteHeads([]);
          setSiteAssistants([]);
        }
      };

  useEffect(() => {
    fetchSites();
    fetchDropdownData();
  }, []);

//  const paginatedData = data.slice(
//    (currentPage - 1) * entriesPerPage,
//    currentPage * entriesPerPage
//  );

  return (
    <Box className="p-6">
      {showToast && <Toast bg={toastData.bg} message={toastData.message} />}

      <Box className="flex justify-between items-center mb-4">
        <Typography variant="h5" className="mb-4 font-semibold text-gray-800">
          Site Management
        </Typography>
        <Button variant="contained" className="mb-4 !bg-[#FC8908]" onClick={handleOpen}>
          + Add Site
        </Button>
      </Box>

      {loading ? (
        <Box className="flex justify-center items-center">
          <DotLoader color="#f1780e" loading={loading} speedMultiplier={1} />
        </Box>
      ) : (
        <TableContainer component={Paper} style={{ overflowX: "auto" }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Location</TableCell>
                <TableCell>Site Head</TableCell>
                <TableCell>Assistant</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedData.map((row, index) => (
                <TableRow key={index}>
                  <TableCell>{row.name}</TableCell>
                  <TableCell>{row.location}</TableCell>
                  <TableCell>{row.siteHead?.name || "N/A"}</TableCell>
                  <TableCell>{row.assistant?.name || "N/A"}</TableCell>
                  <TableCell>
                    <Box className="flex items-center justify-around rounded-lg border border-gray-300">
                      <IconButton aria-label="view" sx={{ color: "#6c757d" }} onClick={() => handleEdit(row)}>
                        <VisibilityIcon />
                      </IconButton>
                      <Divider orientation="vertical" flexItem sx={{ borderColor: "#e0e0e0" }} />
                      <IconButton aria-label="delete" sx={{ color: "#dc3545" }} onClick={() => handleDelete(row._id)}>
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Modal open={open} onClose={handleClose} aria-labelledby="modal-title" aria-describedby="modal-description">
        <Box sx={style}>
          <Typography id="modal-title" variant="h6" component="h2">
            {selectedSite ? "Edit Site" : "Add Site"}
          </Typography>
          <Box component="form" noValidate autoComplete="off" className="flex flex-col gap-4 mt-4" onSubmit={handleSubmit}>
            <TextField
              required
              label="Site Name"
              fullWidth
              value={siteData.name}
              onChange={(e) => setSiteData({ ...siteData, name: e.target.value })}
            />
            <TextField
              required
              label="Location"
              fullWidth
              value={siteData.location}
              onChange={(e) => setSiteData({ ...siteData, location: e.target.value })}
            />
            <Select
              required
              fullWidth
              displayEmpty
              value={siteData.siteHead}
              onChange={(e) => setSiteData({ ...siteData, siteHead: e.target.value })}
            >
              <MenuItem value="">Select Site Head</MenuItem>
              {siteHeads.map((head) => (
                <MenuItem key={head._id} value={head._id}>
                  {head.name}
                </MenuItem>
              ))}
            </Select>
            <Select
              required
              fullWidth
              displayEmpty
              value={siteData.assistant}
              onChange={(e) => setSiteData({ ...siteData, assistant: e.target.value })}
            >
              <MenuItem value="">Select Assistant</MenuItem>
              {siteAssistants.map((assistant) => (
                <MenuItem key={assistant._id} value={assistant._id}>
                  {assistant.name}
                </MenuItem>
              ))}
            </Select>
            <Select
              multiple
              fullWidth
              displayEmpty
              value={siteData.employees}
              onChange={(e) => setSiteData({ ...siteData, employees: e.target.value })}
            >
              <MenuItem value="">Select Employees</MenuItem>
              {employees.map((employee) => (
                <MenuItem key={employee._id} value={employee._id}>
                  {employee.name}
                </MenuItem>
              ))}
            </Select>
            <div className="flex justify-end mt-4">
              <Button onClick={handleClose} color="error">
                Cancel
              </Button>
              <Button type="submit" variant="contained" className="!bg-[#FC8908]">
                {isSaving ? (
                  <DotLoader color="#fff" size={20} speedMultiplier={1} />
                ) : selectedSite ? "Update Site" : "Add Site"}
              </Button>
            </div>
          </Box>
        </Box>
      </Modal>

      <div className="flex justify-between items-center mt-6">
        <Pagination
          totalEntries={data.length}
          entriesPerPage={entriesPerPage}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          onEntriesPerPageChange={handleEntriesChange}
        />
      </div>
    </Box>
  );
};

export default SiteManagement;
