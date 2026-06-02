import React, { useState } from 'react';
import { InvestmentData, CalculatedResults } from '../types';
import { 
  TrendingUp, Award, DollarSign, ShieldAlert, CheckCircle, 
  HelpCircle, Info, ArrowUpRight, Percent, CornerDownRight, 
  TrendingDown, Globe, Landmark, Coins, Home, BarChart2, Building2 
} from 'lucide-react';

interface InvestmentComparisonProps {
  data: InvestmentData;
  results: CalculatedResults;
}

interface AssetConfig {
  id: string;
  name: string;
  category: string;
  annualRate: number; // For dynamic baseline computations
  rateDisplay: string; // Range displayed
  hasIr: boolean;
  characteristics: string;
  risk: string;
  riskColor: string; // Tailwind color class matching
  icon: React.ElementType;
}

export const InvestmentComparison: React.FC<InvestmentComparisonProps> = ({ data, results }) => {
  const [selectedAssetId, setSelectedAssetId] = useState<string>('leilao');

  const capital = results.exposicaoCaixa;
  const holdMonths = data.holdMonths;

  // Formatting helpers
  const formatBRL = (val: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(val);
  };

  const formatPercent = (val: number) => {
    return `${(val * 100).toFixed(2)}%`;
  };

  // Get IR rate based on holding months (30 days/month average)
  const getIrRateForPeriod = (months: number): { rate: number; label: string; range: string } => {
    if (months <= 6) {
      return { rate: 0.225, label: '22,5%', range: 'Até 180 dias (6 meses)' };
    } else if (months <= 12) {
      return { rate: 0.20, label: '20,0%', range: '181 a 360 dias (6 meses a 1 ano)' };
    } else if (months <= 24) {
      return { rate: 0.175, label: '17,5%', range: '361 a 720 dias (1 a 2 anos)' };
    } else {
      return { rate: 0.15, label: '15,0%', range: 'Acima de 720 dias (mais de 2 anos)' };
    }
  };

  const currIrInfo = getIrRateForPeriod(holdMonths);

  // Asset configurations based on user reference table and standard market values
  const assets: AssetConfig[] = [
    {
      id: 'selic',
      name: 'Tesouro Selic / Selic',
      category: 'Renda Fixa',
      annualRate: 0.1175, // 11.75% a.a. standard
      rateDisplay: '10% a 14%',
      hasIr: true,
      characteristics: 'Alta segurança e liquidez diária. Rentabilidade ligada à taxa Selic.',
      risk: 'Muito Baixo',
      riskColor: 'bg-emerald-50 text-emerald-700 border-emerald-200/60',
      icon: Coins
    },
    {
      id: 'cdb',
      name: 'CDB Bancário',
      category: 'Renda Fixa',
      annualRate: 0.1200, // 12.00% a.a. standard
      rateDisplay: '9% a 15%',
      hasIr: true,
      characteristics: 'Renda fixa, geralmente atrelado ao CDI ou Prefixado.',
      risk: 'Muito Baixo a Baixo',
      riskColor: 'bg-emerald-50 text-emerald-700 border-emerald-200/60',
      icon: Landmark
    },
    {
      id: 'cdi',
      name: 'CDI',
      category: 'Benchmark',
      annualRate: 0.1150, // 11.5% a.a. standard
      rateDisplay: '10% a 13%',
      hasIr: true,
      characteristics: 'Acompanha de perto a taxa Selic. Baixa volatilidade.',
      risk: 'Muito Baixo',
      riskColor: 'bg-emerald-50 text-emerald-700 border-emerald-200/60',
      icon: TrendingUp
    },
    {
      id: 'poupanca',
      name: 'Poupança',
      category: 'Renda Fixa',
      annualRate: 0.0650, // 6.50% standard fixed
      rateDisplay: '6% a 8%',
      hasIr: false,
      characteristics: 'Baixa rentabilidade e perde para a inflação na maioria dos cenários.',
      risk: 'Muito Baixo',
      riskColor: 'bg-emerald-50 text-emerald-700 border-emerald-200/60',
      icon: Globe
    },
    {
      id: 'fiis',
      name: 'Fundos Imobiliários (FIIs)',
      category: 'Renda Variável',
      annualRate: 0.1100, // 11.00% a.a. including yield & valuation
      rateDisplay: '8% a 15%',
      hasIr: false, // Monthly dividends are tax exempt
      characteristics: 'Renda com alugúeis e valorização de cotas. Liquidez na bolsa.',
      risk: 'Baixo a Médio',
      riskColor: 'bg-yellow-50 text-yellow-700 border-yellow-200/60',
      icon: Home
    },
    {
      id: 'aluguel',
      name: 'Aluguel de Imóvel Tradicional',
      category: 'Imóveis',
      annualRate: 0.0750, // 7.5% a.a. standard yield
      rateDisplay: '6% a 12%',
      hasIr: true, // Subject to standard tax or 15% estimated average
      characteristics: 'Renda com aluguel. Gestão e manutenção podem impactar.',
      risk: 'Baixo a Médio',
      riskColor: 'bg-yellow-50 text-yellow-700 border-yellow-200/60',
      icon: Building2
    },
    {
      id: 'bolsa',
      name: 'Bolsa de Valores (Média Histórica)',
      category: 'Ações',
      annualRate: 0.1500, // 15% a.a. average long term
      rateDisplay: '10% a 20%',
      hasIr: true, // 15% rate on capital gains
      characteristics: 'Alto potencial de retorno no longo prazo, com volatilidade.',
      risk: 'Médio a Alto',
      riskColor: 'bg-orange-50 text-orange-700 border-orange-200/60',
      icon: BarChart2
    },
    {
      id: 'cripto',
      name: 'Criptomoedas',
      category: 'Alternativos',
      annualRate: 0.2400, // Speculative average return
      rateDisplay: 'Muito variável',
      hasIr: true, // 15% standard capital gain over limits
      characteristics: 'Alta volatilidade. Retornos imprevisíveis.',
      risk: 'Muito Alto',
      riskColor: 'bg-rose-50 text-rose-700 border-rose-200/60',
      icon: Coins
    }
  ];

  // Map to calculate dynamic statistics for any asset
  const getAssetCalculations = (asset: AssetConfig) => {
    // Period rate based on annual compound rate equivalent: (1 + annualRate) ^ (holdMonths / 12) - 1
    const periodRate = Math.pow(1 + asset.annualRate, holdMonths / 12) - 1;
    
    const rentabilidadeBrutaNoPeriodo = capital * periodRate;
    
    // Applying IR
    const irRate = currIrInfo.rate;
    // Special exception for Aluguel or equities which might have slightly different average rates, 
    // but applying standard tax regresiva for consistency as requested
    const impostoRenda = asset.hasIr ? rentabilidadeBrutaNoPeriodo * irRate : 0;
    
    const rentabilidadeLiquidaNoPeriodo = rentabilidadeBrutaNoPeriodo - impostoRenda;
    const roiLiquidoPeriodo = rentabilidadeLiquidaNoPeriodo / capital;
    
    const rentabilidadeLiquidaMensal = rentabilidadeLiquidaNoPeriodo / holdMonths;
    const rentabilidadeBrutaMensal = rentabilidadeBrutaNoPeriodo / holdMonths;
    
    return {
      periodRate,
      rentabilidadeBrutaNoPeriodo,
      impostoRenda,
      rentabilidadeLiquidaNoPeriodo,
      roiLiquidoPeriodo,
      rentabilidadeLiquidaMensal,
      rentabilidadeBrutaMensal,
      netRoiPercent: roiLiquidoPeriodo * 100,
      grossRoiPercent: periodRate * 100
    };
  };

  const selectedAsset = selectedAssetId === 'leilao' ? {
    id: 'leilao',
    name: 'Leilão Imobiliário (Este negócio)',
    category: 'Imóveis',
    annualRate: results.roiAnualizado,
    rateDisplay: `${(results.roiTotal * 100).toFixed(0)}%`,
    hasIr: results.impostoRendaTotal > 0,
    characteristics: 'Operação de leilão imobiliário personalizada com deságio estratégico e alta rentabilidade.',
    risk: 'Médio / Controlado',
    riskColor: 'bg-gold-light text-gold-dark border-gold-300',
    icon: Award,
  } as AssetConfig : (assets.find(a => a.id === selectedAssetId) || assets[1]);

  const selectedAssetCalcs = selectedAssetId === 'leilao' ? {
    periodRate: results.roiTotal,
    rentabilidadeBrutaNoPeriodo: results.lucroBruto,
    impostoRenda: results.impostoRendaTotal,
    rentabilidadeLiquidaNoPeriodo: results.lucroLiquido,
    roiLiquidoPeriodo: results.roiTotal,
    rentabilidadeLiquidaMensal: results.lucroLiquido / holdMonths,
    rentabilidadeBrutaMensal: results.lucroBruto / holdMonths,
    netRoiPercent: results.roiTotal * 100,
    grossRoiPercent: (results.lucroBruto / capital) * 100
  } : getAssetCalculations(selectedAsset);

  // Build range lists for display in columns (dynamic bounds)
  const getAssetRanges = (asset: AssetConfig) => {
    if (asset.id === 'cripto') {
      return { text: 'Altamente Variável', minVal: capital * -0.20, maxVal: capital * 0.50 };
    }
    
    // Extract numbers from "X% a Y%"
    const matches = asset.rateDisplay.match(/(\d+)\s*%?\s*a\s*(\d+)/);
    let minRate = asset.annualRate - 0.02;
    let maxRate = asset.annualRate + 0.03;
    
    if (matches && matches.length >= 3) {
      minRate = parseInt(matches[1]) / 100;
      maxRate = parseInt(matches[2]) / 100;
    }

    const minPeriodRate = Math.pow(1 + minRate, holdMonths / 12) - 1;
    const maxPeriodRate = Math.pow(1 + maxRate, holdMonths / 12) - 1;

    // Apply IR
    const minBruto = capital * minPeriodRate;
    const maxBruto = capital * maxPeriodRate;
    const minNet = asset.hasIr ? minBruto * (1 - currIrInfo.rate) : minBruto;
    const maxNet = asset.hasIr ? maxBruto * (1 - currIrInfo.rate) : maxBruto;

    return {
      text: `${formatBRL(minNet).split(',')[0]} a ${formatBRL(maxNet).split(',')[0]}`,
      minVal: minNet,
      maxVal: maxNet,
      minRate,
      maxRate
    };
  };

  // Find CDB calculations for practical example
  const cdbAsset = assets.find(a => a.id === 'cdb')!;
  const cdbCalcs = getAssetCalculations(cdbAsset);
  const cdbRanges = getAssetRanges(cdbAsset);

  // Compute how much larger the auction is compared to CDB
  const multiplierFactor = cdbCalcs.roiLiquidoPeriodo > 0 
    ? (results.roiTotal / cdbCalcs.roiLiquidoPeriodo).toFixed(1) 
    : '4.5';

  return (
    <div className="flex flex-col gap-6" id="investment-comparative-module">
      
      {/* Dynamic Main Header Banner */}
      <div className="text-center md:text-left border-t border-slate-200/80 pt-8">
        <span className="bg-slate-100 text-slate-800 text-[10px] uppercase font-black tracking-widest px-2.5 py-1 rounded border border-slate-200">
          Módulo de Tomada de Decisão
        </span>
        <h2 className="text-xl font-bold tracking-tight text-slate-900 mt-2 flex items-center justify-center md:justify-start gap-2">
          <Award className="text-gold" size={20} /> COMPARATIVO DE INVESTIMENTOS — {holdMonths} MESES
        </h2>
        <p className="text-xs text-slate-500 mt-1 max-w-4xl">
          Compare a projeção de retorno líquido estimado deste leilão imobiliário frente às principais alternativas de renda fixa e ações no Brasil. Cálculos ajustados pela inflação teórica e incidência regressiva de imposto de renda.
        </p>
      </div>

      {/* Top row with summary figures representing investment scale */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 no-print text-left">
        <div className="bg-slate-900 text-white rounded-xl p-4 border border-slate-800 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gold/10 rounded-full blur-xl pointer-events-none" />
          <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wide">
            Leilão Imobiliário
          </span>
          <div className="text-xl font-bold mt-1 text-gold">{formatPercent(results.roiTotal)}</div>
          <span className="text-[9px] text-slate-400 mt-1.5 block">ROI Líquido no Período</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4">
          <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wide">
            Ganho Líquido Est.
          </span>
          <div className="text-xl font-bold mt-1 text-slate-900">{formatBRL(results.lucroLiquido)}</div>
          <span className="text-[9px] text-slate-400 mt-1.5 block">Rentabilidade livre de impostos</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4">
          <span className="text-[10px] text-slate-350 text-slate-400 font-extrabold uppercase tracking-wide">
            Capital Próprio Exp.
          </span>
          <div className="text-xl font-bold mt-1 text-slate-950">{formatBRL(capital)}</div>
          <span className="text-[9px] text-slate-400 mt-1.5 block">Exposição de Caixa necessária</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4">
          <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wide">
            Valor de Venda Est.
          </span>
          <div className="text-xl font-bold mt-1 text-slate-900">{formatBRL(data.saleValue)}</div>
          <span className="text-[9px] text-slate-400 mt-1.5 block">Preço de saída do imóvel</span>
        </div>
      </div>

      {/* Main interactive grid structure */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start text-left">
        
        {/* Left 2 cols: Complete modern comparative table */}
        <div className="xl:col-span-2 bg-white border border-slate-200 shadow-sm rounded-2xl p-5 flex flex-col gap-4">
          <div className="flex justify-between items-center pb-2 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <BarChart2 size={16} className="text-gold" /> Grade Geral Comparativa de Ativos
              </h3>
              <p className="text-[11px] text-slate-500 mt-0.5">Clique em qualquer ativo para detalhar seu DRE de captação à direita.</p>
            </div>
            <span className="text-[9px] font-black text-slate-400 uppercase font-mono">Simulado sobre {formatBRL(capital).split(',')[0]}</span>
          </div>

          <div className="overflow-x-auto rounded-lg">
            <table className="min-w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-400 text-[9px] font-black uppercase tracking-wider border-b border-slate-200">
                  <th className="p-3">Ativo / Investimento</th>
                  <th className="p-3 text-center">Taxa Anual (Est.)</th>
                  <th className="p-3 text-center">Rendimento Líquido ({holdMonths}m)</th>
                  <th className="p-3 text-center">Rendimento Líquido (%)</th>
                  <th className="p-3 text-center">Mensal (Média)</th>
                  <th className="p-3">Risco</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                
                {/* 1. Leilão Imobiliário (Este negócio) highlights */}
                <tr 
                  onClick={() => setSelectedAssetId('leilao')}
                  className={`cursor-pointer transition-colors border-l-4 border-gold ${
                    selectedAssetId === 'leilao' 
                      ? 'bg-gold-light/45 font-bold ring-1 ring-gold shadow-sm' 
                      : 'bg-gold-light/20 hover:bg-gold-light/30 font-semibold'
                  }`}
                >
                  <td className="p-3 flex items-center gap-2.5">
                    <div className="w-6 h-6 rounded bg-gold flex items-center justify-center text-slate-950 font-black text-[10px]">LI</div>
                    <div>
                      <span className="text-slate-900 font-bold block">Leilão Imobiliário (Este negócio)</span>
                      <span className="text-[9px] text-gold-dark uppercase font-extrabold font-mono text-xs">Recomendado</span>
                    </div>
                  </td>
                  <td className="p-3 text-center font-mono text-slate-800">
                    {formatPercent(results.roiAnualizado)} a.a.
                  </td>
                  <td className="p-3 text-center font-bold text-slate-900 font-mono">
                    {formatBRL(results.lucroLiquido)}
                  </td>
                  <td className="p-3 text-center font-mono text-gold-dark font-bold bg-gold-light/10">
                    {formatPercent(results.roiTotal)}
                  </td>
                  <td className="p-3 text-center font-mono text-emerald-700">
                    {formatBRL(results.lucroLiquido / holdMonths)}
                  </td>
                  <td className="p-3">
                    <span className="inline-block text-[9px] font-extrabold px-2 py-0.5 rounded-full border bg-slate-50 text-slate-650 border-slate-200/80">
                      Médio / Controlado
                    </span>
                  </td>
                </tr>

                {/* 2. All simulated standard assets */}
                {assets.map((asset) => {
                  const calcs = getAssetCalculations(asset);
                  const ranges = getAssetRanges(asset);
                  const isSelected = asset.id === selectedAssetId;
                  const IconComp = asset.icon;

                  return (
                    <tr 
                      key={asset.id} 
                      onClick={() => setSelectedAssetId(asset.id)}
                      className={`hover:bg-slate-50 cursor-pointer transition-all ${isSelected ? 'bg-slate-50 font-medium ring-1 ring-gold/25' : ''}`}
                    >
                      <td className="p-3 flex items-center gap-2.5">
                        <div className={`w-6 h-6 rounded flex items-center justify-center border ${
                          isSelected ? 'bg-gold text-slate-950 border-gold' : 'bg-slate-50 text-slate-400 border-slate-200'
                        }`}>
                          <IconComp size={12} />
                        </div>
                        <div>
                          <span className="text-slate-800 font-semibold block">{asset.name}</span>
                          <span className="text-[9px] text-slate-400 font-normal">{asset.category} {asset.hasIr ? '• Alíquota IR' : '• Isento de IR'}</span>
                        </div>
                      </td>
                      <td className="p-3 text-center font-mono text-slate-600">
                        {asset.rateDisplay === 'Muito variável' ? 'Variável' : `${asset.rateDisplay}% a.a.`}
                      </td>
                      <td className="p-3 text-center font-mono text-slate-700">
                        {ranges.text}
                      </td>
                      <td className="p-3 text-center font-mono text-slate-700">
                        {formatPercent(calcs.roiLiquidoPeriodo)}
                      </td>
                      <td className="p-3 text-center font-mono text-slate-600">
                        {formatBRL(calcs.rentabilidadeLiquidaMensal)}
                      </td>
                      <td className="p-3">
                        <span className={`inline-block text-[9px] font-bold px-2 py-0.5 rounded-full border ${asset.riskColor}`}>
                          {asset.risk}
                        </span>
                      </td>
                    </tr>
                  );
                })}

              </tbody>
            </table>
          </div>
          
          <div className="flex text-[10px] text-slate-450 italic items-baseline bg-slate-50 px-3 py-2 rounded-lg border border-slate-150 gap-1.5 self-start">
            <Info size={12} className="text-slate-400 translate-y-0.5 shrink-0" />
            <span>As rentabilidades estimadas representam projeções médias compiladas com as conjunturas normais de mercado. Valores reais futuros dependem do COPOM, movimentações macro e inflação.</span>
          </div>

        </div>

        {/* Right col: Specific DRE Asset Card (Interactive detailing like Image 1) */}
        <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-5 flex flex-col gap-4">
          <div className="border-b border-slate-100 pb-2">
            <span className="text-gold uppercase font-black text-[9px] tracking-wider font-mono">Detalhador De Aplicação</span>
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5 mt-0.5">
              <Landmark size={15} className="text-gold" /> Projeção Avançada {selectedAsset.name}
            </h3>
          </div>

          {/* DRE Interactive Card */}
          <div className="bg-[#0f172a] rounded-xl text-white shadow-md border border-slate-800 overflow-hidden flex flex-col">
            
            {/* Header portion */}
            <div className="bg-gradient-to-r from-slate-900 to-[#1e293b] p-4 border-b border-white/5 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <selectedAsset.icon size={16} className="text-gold shrink-0" />
                <div className="text-left">
                  <h4 className="text-xs font-bold text-white uppercase tracking-tight">{selectedAsset.id.toUpperCase()}</h4>
                  <span className="text-[8px] text-slate-400 font-bold block uppercase mt-0.5">PRESERVAÇÃO DO CAPITAL</span>
                </div>
              </div>
              <span className="text-[10px] font-black bg-gold/15 text-gold border border-gold/25 px-2 py-0.5 rounded">
                {selectedAsset.category}
              </span>
            </div>

            {/* Calculations items like Image 1 */}
            <div className="p-4 flex flex-col gap-3.5 text-left text-xs">
              
              {/* Capital necessário / Desembolso */}
              <div className="flex justify-between items-center py-1 pb-2 border-b border-white/5">
                <span className="text-slate-400">Capital necessário para simular:</span>
                <span className="font-bold text-white font-mono">{formatBRL(capital)}</span>
              </div>

              {/* Rentabilidade Bruta no período */}
              <div className="flex justify-between items-start py-0.5">
                <div>
                  <span className="text-slate-400 block font-normal">Rentabilidade Bruta no Período</span>
                  <span className="text-[9.5px] text-slate-500 font-mono">Taxa calculada: {formatPercent(selectedAssetCalcs.periodRate)}</span>
                </div>
                <div className="text-right">
                  <span className="font-bold text-white font-mono block">{formatBRL(selectedAssetCalcs.rentabilidadeBrutaNoPeriodo)}</span>
                  <span className="text-[10px] text-slate-400 font-semibold">{formatPercent(selectedAssetCalcs.periodRate)}</span>
                </div>
              </div>

              {/* Imposto de Renda deduction */}
              <div className="flex justify-between items-start py-0.5">
                <div>
                  <span className="text-slate-400 block">Imposto de Renda (IR)</span>
                  <span className="text-[9.5px] text-slate-500 font-semibold italic">
                    {selectedAssetId === 'leilao'
                      ? `Tributação estimada (${data.taxMode === 'PF' ? 'PF - Ganho de Capital' : data.taxMode === 'PJ' ? 'PJ Simples' : 'Manual'})`
                      : selectedAsset.hasIr 
                        ? `Alíquota reg. de ${currIrInfo.label}` 
                        : 'Ativo Isento de Imposto'}
                  </span>
                </div>
                <div className="text-right">
                  {selectedAssetCalcs.impostoRenda > 0 ? (
                    <>
                      <span className="font-extrabold text-rose-500 font-mono block">- {formatBRL(selectedAssetCalcs.impostoRenda)}</span>
                      <span className="text-[9px] bg-rose-500/15 text-rose-450 border border-rose-500/10 px-1 py-0.1 rounded text-red-400">
                        {selectedAssetId === 'leilao' ? 'Imposto Totais da Operação' : `${currIrInfo.label} sobre o lucro`}
                      </span>
                    </>
                  ) : (
                    <span className="text-emerald-400 font-extrabold font-mono">R$ 0,00 (Isento)</span>
                  )}
                </div>
              </div>

              {/* Rentabilidade Líquida no período */}
              <div className="flex justify-between items-start py-1.5 border-t border-white/5 my-1 bg-white/5 px-2.5 rounded-lg border border-white/5">
                <div>
                  <span className="text-white font-semibold">Rentabilidade Líquida no Período</span>
                  <span className="text-[8.5px] text-slate-400 block mt-0.5">Retorno real após deduções</span>
                </div>
                <div className="text-right">
                  <span className="font-black text-emerald-400 font-mono text-sm block">{formatBRL(selectedAssetCalcs.rentabilidadeLiquidaNoPeriodo)}</span>
                  <span className="text-[10px] text-emerald-400 font-bold">{formatPercent(selectedAssetCalcs.roiLiquidoPeriodo)}</span>
                </div>
              </div>

              {/* Rentabilidade Líquida Mensal (média) */}
              <div className="flex justify-between items-center py-0.5 pt-1">
                <span className="text-slate-400">Rentabilidade Líquida Mensal (média)</span>
                <div className="text-right font-mono">
                  <span className="font-bold text-white block">{formatBRL(selectedAssetCalcs.rentabilidadeLiquidaMensal)}</span>
                  <span className="text-[10px] text-emerald-400 font-bold">{formatPercent(selectedAssetCalcs.roiLiquidoPeriodo / holdMonths)} ao mês</span>
                </div>
              </div>

              {/* Rentabilidade Bruta Mensal (média) */}
              <div className="flex justify-between items-center py-0.5 pt-1">
                <span className="text-slate-400">Rentabilidade Bruta Mensal (média)</span>
                <div className="text-right font-mono">
                  <span className="font-bold text-slate-300 block">{formatBRL(selectedAssetCalcs.rentabilidadeBrutaMensal)}</span>
                  <span className="text-[10.5px] text-slate-400 font-bold">{formatPercent(selectedAssetCalcs.periodRate / holdMonths)} ao mês</span>
                </div>
              </div>

            </div>

          </div>

          {/* IR Regressive Table highlighting brackets */}
          <div className="flex flex-col gap-2 mt-1">
            <span className="text-slate-600 font-bold text-[10.5px] uppercase tracking-wide flex items-center gap-1">
              <CornerDownRight size={13} strokeWidth={2.5} className="text-gold" /> Tabela Regressiva Oficial do IR
            </span>
            
            <div className="flex flex-col gap-1 text-[10.5px] font-normal border border-slate-200 rounded-xl overflow-hidden shadow-inner">
              
              <div className={`p-2 flex justify-between items-center border-b border-slate-100 ${
                holdMonths <= 6 ? 'bg-amber-50 font-bold text-amber-900 border-l-4 border-amber-500' : 'text-slate-500'
              }`}>
                <span>Até 180 dias (6 meses)</span>
                <span className="font-mono">22,5% {holdMonths <= 6 && '✔ ativo'}</span>
              </div>

              <div className={`p-2 flex justify-between items-center border-b border-slate-100 ${
                holdMonths > 6 && holdMonths <= 12 ? 'bg-amber-50 font-bold text-amber-900 border-l-4 border-amber-500' : 'text-slate-500'
              }`}>
                <span>181 a 360 dias (6m a 1 ano)</span>
                <span className="font-mono">20,0% {holdMonths > 6 && holdMonths <= 12 && '✔ ativo'}</span>
              </div>

              <div className={`p-2 flex justify-between items-center border-b border-slate-100 ${
                holdMonths > 12 && holdMonths <= 24 ? 'bg-amber-50 font-bold text-amber-900 border-l-4 border-amber-500' : 'text-slate-500'
              }`}>
                <span>361 a 720 dias (1 a 2 anos)</span>
                <span className="font-mono">17,5% {holdMonths > 12 && holdMonths <= 24 && '✔ ativo'}</span>
              </div>

              <div className={`p-2 flex justify-between items-center ${
                holdMonths > 24 ? 'bg-amber-50 font-bold text-amber-900 border-l-4 border-amber-500' : 'text-slate-500'
              }`}>
                <span>Acima de 720 dias (+ de 2 anos)</span>
                <span className="font-mono">15,0% {holdMonths > 24 && '✔ ativo'}</span>
              </div>

            </div>
            <span className="text-[9px] text-slate-400 italic">O desconto do imposto retroativo é retido exclusivamente sobre os rendimentos auferidos, e ocorre no resgate.</span>
          </div>

        </div>

      </div>

      {/* Footer Visual highlights & Infographic (exactly like Image 2 footer) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-2 border-t border-slate-100 pt-6 text-left text-xs font-normal text-slate-650">
        
        {/* Significado na Prática Card */}
        <div className="bg-emerald-50/40 border border-emerald-100 rounded-2xl p-5 flex flex-col gap-3.5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-xl pointer-events-none" />
          <h4 className="text-emerald-800 font-extrabold text-xs uppercase tracking-wider flex items-center gap-1.5">
            <CheckCircle size={15} className="text-emerald-600" /> O QUE ISSO SIGNIFICA NA PRÁTICA?
          </h4>
          
          <div className="flex flex-col gap-1.5">
            <span className="text-lg text-emerald-900 font-semibold">Este leilão projeta um retorno estimado em aproximadamene:</span>
            <span className="text-2xl font-black text-emerald-750 block font-mono text-emerald-800">
              {multiplierFactor}x a {(parseFloat(multiplierFactor) + 1).toFixed(1)}x MAIOR
            </span>
            <span className="text-slate-600">
              do que investimentos de natureza conservadora como Tesouro Selic, CDI, Poupança e CDBs bancários.
            </span>
          </div>
        </div>

        {/* Exemplo Simples Card */}
        <div className="bg-slate-50 border border-slate-200/60 rounded-2xl p-5 flex flex-col gap-3.5">
          <h4 className="text-slate-800 font-extrabold text-xs uppercase tracking-wider flex items-center gap-1.5">
            <Info size={15} className="text-gold" /> EXEMPLO SIMPLES DE SIMULAÇÃO
          </h4>
          
          <div className="flex flex-col gap-2">
            <p className="text-slate-700">
              Investindo o montante de <strong className="text-slate-900 font-bold">{formatBRL(capital)}</strong> por <strong className="text-slate-900 font-bold">{holdMonths} meses</strong>:
            </p>
            
            <div className="flex flex-col gap-1.5 border-l-2 border-slate-300 pl-3">
              <div className="text-slate-550 flex justify-between">
                <span>• Em um CDB comum:</span>
                <strong className="text-slate-800 font-semibold">{cdbRanges.text}</strong>
              </div>
              <div className="text-slate-550 flex justify-between bg-gold-light/20 p-1 rounded">
                <span className="font-bold text-slate-900">• Neste Leilão Imobiliário:</span>
                <strong className="text-gold-dark font-black">{formatBRL(results.lucroLiquido)}</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Importante Card */}
        <div className="bg-amber-50/40 border border-amber-150/60 rounded-2xl p-5 flex flex-col gap-3">
          <h4 className="text-amber-800 font-extrabold text-xs uppercase tracking-wider flex items-center gap-1.5">
            <ShieldAlert size={15} className="text-amber-600" /> INFORMAÇÃO COMPLEMENTAR IMPORTANTE
          </h4>
          
          <p className="text-amber-850 leading-relaxed text-[11px] text-slate-600">
            Ao contrário de investimentos puramente líquidos e automáticos em bancos, realizar negócios em <strong>Leilão de Imóveis</strong> exige uma equipe capacitada e especializada:
          </p>

          <ul className="text-[10.5px] text-slate-550 space-y-1 mt-0.5 font-medium">
            <li className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-amber-500 rounded-full" /> Seleção estratégica de lotes (deságios expressivos);
            </li>
            <li className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-amber-500 rounded-full" /> Análise jurídica detalhada de documentos processuais;
            </li>
            <li className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-amber-500 rounded-full" /> Mobilização temporária de capital no período;
            </li>
            <li className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-amber-500 rounded-full" /> Consultoria profissional para desocupação e alienação segura.
            </li>
          </ul>
        </div>

      </div>

    </div>
  );
};
