import React from 'react'
import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Dashboard } from './pages/Dashboard'
import { AddTransaction } from './pages/AddTransaction'
import { ErrorPage } from './pages/ErrorPage'
import { Header } from './components/Header'
import { TransactionContextProvider } from './context/TransactionContext'

function App() {
  return (
    <TransactionContextProvider>
      <BrowserRouter>
        <Header/>
        <main className="main-content">
          <Routes>
            <Route path='/' element={<Dashboard />}></Route>
            <Route path='/add' element={<AddTransaction />}></Route>
            <Route path='*' element={<ErrorPage />}></Route>
          </Routes>
        </main>
        <footer className="footer">
          Footer | Contact Us
        </footer>
      </BrowserRouter>
    </TransactionContextProvider>
  )
}

export default App
