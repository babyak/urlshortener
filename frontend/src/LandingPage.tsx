import 'date-fns';
import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { Button, Grid, TextField, Typography } from '@material-ui/core';


import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';

interface UrlFormData {
  originalUrl: string,
  expiry: Date
}

const defaultExpiry = () : Date => {
  let tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  return tomorrow
}

const initialFormState : UrlFormData = {
  originalUrl : 'https://rabbitfinance.com',
  expiry : defaultExpiry()
}

const SCHEME = 'http'
const HOST = 'localhost'
const PORT = '3000'

const LandingPage: React.FC = () => {
  const [originalUrl, setUrl] = useState(initialFormState.originalUrl)
  const [expiry, setExpiry] = useState(initialFormState.expiry)
  const [submitted, setSubmitted] = useState(false)
  const [code, setCode] = useState('')

  const handleSubmitUrl = async (event: any) => {
    event.preventDefault()
    const response = await fetch(
      'http://localhost:3000/urls', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          originalUrl,
          expiry,
        })
      }
    )
    const content = await response.json();
    setCode(content.code)
    setSubmitted(true)
  }

  const handleUrlChange = (event: any) => {
    console.log(event.target)
    setUrl(event.target.value)
  }

  const handleExpiryChange = (data: any) => {
    setExpiry(data)
  }

  const renderForm = () => {
    return (
      <form id="shortener-form" onSubmit={handleSubmitUrl}>
        <Grid container spacing={1}>
        <Grid item xs={12}>
          <TextField fullWidth={true} name="originalUrl" value={originalUrl} onChange={handleUrlChange}/>
        </Grid>
        <Grid item xs={12}>
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <KeyboardDatePicker
            margin="normal"
            id="Expiry Date"
            name="expiry"
            label="Short link expiration date"
            format="MM/dd/yyyy"
            value={expiry}
            onChange={handleExpiryChange}
            fullWidth={true}
            KeyboardButtonProps={{
              'aria-label': 'change date',
            }}
          />
        </MuiPickersUtilsProvider>
        </Grid>
        <Grid  item xs={12}>
          <Button size="large" type="submit" variant="outlined" color="primary">Shorten Url</Button>
        </Grid>
        </Grid>
      </form>

    )
  }

  const renderShortUrl = () => {
    const shortUrl = `${SCHEME}://${HOST}:${PORT}/${code}`
    return (
      <>
        <Typography variant="h3" gutterBottom>Your Short url is: </Typography>
        <Typography variant="h4" gutterBottom>
          <a href={shortUrl}>{shortUrl}</a>
        </Typography>
      </>
    )
  }

  return (
    <div className="App">
      <header className="App-header">
        {submitted ? renderShortUrl() : renderForm()}
      </header>
    </div>
  )
}

export default LandingPage;
