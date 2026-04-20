'use client';

import { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface Expense {
  id: string;
  category: string;
  amount: number;
  date: string;
}

export default function Home() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState('');
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Carregar dados do localStorage
  useEffect(() => {
    const saved = localStorage.getItem('expenses');
    if (saved) {
      setExpenses(JSON.parse(saved));
    }
  }, []);

  // Salvar dados no localStorage
  useEffect(() => {
    localStorage.setItem('expenses', JSON.stringify(expenses));
  }, [expenses]);

  const addExpense = () => {
    if (!category || !amount) return;
    
    const newExpense: Expense = {
      id: Date.now().toString(),
      category,
      amount: parseFloat(amount),
      date: new Date().toISOString().split('T')[0],
    };
    
    setExpenses([...expenses, newExpense]);
    setCategory('');
    setAmount('');
  };

  const deleteExpense = (id: string) => {
    setExpenses(expenses.filter(e => e.id !== id));
  };

  // Filtrar despesas do mês atual
  const monthStr = currentMonth.toISOString().slice(0, 7);
  const monthExpenses = expenses.filter(e => e.date.startsWith(monthStr));

  // Agrupar por categoria
  const categoryData = monthExpenses.reduce((acc, exp) => {
    const existing = acc.find(item => item.name === exp.category);
    if (existing) {
      existing.value += exp.amount;
    } else {
      acc.push({ name: exp.category, value: exp.amount });
    }
    return acc;
  }, [] as Array<{ name: string; value: number }>);

  const total = monthExpenses.reduce((sum, exp) => sum + exp.amount, 0);

  const COLORS = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F'];

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">💰 Controle de Gastos</h1>
          <p className="text-slate-400">Gerencie suas despesas com facilidade</p>
        </div>

        {/* Input Section */}
        <div className="bg-slate-800 rounded-lg p-6 mb-8 shadow-lg">
          <h2 className="text-xl font-semibold text-white mb-4">Adicionar Despesa</h2>
          <div className="flex gap-4 flex-wrap">
            <input
              type="text"
              placeholder="Categoria (ex: Alimentação)"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="flex-1 min-w-[200px] px-4 py-2 bg-slate-700 text-white rounded border border-slate-600 focus:border-cyan-500 outline-none"
            />
            <input
              type="number"
              placeholder="Valor"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="flex-1 min-w-[150px] px-4 py-2 bg-slate-700 text-white rounded border border-slate-600 focus:border-cyan-500 outline-none"
            />
            <button
              onClick={addExpense}
              className="px-6 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded font-semibold transition"
            >
              Adicionar
            </button>
          </div>
        </div>

        {/* Month Navigation */}
        <div className="flex justify-between items-center mb-8">
          <button
            onClick={handlePrevMonth}
            className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded"
          >
            ← Mês Anterior
          </button>
          <h3 className="text-2xl font-bold text-white">
            {currentMonth.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
          </h3>
          <button
            onClick={handleNextMonth}
            className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded"
          >
            Próximo Mês →
          </button>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Pie Chart */}
          <div className="bg-slate-800 rounded-lg p-6 shadow-lg">
            <h3 className="text-xl font-semibold text-white mb-4">Distribuição por Categoria</h3>
            {categoryData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: R$ ${value.toFixed(2)}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `R$ ${value.toFixed(2)}`} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-slate-400 text-center py-12">Nenhuma despesa neste mês</p>
            )}
          </div>

          {/* Bar Chart */}
          <div className="bg-slate-800 rounded-lg p-6 shadow-lg">
            <h3 className="text-xl font-semibold text-white mb-4">Gastos por Categoria</h3>
            {categoryData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={categoryData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                  <XAxis dataKey="name" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}
                    formatter={(value) => `R$ ${value.toFixed(2)}`}
                  />
                  <Bar dataKey="value" fill="#06b6d4" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-slate-400 text-center py-12">Nenhuma despesa neste mês</p>
            )}
          </div>
        </div>

        {/* Total Section */}
        <div className="bg-gradient-to-r from-cyan-600 to-blue-600 rounded-lg p-6 mb-8 shadow-lg">
          <p className="text-slate-200">Total de Gastos</p>
          <h2 className="text-4xl font-bold text-white">R$ {total.toFixed(2)}</h2>
        </div>

        {/* Expenses Table */}
        <div className="bg-slate-800 rounded-lg p-6 shadow-lg">
          <h3 className="text-xl font-semibold text-white mb-4">Despesas do Mês</h3>
          {monthExpenses.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-700">
                    <th className="px-4 py-2 text-slate-300">Data</th>
                    <th className="px-4 py-2 text-slate-300">Categoria</th>
                    <th className="px-4 py-2 text-slate-300">Valor</th>
                    <th className="px-4 py-2 text-slate-300">Ação</th>
                  </tr>
                </thead>
                <tbody>
                  {monthExpenses.map((expense) => (
                    <tr key={expense.id} className="border-b border-slate-700 hover:bg-slate-700">
                      <td className="px-4 py-2 text-white">{new Date(expense.date).toLocaleDateString('pt-BR')}</td>
                      <td className="px-4 py-2 text-white">{expense.category}</td>
                      <td className="px-4 py-2 text-white">R$ {expense.amount.toFixed(2)}</td>
                      <td className="px-4 py-2">
                        <button
                          onClick={() => deleteExpense(expense.id)}
                          className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-sm"
                        >
                          Deletar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-slate-400 text-center py-8">Nenhuma despesa neste mês</p>
          )}
        </div>
      </div>
    </div>
  );
}
