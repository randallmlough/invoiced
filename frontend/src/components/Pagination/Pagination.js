import React, { Component } from 'react'
import PropTypes from 'prop-types'

const LEFT_PAGE = 'LEFT'
const RIGHT_PAGE = 'RIGHT'

const range = (from, to, step = 1) => {
  let i = from
  const range = []

  while (i <= to) {
    range.push(i)
    i += step
  }

  return range
}

class Pagination extends Component {
  constructor(props) {
    super(props)
    const { totalRecords = null, pageLimit = 30, pageNeighbors = 0 } = props
    this.totalRecords = typeof totalRecords === 'number' ? totalRecords : 0
    this.pageLimit = typeof pageLimit === 'number' ? pageLimit : 30
    this.totalPages = this.calcTotalPages(this.totalRecords, this.pageLimit)
    // neighbors can either be 0, 1, or 2
    this.pageNeighbors =
      typeof pageNeighbors === 'number'
        ? Math.max(0, Math.min(pageNeighbors, 2))
        : 0
    this.state = {
      currentPage: 1,
    }
  }

  componentDidMount() {
    this.reset()
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      this.props.pageLimit !== prevProps.pageLimit ||
      this.props.totalRecords !== prevProps.totalRecords
    ) {
      const tr = this.props.totalRecords
      const pl = this.props.pageLimit

      this.totalRecords = tr
      this.pageLimit = pl
      this.totalPages = this.calcTotalPages(tr, pl)
      this.reset()
    }
  }

  calcTotalPages = (totalRecords, pageLimit) =>
    Math.ceil(totalRecords / pageLimit)

  reset = () => {
    this.goToPage(1)
  }
  goToPage = page => {
    const { onPageChanged = f => f } = this.props
    const currentPage = Math.max(0, Math.min(page, this.totalPages))
    const offset = (currentPage - 1) * this.pageLimit

    const paginationData = {
      currentPage,
      totalPages: this.totalPages,
      pageLimit: this.pageLimit,
      totalRecords: this.totalRecords,
      offset,
    }
    this.setState({ currentPage }, () => onPageChanged(paginationData))
  }

  handleClick = (page, event) => {
    event.preventDefault()
    this.goToPage(page)
  }

  handleMoveLeft = event => {
    event.preventDefault()
    this.goToPage(this.state.currentPage - this.pageNeighbors * 2 - 1)
  }

  handleMoveRight = event => {
    event.preventDefault()
    this.goToPage(this.state.currentPage + this.pageNeighbors * 2 + 1)
  }

  fetchTotalPages = () => this.totalPages

  fetchPageNumbers = () => {
    const totalPages = this.totalPages
    const currentPage = this.state.currentPage
    const pageNeighbors = this.pageNeighbors

    /**
     *    this.pageNeighbors * 2     <- this covers the left and right page numbers next to the current page
     *    + 3    <- this covers the first page, current page, and last page
     *    + 2     <- add in 2 two additional blocks for the < > controls
     *    (1) < {4 5} [6] {7 8} > (10)    <- example of page numbers available
     */
    const totalNumbers = this.pageNeighbors * 2 + 3
    const totalBlocks = totalNumbers + 2

    if (totalPages > totalBlocks) {
      let pages = []

      const leftBound = currentPage - pageNeighbors
      const rightBound = currentPage + pageNeighbors
      const beforeLastPage = totalPages - 1

      const startPage = leftBound > 2 ? leftBound : 2
      const endPage = rightBound < beforeLastPage ? rightBound : beforeLastPage

      pages = range(startPage, endPage)

      const pagesCount = pages.length
      const singleSpillOffset = totalNumbers - pagesCount - 1

      const hasLeftSpill = startPage > 2
      const hasRightSpill = endPage < beforeLastPage

      const leftSpillPage = LEFT_PAGE
      const rightSpillPage = RIGHT_PAGE

      if (hasLeftSpill && !hasRightSpill) {
        // handle: (1) < {5 6} [7] {8 9} (10)
        const extraPages = range(startPage - singleSpillOffset, startPage - 1)
        pages = [leftSpillPage, ...extraPages, ...pages]
      } else if (!hasLeftSpill && hasRightSpill) {
        // handle: (1) {2 3} [4] {5 6} > (10)
        const extraPages = range(endPage + 1, endPage + singleSpillOffset)
        pages = [...pages, ...extraPages, rightSpillPage]
      } else if (hasLeftSpill && hasRightSpill) {
        // handle: (1) < {4 5} [6] {7 8} > (10)
        pages = [leftSpillPage, ...pages, rightSpillPage]
      }

      return [1, ...pages, totalPages]
    }

    return range(1, totalPages)
  }

  render() {
    if (!this.totalRecords || this.totalPages <= 1) return null

    const { currentPage } = this.state
    const { prevNextOnly } = this.props
    if (prevNextOnly) {
      return (
        <nav aria-label="flex">
          <button
            aria-label="Previous"
            className="bg-gray-300 focus:outline-none font-semibold hover:bg-gray-400 px-4 py-2 rounded-l-md text-gray-800 text-sm"
            onClick={e =>
              this.handleClick(currentPage > 2 ? currentPage - 1 : 1, e)
            }
          >
            <span className="">Prev</span>
          </button>
          <button
            aria-label="Next"
            className="bg-gray-300 focus:outline-none font-semibold hover:bg-gray-400 px-4 py-2 rounded-r-md text-gray-800 text-sm"
            onClick={e =>
              this.handleClick(
                currentPage < this.totalPages
                  ? currentPage + 1
                  : this.totalPages,
                e
              )
            }
          >
            <span className="">Next</span>
          </button>
        </nav>
      )
    }
    const pages = this.fetchPageNumbers()
    return (
      <>
        <nav aria-label="Invoices Pagination">
          <ul className="flex">
            {pages.map((page, index) => {
              let baseStyles =
                'text-sm bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 focus:outline-none'
              if (index === 0) baseStyles = `${baseStyles} rounded-l`
              if (index === pages.length - 1)
                baseStyles = `${baseStyles} rounded-r`

              if (page === LEFT_PAGE)
                return (
                  <li key={index}>
                    <button
                      aria-label="Previous"
                      className="text-sm bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4"
                      onClick={this.handleMoveLeft}
                    >
                      <span aria-hidden="true">&laquo;</span>
                      <span className="sr-only">Previous</span>
                    </button>
                  </li>
                )

              if (page === RIGHT_PAGE)
                return (
                  <li key={index}>
                    <button
                      aria-label="Next"
                      className="text-sm bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4"
                      onClick={this.handleMoveRight}
                    >
                      <span aria-hidden="true">&raquo;</span>
                      <span className="sr-only">Next</span>
                    </button>
                  </li>
                )

              return (
                <li key={index}>
                  <button
                    className={`${baseStyles}${
                      currentPage === page ? ' bg-gray-400' : ''
                    }`}
                    onClick={e => this.handleClick(page, e)}
                  >
                    {page}
                  </button>
                </li>
              )
            })}
          </ul>
        </nav>
      </>
    )
  }
}

Pagination.propTypes = {
  totalRecords: PropTypes.number.isRequired,
  pageLimit: PropTypes.number,
  pageNeighbors: PropTypes.number,
  onPageChanged: PropTypes.func,
}

export default Pagination
