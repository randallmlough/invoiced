import React, { useState } from 'react'
import Form from '../../../components/UI/Form/Form'
import { useHistory } from 'react-router-dom'
import { Button } from '../../../components/UI'
import Input from '../../../components/UI/Form/Input'
import PropTypes from 'prop-types'
import { useSession } from '../../../components/Session'
import { useFlash } from '../../../components/Flash'
import { routes } from '../../../routes'
import {
  useNotification,
  welcomeNotification,
} from '../../../components/Notification'

export default function RegisterUser({ submit }) {
  const initialState = {
    first_name: '',
    last_name: '',
    email: '',
    password: '',
  }
  const [, setSession] = useSession()
  const [user] = useState(initialState)
  const history = useHistory()
  const notification = useNotification()
  const flash = useFlash()
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async data => {
    setSubmitting(true)
    await submit(data)
      .then(resp => {
        setSession(resp.sessionToken).then(() => {
          notification.add(welcomeNotification)
          history.push(routes.DASHBOARD)
        })
      })
      .catch(e => {
        if (e.status < 500) {
          if (e.status === 409)
            flash.add({
              type: 'danger',
              title: 'Uh oh!',
              body: 'That email is already in use or invalid',
            })
          else
            flash.add({
              type: 'danger',
              body: e.message,
            })
        }
        setSubmitting(false)
      })
  }
  return (
    <Form submit={handleSubmit}>
      <Input
        name="first_name"
        value={user.first_name}
        placeholder="Enter your first name"
        required
      >
        First name
      </Input>
      <Input
        name="last_name"
        value={user.last_name}
        placeholder="Enter your last name"
        required
      >
        Last name
      </Input>
      <Input
        name="email"
        value={user.email}
        placeholder="Enter your email"
        required
      >
        Email Address
      </Input>
      <Input
        name="password"
        value={user.password}
        type="password"
        placeholder="Enter your password"
        required
      >
        Password
      </Input>
      <Button primary full disabled={submitting} spinner={submitting}>
        {submitting ? '' : 'Register'}
      </Button>
    </Form>
  )
}

RegisterUser.propTypes = {
  submit: PropTypes.func.isRequired,
}
