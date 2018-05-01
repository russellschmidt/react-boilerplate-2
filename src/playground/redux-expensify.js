import { createStore, combineReducers } from 'redux'
import uuid from 'uuid'

// Add Expense
const addExpense = ({ description = '', note = '', amount = 0, createdAt = 0} = {}) => ({
  type: 'ADD_EXPENSE',
  expense: {
    id: uuid(),
    description,
    note,
    amount,
    createdAt
  }
})

// Remove Expense
const removeExpense = ({id} = {}) => ({
  type: 'REMOVE_EXPENSE',
  id
})

// Edit Expense
const editExpense = (id, updates) => ({
  type: 'EDIT_EXPENSE',
  id,
  updates
})

// Expenses reducer
const expensesReducerDefaultState = []
const expensesReducer = (state = expensesReducerDefaultState, action) => {
  switch (action.type) {
    case 'ADD_EXPENSE':
      return [
        ...state,
        action.expense
      ]
    case 'REMOVE_EXPENSE':
      return state.filter(({ id }) => id !== action.id)
    case 'EDIT_EXPENSE':
      return state.map((expense) => {
        if (expense.id === action.id) {
          return {
            ...expense,
            ...action.updates
          }
        } else {
          return expense
        }
      })
    default:
      return state
  }
}

// FILTERS REDUCER
// Set text filter
const setTextFilter = (text = '') => ({
  type: 'SET_TEXT_FILTER',
  text
})
// sort by date
const sortByDate = () => ({
  type: 'SORT_BY_DATE'
})
// sort by amount
const sortByAmount = () => ({
  type: 'SORT_BY_AMOUNT'
})
// set start date
const setStartDate = (startDate) => ({
  type: 'SET_START_DATE',
  startDate
})
// set end date
const setEndDate = (endDate) => ({
  type: 'SET_END_DATE',
  endDate
})

const filtersReducerDefaultState = {
  text: '',
  sortBy: 'date',
  startDate: undefined,
  endDate: undefined
}

const filtersReducer = (state = filtersReducerDefaultState, action) => {
  switch (action.type) {
    case 'SET_TEXT_FILTER':
      return {
        ...state,
        text: action.text
      }
    case 'SORT_BY_DATE':
      return {
        ...state,
        sortBy: 'date'
      }
    case 'SORT_BY_AMOUNT':
      return {
        ...state,
        sortBy: 'amount'
      }
    case 'SET_START_DATE':
      return {
        ...state,
        startDate: action.startDate
      }
    case 'SET_END_DATE':
      return {
        ...state,
        endDate: action.endDate
      }
    default: 
      return state
  }
}

// timestamps - just an integer value, can be positive or negative
// counting in milliseconds. time 0 is jan 1, 1970 midnight (unix epoch)

// Get visible expenses
const getVisibleExpenses = (expenses, {text, sortBy, startDate, endDate}) => {
  return expenses.filter((expense) => {
    const startDateMatch = typeof startDate !== 'number' || expense.createdAt >= startDate
    const endDateMatch = typeof endDate !== 'number' || expense.createdAt <= endDate
    const textMatch = text === '' || expense.description.toLowerCase().includes(text.toLowerCase())

    return startDateMatch && endDateMatch && textMatch
  }).sort((a, b) => {
    if (sortBy === 'date') {
      return a.createdAt < b.createdAt ? 1 : -1
    } else if (sortBy === 'amount') {
      return a.amount < b.amount ? 1 : -1
    } 
  })
}

// Store creation

const store = createStore(
  combineReducers({
    expenses: expensesReducer,
    filters: filtersReducer
  })
)

// SUBSCRIPTION

store.subscribe(() => {
  const state = store.getState()
  const visibleExpenses = getVisibleExpenses(state.expenses, state.filters)
  console.log(visibleExpenses)
})

const expenseOne = store.dispatch(addExpense({ description: 'Rent', amount: 1000, createdAt: -1000}))
const expenseTwo = store.dispatch(addExpense({ description: 'Coffee', amount: 200, createdAt: 1000}))
const expenseThree = store.dispatch(addExpense({ description: 'Sizzurp', amount: 300, createdAt: 10000}))
// store.dispatch(removeExpense({ id: expenseOne.expense.id }))
// store.dispatch(removeExpense({ id: expenseThree.expense.id }))
// store.dispatch(editExpense(expenseTwo.expense.id, {amount: 500}))

// store.dispatch(setTextFilter())
store.dispatch(sortByAmount())
store.dispatch(sortByDate())

// store.dispatch(setStartDate(-1125))
// store.dispatch(setStartDate())  // set startDate to undefined
// store.dispatch(setEndDate(-999))
// store.dispatch(setEndDate()) // set endDate to undefined

const demoState = {
  expenses: [{
    id: 'abc123',
    description: 'January Rent',
    note: 'This is my rent for January 3000 AD',
    amount: 54500,
    createdAt: 0
  }],
  filters: { // for sorting data
    text: 'rent',
    sortBy: 'amount', // date or amount
    startDate: undefined,
    endDate: undefined
  }
}


const user = {
  name: 'Jen',
  age: 25
}

console.log({
  ...user,
  sex: 'female',
  age: 69
})