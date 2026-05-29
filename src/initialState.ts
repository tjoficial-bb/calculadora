import { InvestmentData } from './types';

export const INITIAL_INVESTMENT_DATA: InvestmentData = {
  // Informações do Imóvel
  propertyAddress: 'R. Augusta - Consolação, São Paulo - SP, Brasil',
  propertyLink: 'https://leilaodeimoveis.com.br/sp-augusta-38402',
  propertyImage: '', // Will default to a beautiful mock modern apartment illustration
  propertyCity: 'São Paulo',

  // Premissas
  arrematacaoValue: 200000,
  saleValue: 350000,
  holdMonths: 12,
  paymentMode: 'À Vista',

  // Detalhes Financiamento / Parcelamento
  downPaymentPercent: 25, // default downpayment
  installmentsCount: 24,  // default 24 months
  interestRateYear: 12.0, // 12% a.y.

  // Custos na Aquisição (percentages referencing arrematacaoValue)
  comissaoLeiloeiro: { value: 5, isPercent: true },
  itbi: { value: 3, isPercent: true },
  assessoriaAquisicao: { value: 5, isPercent: true },
  dividaPropterRem: 2000,
  registro: { value: 2000, isPercent: false },
  reformaMaoObra: 5000,
  reformaMaterial: 3000,
  outrosCustosAquisicao: 0,

  // Custos na Venda (percentages referencing saleValue)
  corretorVenda: { value: 5, isPercent: true },
  assessoriaVenda: { value: 5, isPercent: true },

  // Imposto de Renda
  taxMode: 'PF',
  manualTaxOnSale: 0,
  manualTaxMonthly: 0,
  customPjRate: 5.93, // default Brazilian trading PJ presumptive rate

  // Custos Mensais (hold expenses)
  iptuMonthly: 200,
  condominioMonthly: 300,
  outrosMensais: 0,
};
