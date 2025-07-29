import { defineStore } from 'pinia'
import { supabase } from '../../supabase'

export const useTransactionStore = defineStore('transactions', {
  state: () => ({
    items: [],
    loading: false,
  }),
  actions: {
    async fetchTransactions() {
      this.loading = true
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .order('date', { ascending: false })

      if (!error) this.items = data
      this.loading = false
    },

    async addTransaction(tx) {
      const { error } = await supabase.from('transactions').insert([tx])
      if (!error) await this.fetchTransactions()
    },

    async deleteTransaction(id) {
      await supabase.from('transactions').delete().eq('id', id)
      await this.fetchTransactions()
    },
    async updateTransactionAmount(id, newAmount) {
      const { error } = await supabase
        .from('transactions')
        .update({ amount: newAmount })
        .eq('id', id)
      if (error) console.error(error)
    }
  }
})
