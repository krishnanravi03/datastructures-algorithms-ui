import React, { useRef } from 'react';
import axios from 'axios'
import { useState } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import './LandingPage.css';
import { Stack } from '@mui/material';
import { Snackbar } from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import { useReactToPrint } from 'react-to-print';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function LandingPage(){
    const [result, setResult] = useState("");
    const [rows, setRows] = useState("");
    const [columns, setColumns] = useState("");
    const [open, setOpen] = useState(false);
    const [errorMsg, setErrMsg] = useState(false);
    const [solutions, setSolutions] = useState("");
    const [currElement, setCurrElement] = useState("");
    const [showSolutions, setShowSolutions] = useState(false);
    const [openbackDrop, setOpenbackDrop] = useState(false);
    const componentRef = useRef();
    const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    });
    const baseURL = "https://4rlmhiyaoi.execute-api.us-east-1.amazonaws.com/default/datastructures-algorithms";

    const handleClick = (type) => {
      
        if(rows === "" || columns === ""){
          setErrMsg("Invalid input for rows or columns, both are required!")
          setOpen(true);
          return;
        }
        if(rows > 35 || columns > 35){
          setOpen(true);
          setErrMsg("Invalid input for rows or columns, value should be less than or equal to 35!")
          return;
        }
        setOpenbackDrop(true);
        setShowSolutions(false);
        axios.post(baseURL, {
            "type":type,
            "rows":rows,
            "columns":columns
         }).then(
            (response) => {
              if(type === "puzzle"){
                var resObj = JSON.parse(response.data.responseMessage);
                setResult(resObj["puzzle"]);
                setSolutions(resObj["solution"]);
              } 
              else{
                setResult(response.data.responseMessage);
                setShowSolutions(false);
                setCurrElement("Maze");
              } 
              setCurrElement(type);
          });
        setOpenbackDrop(false);
    }

    const handleClose = (event, reason) => {
      if (reason === 'clickaway') {
        return;
      }
  
      setOpen(false);
    };

    const showSolution = (event) => {
      setShowSolutions(true);
    }


    return(
      <div>

        <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={openbackDrop}
      >
        <CircularProgress color="success" />
      </Backdrop>
      <Box sx={{ width: 1 }}>
      <Box display="grid" gridTemplateColumns="repeat(12, 1fr)" gap={1}>
      <Box gridColumn="span 1">
      </Box>
        <Box gridColumn="span 9">
          <Box display="grid" gridTemplateColumns="repeat(12, 1fr)" gap={2}>
          <Box gridColumn="span 12" >
          <Stack spacing={2} direction="row">
          <TextField type = "number" id="outlined-basic" label="Rows" variant="outlined" value={rows} onChange={(e) => setRows(e.target.value) } 
          InputProps={{
              inputProps: { 
                  max: 35, min: 1 
              }
          }}  fullWidth />
        <TextField type = "number" id="outlined-basic" label="Columns" variant="outlined" value={columns} onChange={(e) => setColumns(e.target.value)}  
         InputProps={{
            inputProps: { 
              max: 35, min: 1 
             }
          }} fullWidth />
          </Stack>
          <br></br>
          <Stack spacing={2} direction="row">
        <Button variant="contained" color="success" size="large" onClick={() => handleClick("maze")}> Generate Maze</Button>
        <Button variant="contained" color="success" size="large" onClick={() => handleClick("puzzle")}> Generate Puzzle</Button>
        { currElement != "" && <Button variant="contained" color="success" size="large" onClick={handlePrint}>Print</Button>}
        {
          currElement === "puzzle" &&
          <Button variant="contained" color="success" size="large" onClick={() => showSolution()}> Solve Puzzle</Button>
        }
        
        </Stack>
          </Box>
          <Box gridColumn="span 12">
          <div id = "textarea" ref={componentRef}>
              {result}
          </div>
          </Box>
          </Box>
        </Box>
        <Box gridColumn="span 2">
        { currElement === "puzzle" && showSolutions &&
          <div id="solutions">
            <h3>Found words</h3>
            {solutions.map(function(d, idx){
                return (<li key={idx}>{d}</li>)
            })}
          </div>
        }
        </Box>
      </Box>
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
      <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
        {errorMsg}
      </Alert>
      </Snackbar>
     
    </Box>
    </div>
    );

}

export default LandingPage;