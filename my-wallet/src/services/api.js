import { supabase } from '../../supabase'

export const fetchTransactions = async () => {
  const { data, error } = await supabase
    .from('transactions')
    .select('*')
  if (error) throw error
  return data
}

export const addTransaction = async (transaction) => {
  const { data, error } = await supabase
    .from('transactions')
    .insert(transaction)
  if (error) throw error
  return data
}

export const updateTransaction = async (id, updates) => {
  const { data, error } = await supabase
    .from('transactions')
    .update(updates)
    .eq('id', id)
  if (error) throw error
  return data
}

export const deleteTransaction = async (id) => {
  const { data, error } = await supabase
    .from('transactions')
    .delete()
    .eq('id', id)
  if (error) throw error
  return data
}
