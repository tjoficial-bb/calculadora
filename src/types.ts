export type PaymentMode = 'À Vista' | 'Financiado' | 'Parcelado';
export type TaxMode = 'PF' | 'PJ' | 'Manual';

export interface ToggleableField {
  value: number;       // The numeric value in currency (R$) or percentage (%)
  isPercent: boolean;  // True if user input is intended as a percentage, false if absolute value R$
}

export interface InvestmentData {
  // Informações do Imóvel
  propertyAddress: string;
  propertyLink: string;
  propertyImage: string; // URL or base64
  propertyCity: string;  // For map mockups

  // Premissas
  arrematacaoValue: number;
  saleValue: number;
  holdMonths: number;
  paymentMode: PaymentMode;

  // Detalhes de Financiamento / Parcelamento
  downPaymentPercent: number; // For Financiado / Parcelado, e.g. 25%
  installmentsCount: number;  // Number of installments
  interestRateYear: number;   // Interest rate per year (e.g. 12% for finance or IPCA adjustment)

  // Custos na Aquisição
  comissaoLeiloeiro: ToggleableField; // Ref: arrematacaoValue, deductible
  itbi: ToggleableField;              // Ref: arrematacaoValue, deductible
  assessoriaAquisicao: ToggleableField; // Ref: arrematacaoValue, non-deductible
  dividaPropterRem: number;           // Absolute, non-deductible
  registro: ToggleableField;          // Ref: arrematacaoValue (or absolute), deductible
  reformaMaoObra: number;             // Absolute, deductible
  reformaMaterial: number;            // Absolute, deductible
  outrosCustosAquisicao: number;      // Absolute, non-deductible

  // Custos na Venda
  corretorVenda: ToggleableField;     // Ref: saleValue, deductible
  assessoriaVenda: ToggleableField;   // Ref: saleValue, non-deductible

  // Imposto de Renda
  taxMode: TaxMode;
  manualTaxOnSale: number;     // For manual mode
  manualTaxMonthly: number;    // For manual mode
  customPjRate: number;        // e.g. 5.93% default

  // Custos Mensais
  iptuMonthly: number;
  condominioMonthly: number;
  outrosMensais: number;
}

export interface CalculatedResults {
  // Totais de Custos
  totalAquisicao: number;
  totalVenda: number;
  totalMensal: number; // R$/mês
  totalMensalAcumulado: number; // R$ total for hold period

  // Exposição de Caixa e Custo Total
  exposicaoCaixa: number; // Inicial / Desembolso Real (Entrada + Custos Aquisicao, etc.)
  custoTotal: number;     // Valor Compra + Todos os custos acumulados (incluindo parcelas pagas no periodo)
  
  // Detalhe de Parcelas (se aplicável)
  valorParcelaInicial: number;
  jurosPagosNoPeriodo: number;
  amortizacaoPagaNoPeriodo: number;
  saldoDevedorFinal: number;

  // Base de Cálculo de Imposto de Renda (dedutível)
  custoAquisicaoParaIr: number;
  deducoesVendaParaIr: number;
  ganhoCapitalTributavel: number;
  impostoRendaVenda: number;
  impostoRendaMensalAcumulado: number;
  impostoRendaTotal: number;

  // Resultados Operacionais
  lucroBruto: number;
  lucroLiquido: number;
  roiTotal: number;
  roiAnualizado: number;

  // Comparativos de Mercado (ROI vs Índices)
  benchmarkCdi: number;
  benchmarkIbovespa: number;
  benchmarkIfix: number;
  diffCdi: number;
  diffIbovespa: number;
  diffIfix: number;
}

export interface SensitivityCell {
  arrematacaoVar: number; // e.g. -0.10 for -10%
  saleVar: number;        // e.g. +0.10 for +10%
  arrematacaoValue: number;
  saleValue: number;
  lucroLiquido: number;
  roi: number;
}
