import { InvestmentData, CalculatedResults, SensitivityCell, ToggleableField } from './types';

// Helper to extract absolute value of a toggleable (R$ vs %) field
export function getAbsolute(field: ToggleableField, refValue: number): number {
  if (field.isPercent) {
    return refValue * (field.value / 100);
  }
  return field.value;
}

// Convert percentage to value
export function percentToValue(percent: number, refValue: number): number {
  return refValue * (percent / 100);
}

// Convert value to percentage
export function valueToPercent(value: number, refValue: number): number {
  if (refValue === 0) return 0;
  return (value / refValue) * 100;
}

/**
 * Calculates complete financial metrics for real estate auctions.
 */
export function calculateAuctionMetrics(data: InvestmentData): CalculatedResults {
  const {
    arrematacaoValue,
    saleValue,
    holdMonths,
    paymentMode,
    downPaymentPercent,
    installmentsCount,
    interestRateYear,
    dividaPropterRem,
    reformaMaoObra,
    reformaMaterial,
    outrosCustosAquisicao,
    taxMode,
    manualTaxOnSale,
    manualTaxMonthly,
    customPjRate,
    iptuMonthly,
    condominioMonthly,
    outrosMensais,
  } = data;

  // 1. Calculate Acquisition Costs (Custos na Aquisição)
  const comissaoVal = getAbsolute(data.comissaoLeiloeiro, arrematacaoValue);
  const itbiVal = getAbsolute(data.itbi, arrematacaoValue);
  const assessoriaAquisicaoVal = getAbsolute(data.assessoriaAquisicao, arrematacaoValue);
  const registroVal = getAbsolute(data.registro, arrematacaoValue);

  const totalAquisicao =
    comissaoVal +
    itbiVal +
    assessoriaAquisicaoVal +
    dividaPropterRem +
    registroVal +
    reformaMaoObra +
    reformaMaterial +
    outrosCustosAquisicao;

  // 2. Calculate Sales Costs (Custos na Venda)
  const corretorVal = getAbsolute(data.corretorVenda, saleValue);
  const assessoriaVendaVal = getAbsolute(data.assessoriaVenda, saleValue);

  const totalVenda = corretorVal + assessoriaVendaVal;

  // 3. Calculate Monthly Holding Costs (Custos Mensais)
  const totalMensal = iptuMonthly + condominioMonthly + outrosMensais;
  const totalMensalAcumulado = totalMensal * holdMonths;

  // 4. Financing/Installment calculations (SAC tables)
  let initialCashNeededForArrematacao = arrematacaoValue;
  let totalInstallmentsPaidInPeriod = 0;
  let jurosPagosNoPeriodo = 0;
  let amortizacaoPagaNoPeriodo = 0;
  let saldoDevedorFinal = 0;
  let valorParcelaInicial = 0;

  if (paymentMode !== 'À Vista' && installmentsCount > 0) {
    const downPayment = arrematacaoValue * (downPaymentPercent / 100);
    initialCashNeededForArrematacao = downPayment;

    const principalFinanced = arrematacaoValue - downPayment;
    const taxaMensal = Math.pow(1 + interestRateYear / 100, 1 / 12) - 1; // Monthly compound interest rate

    // In Brazil, SAC is the default for real estate
    const amortizationConst = principalFinanced / installmentsCount;
    let currentDebt = principalFinanced;

    for (let m = 1; m <= installmentsCount; m++) {
      const jurosM = currentDebt * taxaMensal;
      const amortM = amortizationConst;
      const parcelaM = amortM + jurosM;

      if (m === 1) {
        valorParcelaInicial = parcelaM;
      }

      if (m <= holdMonths) {
        totalInstallmentsPaidInPeriod += parcelaM;
        jurosPagosNoPeriodo += jurosM;
        amortizacaoPagaNoPeriodo += amortM;
      }

      currentDebt -= amortM;
    }

    saldoDevedorFinal = Math.max(0, principalFinanced - amortizacaoPagaNoPeriodo);
  }

  // 5. Calculate "Exposição de Caixa" (Cash Exposure)
  // Cash Exposure is the total capital the investor puts into the deal before receiving the sales price
  const exposicaoCaixa =
    initialCashNeededForArrematacao + // Upfront purchase price (either full arrematação or downpayment)
    totalAquisicao +                  // All acquisition costs
    totalVenda +                      // Sales costs (commission, etc. – though paid on transaction, counted in cash exposure as layout)
    totalMensalAcumulado +            // Cumulative monthly holding costs
    totalInstallmentsPaidInPeriod;    // Installment payments made during holding

  // 6. Tax calculations (Imposto de Renda)
  let custoAquisicaoParaIr = arrematacaoValue;
  let deducoesVendaParaIr = 0;
  let ganhoCapitalTributavel = 0;
  let impostoRendaVenda = 0;
  let impostoRendaMensalAcumulado = 0;

  if (taxMode === 'PF') {
    // Only green dots are deductible for capital gains under PF:
    // Deductible purchase costs: Arrematação, Comissão Leiloeiro, ITBI, Registro, Reformas
    custoAquisicaoParaIr =
      arrematacaoValue +
      comissaoVal +
      itbiVal +
      registroVal +
      reformaMaoObra +
      reformaMaterial;

    // Deductible sale costs: Broker fee (Corretor)
    deducoesVendaParaIr = corretorVal;

    // Capital Gain
    ganhoCapitalTributavel = Math.max(0, saleValue - custoAquisicaoParaIr - deducoesVendaParaIr);
    impostoRendaVenda = ganhoCapitalTributavel * 0.15; // Standard 15% rate
  } else if (taxMode === 'PJ') {
    // Lucro Presumido real estate tax (default 5.93% on sales price)
    impostoRendaVenda = saleValue * (customPjRate / 100);
  } else {
    // Manual
    impostoRendaVenda = manualTaxOnSale;
    impostoRendaMensalAcumulado = manualTaxMonthly * holdMonths;
  }

  const impostoRendaTotal = impostoRendaVenda + impostoRendaMensalAcumulado;

  // 7. Calculate "Custo Total" (Total Cost)
  // Custo Total = Outflow needed + Outstanding debt liquidation at resale + taxes
  const custoTotal = exposicaoCaixa + impostoRendaTotal + saldoDevedorFinal;

  // 8. Profit and ROI
  const lucroBruto = saleValue - (
    arrematacaoValue + 
    totalAquisicao + 
    totalVenda + 
    totalMensalAcumulado + 
    jurosPagosNoPeriodo
  );

  // Net Profit = Sales Price - Total costs incurred and taxes
  const lucroLiquido = saleValue - (exposicaoCaixa + impostoRendaTotal + saldoDevedorFinal - initialCashNeededForArrematacao) - initialCashNeededForArrematacao;
  // Let's simplify and make sure Net Profit is mathematically consistent:
  // Net Profit = saleValue - total spent - outstanding debt payoff at sale - taxes
  const calculatedLucroLiquido = saleValue - (
    initialCashNeededForArrematacao + 
    totalAquisicao + 
    totalVenda + 
    totalMensalAcumulado + 
    totalInstallmentsPaidInPeriod + 
    saldoDevedorFinal + 
    impostoRendaTotal
  );

  // ROI = Net Profit / Cash Exposure (desembolso real de caixa)
  const roiTotal = exposicaoCaixa > 0 ? calculatedLucroLiquido / exposicaoCaixa : 0;

  // Annualized ROI = (1 + ROI) ^ (12 / holdMonths) - 1
  const roiAnualizado = holdMonths > 0 ? Math.pow(1 + roiTotal, 12 / holdMonths) - 1 : roiTotal;

  // 9. Benchmarks Configuration (standard constants from Brazilian economy, customizable or fixed realistic)
  // CDI acts at ~13.75% per year, IBOVESPA at ~12.00%, IFIX at ~10.00%
  const benchmarkCdi = (13.75 / 100) * (holdMonths / 12);
  const benchmarkIbovespa = (12.00 / 100) * (holdMonths / 12);
  const benchmarkIfix = (10.00 / 100) * (holdMonths / 12);

  const diffCdi = roiTotal - benchmarkCdi;
  const diffIbovespa = roiTotal - benchmarkIbovespa;
  const diffIfix = roiTotal - benchmarkIfix;

  return {
    totalAquisicao,
    totalVenda,
    totalMensal,
    totalMensalAcumulado,
    exposicaoCaixa,
    custoTotal: initialCashNeededForArrematacao + totalAquisicao + totalVenda + totalMensalAcumulado + totalInstallmentsPaidInPeriod + impostoRendaTotal,
    valorParcelaInicial,
    jurosPagosNoPeriodo,
    amortizacaoPagaNoPeriodo,
    saldoDevedorFinal,
    custoAquisicaoParaIr,
    deducoesVendaParaIr,
    ganhoCapitalTributavel,
    impostoRendaVenda,
    impostoRendaMensalAcumulado,
    impostoRendaTotal,
    lucroBruto,
    lucroLiquido: calculatedLucroLiquido,
    roiTotal,
    roiAnualizado,
    benchmarkCdi,
    benchmarkIbovespa,
    benchmarkIfix,
    diffCdi,
    diffIbovespa,
    diffIfix,
  };
}

/**
 * Generates the sensitivity matrix based on variation of Arrematacao value (-30% to +30%)
 * and Sale value (-30% to +30%).
 */
export function generateSensitivityMatrix(data: InvestmentData): SensitivityCell[][] {
  const variations = [-0.30, -0.20, -0.10, 0, 0.10, 0.20, 0.30];
  const matrix: SensitivityCell[][] = [];

  for (const arrematacaoVar of variations) {
    const row: SensitivityCell[] = [];
    for (const saleVar of variations) {
      const variedArrematacao = data.arrematacaoValue * (1 + arrematacaoVar);
      const variedSale = data.saleValue * (1 + saleVar);

      // Create a copy of the payload with the varied values
      const variedData: InvestmentData = {
        ...data,
        arrematacaoValue: variedArrematacao,
        saleValue: variedSale,
      };

      const results = calculateAuctionMetrics(variedData);

      row.push({
        arrematacaoVar,
        saleVar,
        arrematacaoValue: variedArrematacao,
        saleValue: variedSale,
        lucroLiquido: results.lucroLiquido,
        roi: results.roiTotal,
      });
    }
    matrix.push(row);
  }

  return matrix;
}
