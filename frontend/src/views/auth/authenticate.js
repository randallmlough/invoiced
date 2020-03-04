import React from 'react'
import { connect } from 'react-redux'
import { AuthenticateUserForm } from './Form'
import { Redirect } from 'react-router-dom'
import { useSession } from '../../components/Session'
import { Link } from '../../components/UI'
import { Button } from '../../components/UI'
import { useHistory } from 'react-router-dom'
import PropTypes from 'prop-types'
import { authenticateUserAction } from '../../actions'
export default function AuthenticateView({ submit }) {
  const [session, setSession] = useSession()
  const history = useHistory()
  const demoAccount = {
    email: 'demo@example.com',
    password: '1234567',
  }
  const handleDemo = e => {
    e.preventDefault()
    submit(demoAccount).then(resp => {
      setSession(resp.session_token)
      history.push('/')
    })
  }

  return (
    <>
      {session ? (
        <Redirect to="/" />
      ) : (
        <div className="container mx-auto px-4 py-32 h-screen">
          <div className="w-100 md:w-2/3 lg:w-1/2 xl:w-2/5 mx-auto">
            <div className="bg-neutral-100 px-10 pt-8 shadow-md w-full rounded-t">
              <div className="mb-6">
                <h3 className="text-gray-600">Sign in</h3>
              </div>
              <AuthenticateUserForm submit={submit} />
              <div className="my-6"></div>
              <Button white full onClick={handleDemo}>
                Demo
              </Button>
            </div>
            <div className="bg-neutral-100 p-10 shadow-md rounded-b w-full mb-5">
              <hr className="mt-10 mb-3 border-t border-neutral-300" />
              <div className="flex flex-col items-center">
                <div className="mb-2">
                  <span className="text-gray-dark text-sm mr-1">
                    Don't have an account?
                  </span>
                  <Link to="/register" inline>
                    Sign Up
                  </Link>
                </div>
                <div>
                  <span className="text-gray-dark text-sm mr-1">
                    Forgot your password?
                  </span>
                  <Link to="/forgot-password" inline>
                    Reset password
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

AuthenticateView.propTypes = {
  submit: PropTypes.func.isRequired,
}

const mapDispatchToProps = dispatch => ({
  submit: async user => await dispatch(authenticateUserAction(user)),
})

export const AuthenticateUserViewContainer = connect(
  null,
  mapDispatchToProps
)(AuthenticateView)
