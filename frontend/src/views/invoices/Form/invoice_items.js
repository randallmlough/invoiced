import React, { useState, useEffect } from 'react'
import { Button } from '../../../components/UI'
import InvoiceItem from './invoice_item'

const initialState = {
  description: '',
  qty: 0,
  rate: 0,
  total: 0,
}
const InvoiceItems = ({ invoice, setInvoice }) => {
  const handleNewItem = e => {
    e.preventDefault()
    setInvoice('invoiceItems', [...invoice.invoiceItems, initialState])
  }

  const calcSubTotal = () =>
    invoice.invoiceItems.reduce((prev, cur) => prev + cur.total, 0)

  const [subTotal, setSubTotal] = useState(0)
  useEffect(() => {
    setSubTotal(calcSubTotal())
  })

  const calcTax = (subTotal, taxPercent) => subTotal * (taxPercent / 100)
  const [tax, setTax] = useState(0)
  useEffect(() => {
    setTax(calcTax(subTotal, invoice.tax))
  }, [subTotal, invoice.tax])

  useEffect(() => {
    setInvoice('total', subTotal + tax)
  }, [subTotal, tax])

  const handleTaxChange = e => {
    if (e.target.value.slice(-1) === '.') {
      // allow a decimal to be added
      setInvoice('tax', e.target.value)
    } else {
      setInvoice('tax', parseFloat(e.target.value))
    }
  }
  return (
    <>
      <table className="table-auto min-w-full leading-normal mb-4">
        <thead>
          <tr>
            <th className="bg-blue-700 font-semibold px-4 py-2 text-left text-white text-xs tracking-wider uppercase rounded-tl">
              Description
            </th>
            <th className="bg-blue-700 font-semibold px-4 py-2 text-left text-white text-xs tracking-wider uppercase">
              Quantity
            </th>
            <th className="bg-blue-700 font-semibold px-4 py-2 text-left text-white text-xs tracking-wider uppercase">
              Rate
            </th>
            <th className="bg-blue-700 font-semibold px-4 py-2 text-left text-white text-xs tracking-wider uppercase rounded-tr ">
              Total
            </th>
          </tr>
        </thead>
        <tbody>
          {invoice.invoiceItems.map((item, i) => (
            <InvoiceItem key={i} item={item} idx={i} setInvoice={setInvoice} />
          ))}
        </tbody>
      </table>
      <div className="row">
        <div className="col md:w-1/2">
          <Button primary small onClick={handleNewItem}>
            New item
          </Button>
        </div>
        <div className="col md:w-1/2">
          <div className="md:flex md:items-center">
            <div className="md:w-8/12">
              <h4 className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4">
                Subtotal
              </h4>
            </div>
            <div className="md:w-4/12 text-right">
              <span>$</span>
              <span>{Number(subTotal).toFixed(2)}</span>
            </div>
          </div>
          <div className="md:flex md:items-center">
            <div className="md:w-8/12">
              <h4 className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4">
                Tax %
              </h4>
            </div>
            <div className="md:w-4/12 text-right">
              <input
                type="text"
                className="appearance-none border-b-2 border-transparent hover:border-primary-200 w-full py-2 text-gray-700 leading-tight focus:outline-none focus:border-primary-300 text-right"
                value={Number(isNaN(invoice.tax) ? '' : invoice.tax).toFixed(2)}
                name="tax"
                onChange={handleTaxChange}
              />
            </div>
          </div>
          <div className="md:flex md:items-center">
            <div className="md:w-8/12">
              <h4 className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4">
                Total
              </h4>
            </div>
            <div className="md:w-4/12 text-right">
              <span>$</span>
              <span>{Number(invoice.total).toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default InvoiceItems
