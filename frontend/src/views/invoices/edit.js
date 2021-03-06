import React, { useState, useEffect, useReducer } from 'react'
import { Loader } from '../../components/UI/loaders'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { getInvoice } from '../../api'
import {
  updateInvoiceAction,
  getInvoiceAction,
  deleteInvoiceAction,
} from '../../actions'
import { InvoiceForm } from './Form'
import Sidebar from './sidebar'

import { useInvoice } from './useInvoice'
import { initialState } from '.'

const EditInvoiceView = props => {
  const { submit, deleteInvoice } = props
  const [{ data: invoice, loading }, setInvoice] = useInvoice(
    props.match.params.id,
    initialState,
    getInvoice
  )

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div className="container mx-auto sm:px-4 py-8">
          <div className="py-8">
            <div className="row">
              <div className="col md:w-3/4 shadow rounded-lg bg-white">
                <InvoiceForm invoice={invoice} setInvoice={setInvoice} />
              </div>
              <div className="col md:w-1/4 pl-8">
                <Sidebar
                  editing
                  invoice={invoice}
                  setInvoice={setInvoice}
                  submit={submit}
                  deleteInvoice={deleteInvoice}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

EditInvoiceView.propTypes = {
  submit: PropTypes.func.isRequired,
}

const mapStateToProps = (state = {}, ownProps) => ({
  invoice: state.entities.invoices[parseInt(ownProps.match.params.id)],
})

const mapDispatchToProps = dispatch => ({
  getInvoice: async invoiceId => await dispatch(getInvoiceAction(invoiceId)),
  submit: async invoice => await dispatch(updateInvoiceAction(invoice)),
  deleteInvoice: async invoiceId =>
    await dispatch(deleteInvoiceAction(invoiceId)),
})

export default connect(mapStateToProps, mapDispatchToProps)(EditInvoiceView)
