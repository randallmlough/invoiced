import React, { useEffect } from 'react'
import { StackedCounter, Icon } from '../../../components/UI'

const InvoiceItem = ({ item, setInvoice, idx }) => {
  useEffect(() => {
    setItem(
      'total',
      (isNaN(item.qty) ? 0 : item.qty) * (isNaN(item.rate) ? 0 : item.rate)
    )
  }, [item.qty, item.rate])

  const handleChange = key => {
    return e => {
      if (key === 'description') {
        setItem(key, e.target.value)
      } else {
        setItem(key, parseFloat(e.target.value))
      }
    }
  }

  const handleCounterChange = key => count => {
    setItem(key, count)
  }

  const setItem = (key, value) =>
    setInvoice('invoiceItems.' + idx + '.' + key, value)

  return (
    <tr>
      <td className="border px-4 py-2 odd:bg-gray-200">
        <textarea
          type="text"
          className="w-full border border-transparent focus:border-primary-200 focus:outline-none px-2 resize-none"
          value={item.description}
          name="description"
          placeholder="Item description"
          onChange={handleChange('description')}
        />
      </td>
      <td className="border px-4 py-2 odd:bg-gray-200">
        <StackedCounter
          startValue={isNaN(item.qty) ? '' : Number(item.qty)}
          onStateChanged={handleCounterChange('qty')}
        />
        {/* <input
          type="number"
          className="w-full border border-transparent focus:border-blue-200 focus:outline-none px-2"
          value={isNaN(item.qty) ? '' : Number(item.qty).toFixed(0)}
          name="qty"
          onChange={handleChange('qty')}
        /> */}
      </td>
      <td className="border px-4 py-2 odd:bg-gray-200">
        <label className="flex items-center w-full">
          <Icon icon="dollar-sign" className="mr-2" />
          <div>
            <input
              type="number"
              className="appearance-none w-full border border-transparent focus:border-primary-200 focus:outline-none px-2"
              value={isNaN(item.rate) ? '' : item.rate}
              name="rate"
              onChange={handleChange('rate')}
            />
          </div>
        </label>
      </td>
      <td className="border px-4 py-2 odd:bg-gray-200">
        <div className="px-2 text-right">$ {Number(item.total).toFixed(2)}</div>
      </td>
    </tr>
  )
}

export default InvoiceItem
