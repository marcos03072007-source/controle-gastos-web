'use client'

import { useState } from 'react'

interface Expense {
  id: string
  description: string
  amount: number
  category: string
  date: string
}

export default function Home() {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [description, setDescription] = useState('')
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState('Alimentação')

  const addExpense = () => {
    if (!description || !amount) return

    const newExpense: Expense = {
      id: Date.now().toString(),
      description,
      amount: parseFloat(amount),
      category,
      date: new Date().toLocaleDateString('pt-BR'),
    }

    setExpenses([...expenses, newExpense])
    setDescription('')
    setAmount('')
  }

  const deleteExpense = (id: string) => {
    setExpenses(expenses.filter((e) => e.id !== id))
  }

  const total = expenses.reduce((sum, e) => sum + e.amount, 0)

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>💰 Controle de Gastos</h1>

      <div style={{ marginBottom: '20px', padding: '20px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
        <input
          type="text"
          placeholder="Descrição"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={{ width: '100%', padding: '8px', marginBottom: '10px', borderRadius: '4px', border: '1px solid #ddd' }}
        />
        <input
          type="number"
          placeholder="Valor"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          style={{ width: '100%', padding: '8px', marginBottom: '10px', borderRadius: '4px', border: '1px solid #ddd' }}
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          style={{ width: '100%', padding: '8px', marginBottom: '10px', borderRadius: '4px', border: '1px solid #ddd' }}
        >
          <option>Alimentação</option>
          <option>Transporte</option>
          <option>Saúde</option>
          <option>Lazer</option>
          <option>Outros</option>
        </select>
        <button
          onClick={addExpense}
          style={{
            width: '100%',
            padding: '10px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Adicionar Despesa
        </button>
      </div>

      <div style={{ marginBottom: '20px', padding: '20px', backgroundColor: '#e8f5e9', borderRadius: '8px' }}>
        <h2>Total: R$ {total.toFixed(2)}</h2>
      </div>

      <div>
        <h2>Despesas</h2>
        {expenses.length === 0 ? (
          <p>Nenhuma despesa registrada</p>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {expenses.map((expense) => (
              <li
                key={expense.id}
                style={{
                  padding: '10px',
                  marginBottom: '10px',
                  backgroundColor: '#f9f9f9',
                  borderRadius: '4px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div>
                  <strong>{expense.description}</strong>
                  <br />
                  <small>
                    {expense.category} - {expense.date}
                  </small>
                </div>
                <div>
                  <strong style={{ marginRight: '10px' }}>R$ {expense.amount.toFixed(2)}</strong>
                  <button
                    onClick={() => deleteExpense(expense.id)}
                    style={{
                      padding: '5px 10px',
                      backgroundColor: '#dc3545',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                    }}
                  >
                    Deletar
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
