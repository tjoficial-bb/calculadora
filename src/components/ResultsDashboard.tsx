import React, { useState, useEffect } from 'react';
import { CalculatedResults, InvestmentData } from '../types';
import { generateSensitivityMatrix } from '../utils';
import { InvestmentComparison } from './InvestmentComparison';
import { 
  ResponsiveContainer, PieChart, Pie, Cell, 
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid 
} from 'recharts';
import { 
  TrendingUp, ArrowUpRight, DollarSign, Award, Percent, 
  Info, FileSpreadsheet, Share2, Printer, Layers, ClipboardCheck 
} from 'lucide-react';

interface ResultsDashboardProps {
  data: InvestmentData;
  results: CalculatedResults;
}

export const ResultsDashboard: React.FC<ResultsDashboardProps> = ({ data, results }) => {
  const [mounted, setMounted] = useState(false);
  const [copied, setCopied] = useState(false);
  const [hoveredCell, setHoveredCell] = useState<{
    arrematacaoVar: number;
    saleVar: number;
    arrematacaoValue: number;
    saleValue: number;
    lucroLiquido: number;
    roi: number;
  } | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const formatBRL = (val: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(val);
  };

  const formatPercent = (val: number) => {
    return `${(val * 100).toFixed(2)}%`;
  };

  // 1. Matrix Sensitivity
  const sensitivityMatrix = generateSensitivityMatrix(data);

  // Helper for matrix cell background coloring based on ROI
  const getCellBgColor = (roi: number) => {
    if (roi < 0) return 'bg-red-100 text-red-850 border border-red-205';
    if (roi <= 0.10) return 'bg-orange-100 text-orange-850 border border-orange-205';
    if (roi <= 0.25) return 'bg-yellow-100 text-yellow-850 border border-yellow-205';
    if (roi <= 0.50) return 'bg-lime-100 text-lime-850 border border-lime-205';
    if (roi <= 1.00) return 'bg-gold-light text-gold-dark border border-gold/30';
    return 'bg-gold text-slate-900 border border-gold font-bold';
  };

  // Summary stats for sensitivity
  const allSensitivityCells = sensitivityMatrix.flat();
  const minRoi = Math.min(...allSensitivityCells.map(c => c.roi));
  const maxRoi = Math.max(...allSensitivityCells.map(c => c.roi));
  const positiveScenarios = allSensitivityCells.filter(c => c.roi > 0).length;

  // 2. Data for Investment Composition Pie Chart
  const pieData = [
    { name: 'Arremata. / Entrada', value: data.paymentMode === 'À Vista' ? data.arrematacaoValue : data.arrematacaoValue * (data.downPaymentPercent / 100) },
    { name: 'Custos de Aquisição', value: results.totalAquisicao },
    { name: 'Custos de Venda', value: results.totalVenda },
    { name: 'Custos Recorrentes', value: results.totalMensalAcumulado + results.jurosPagosNoPeriodo },
  ].filter(item => item.value > 0);

  const PIE_COLORS = ['#c5a059', '#1e293b', '#b48e48', '#64748b'];

  // 3. Data for Cash Exposure vs Total cost
  const exposureData = [
    {
      name: 'Valores',
      'Exposição de Caixa': Math.round(results.exposicaoCaixa),
      'Custo Total': Math.round(results.custoTotal),
    }
  ];

  // 4. Data for Detailed Costs List Bar Chart
  const assetComissao = data.arrematacaoValue * ((data.comissaoLeiloeiro.isPercent ? data.comissaoLeiloeiro.value : (data.comissaoLeiloeiro.value / data.arrematacaoValue) * 100) / 100);
  const assetITBI = data.arrematacaoValue * ((data.itbi.isPercent ? data.itbi.value : (data.itbi.value / data.arrematacaoValue) * 100) / 100);
  const assetAssessoria = data.arrematacaoValue * ((data.assessoriaAquisicao.isPercent ? data.assessoriaAquisicao.value : (data.assessoriaAquisicao.value / data.arrematacaoValue) * 100) / 100);
  const assetRegistro = data.registro.isPercent ? data.arrematacaoValue * (data.registro.value / 100) : data.registro.value;

  const costDetailsData = [
    { name: 'Comissão', valor: assetComissao },
    { name: 'ITBI', valor: assetITBI },
    { name: 'Assessoria Aquisi.', valor: assetAssessoria },
    { name: 'Reg./Escritura', valor: assetRegistro },
    { name: 'Mão de Obra', valor: data.reformaMaoObra },
    { name: 'Mat. Reforma', valor: data.reformaMaterial },
    { name: 'Corretor Venda', valor: data.saleValue * ((data.corretorVenda.isPercent ? data.corretorVenda.value : (data.corretorVenda.value / data.saleValue) * 100) / 100) },
    { name: 'Assessoria Vend.', valor: data.saleValue * ((data.assessoriaVenda.isPercent ? data.assessoriaVenda.value : (data.assessoriaVenda.value / data.saleValue) * 100) / 100) },
    { name: 'Propter Rem', valor: data.dividaPropterRem },
    { name: 'IPTU + Cond.', valor: results.totalMensalAcumulado },
  ].filter(cost => cost.valor > 0);

  // 5. Operation flow breakdown charts
  const opBarData = [
    { name: 'Preço Venda', valor: Math.round(data.saleValue), fill: '#1e293b' },
    { name: 'Expos. Caixa', valor: Math.round(results.exposicaoCaixa), fill: '#c5a059' },
    { name: 'Custo Total', valor: Math.round(results.custoTotal), fill: '#475569' },
    { name: 'lucro Bruto', valor: Math.round(results.lucroBruto), fill: '#b48e48' },
    { name: 'Imposto (IR)', valor: Math.round(results.impostoRendaTotal), fill: '#b91c1c' },
    { name: 'Lucro Líquido', valor: Math.round(results.lucroLiquido), fill: '#8c6d32' },
  ];

  return (
    <div className="flex flex-col gap-6" id="calc-results-section">
      {/* 1. Header Banner */}
      <div className="bg-slate-900 rounded-xl p-6 text-white text-left relative overflow-hidden shadow-xl border border-slate-805/40">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gold/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-gold/5 rounded-full blur-2xl -ml-20 -mb-20 pointer-events-none" />

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 z-10 relative">
          <div>
            <span className="bg-gold/25 text-gold text-[10px] uppercase font-black tracking-wider px-2.5 py-1 rounded border border-gold/30">
              Resultado da Operação {data.paymentMode}
            </span>
            <h2 className="text-xl font-bold tracking-tight text-white mt-2">DRE e Indicadores de Desempenho</h2>
            <p className="text-xs text-slate-400 mt-1">Análise financeira considerando a revenda estimada em {data.holdMonths} meses para o leilão.</p>
          </div>

          <div className="flex gap-2 w-full md:w-auto">
            <button 
              onClick={() => window.print()}
              className="flex-1 md:flex-none flex items-center justify-center gap-1.5 bg-slate-800 hover:bg-slate-755 text-white text-xs font-semibold px-3 py-2 rounded border border-slate-700 transition cursor-pointer"
            >
              <Printer size={14} className="text-gold" /> Imprimir PDF
            </button>
            <button 
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              }}
              className="flex-1 md:flex-none flex items-center justify-center gap-1.5 bg-slate-800 hover:bg-slate-755 text-white text-xs font-semibold px-3 py-2 rounded border border-slate-700 transition cursor-pointer min-w-[125px]"
            >
              <Share2 size={14} className={copied ? "text-gold animate-bounce" : "text-gold"} /> 
              <span>{copied ? "Link Copiado!" : "Compartilhar"}</span>
            </button>
          </div>
        </div>

        {/* Major KPIs block */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="bg-white/5 backdrop-blur-md rounded-xl p-4 border border-white/10 text-left transition-all hover:bg-white/10">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
              Exposição de Caixa
            </span>
            <div className="text-2xl font-bold mt-1 text-white">{formatBRL(results.exposicaoCaixa)}</div>
            <div className="text-[10px] text-slate-400 mt-1.5 italic">Capital inicial total desembolsado pelo investidor no negócio.</div>
          </div>

          <div className="bg-white/5 backdrop-blur-md rounded-xl p-4 border border-white/10 text-left transition-all hover:bg-white/10">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-gold" />
              Lucro Líquido Real
            </span>
            <div className="text-2xl font-bold mt-1 text-gold">{formatBRL(results.lucroLiquido)}</div>
            <div className="text-[10px] text-slate-400 mt-1.5 italic">Retorno livre de todos os impostos (IR), taxas e parcelas.</div>
          </div>

          <div className="bg-white/5 backdrop-blur-md rounded-xl p-4 border border-white/10 text-left transition-all hover:bg-white/10">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              Retorno sobre Caixa (ROI)
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <div className="text-2xl font-bold text-gold">{formatPercent(results.roiTotal)}</div>
              {results.roiAnualizado !== results.roiTotal && (
                <div className="text-xs text-slate-400 font-medium">({formatPercent(results.roiAnualizado)} a.a.)</div>
              )}
            </div>
            <div className="text-[10px] text-slate-400 mt-1.5 italic">Rentabilidade para o período de {data.holdMonths} meses.</div>
          </div>
        </div>
      </div>

      {/* 2. Main Metrics comparison and charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Composition Block */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-sm text-left">
          <div className="flex justify-between items-center mb-4 pb-2 border-b border-slate-100">
            <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
              <Layers size={16} className="text-gold" /> Composição do Investimento
            </h3>
            <span className="text-[10px] font-bold text-slate-400 uppercase">Proporção dos Gastos</span>
          </div>
          
          <div className="h-56 mt-2 relative">
            {mounted && (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="45%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: any) => formatBRL(Number(value))} />
                  <Legend 
                    layout="horizontal" 
                    verticalAlign="bottom" 
                    align="center"
                    iconType="circle"
                    iconSize={8}
                    wrapperStyle={{ fontSize: '10px', paddingTop: '10px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Cost vs Exposure Stacked Bar */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-sm text-left">
          <div className="flex justify-between items-center mb-4 pb-2 border-b border-slate-100">
            <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
              <DollarSign size={16} className="text-gold" /> Desdobramento do Custo Real
            </h3>
            <span className="text-[10px] font-bold text-slate-400">Exposição vs Custo Total</span>
          </div>

          <p className="text-xs text-slate-500 mb-4 font-normal">
            A <strong>Exposição de Caixa</strong> é o seu desembolso líquido inicial estruturado. O <strong>Custo Total</strong> representa as saídas somadas ao imposto de renda e saldos devedores liquidados no fechamento.
          </p>

          <div className="h-44 mt-2">
            {mounted && (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={exposureData} layout="vertical" margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                  <XAxis type="number" tickFormatter={(v) => `R$ ${(v / 1000).toFixed(0)}k`} textAnchor="middle" style={{ fontSize: '10px' }} />
                  <YAxis type="category" dataKey="name" hide />
                  <Tooltip formatter={(value: any) => formatBRL(Number(value))} />
                  <Legend verticalAlign="top" height={32} iconSize={10} style={{ fontSize: '11px' }} />
                  <Bar dataKey="Exposição de Caixa" fill="#c5a059" barSize={34} radius={[0, 4, 4, 0]} />
                  <Bar dataKey="Custo Total" fill="#1e293b" barSize={34} radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

      </div>

      {/* 3. Sensitivity Heatmap Analysis 7x7 */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-sm text-left">
        <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2 mb-1">
          <TrendingUp size={16} className="text-gold" /> Matriz de Análise de Sensibilidade
        </h3>
        <p className="text-xs text-slate-500 mb-4 flex flex-wrap justify-between items-center gap-2">
          <span>
            Variação simulada de <strong>-30% a +30%</strong> no preço de arrematação (linhas) versus o preço final de revenda (colunas). O valor em destaque representa o ROI líquido correspondente em cada faixa de operação.
          </span>
          <span className="text-[9px] bg-gold-light/60 border border-gold/10 text-gold-dark px-2 py-0.5 rounded font-extrabold uppercase tracking-wide inline-block sm:hidden animate-pulse">
            ← Deslize para ver a tabela completa →
          </span>
        </p>

        {/* Heatmap Tooltip info details */}
        <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-slate-900 text-white flex items-center justify-center font-bold text-[10px]">i</div>
            <span className="text-[11px] text-slate-600">
              {hoveredCell ? (
                <span>
                  Compra: <strong className="text-slate-800">{formatBRL(hoveredCell.arrematacaoValue)}</strong> ({hoveredCell.arrematacaoVar >= 0 ? `+` : ``}{formatPercent(hoveredCell.arrematacaoVar)}) 
                  → Venda: <strong className="text-slate-800">{formatBRL(hoveredCell.saleValue)}</strong> ({hoveredCell.saleVar >= 0 ? `+` : ``}{formatPercent(hoveredCell.saleVar)})
                </span>
              ) : (
                <span>Passe o cursor pelas células do gráfico abaixo para detalhar margem e lucro bruto.</span>
              )}
            </span>
          </div>

          {hoveredCell && (
            <div className="flex gap-4 self-stretch sm:self-auto justify-between bg-white text-slate-700 font-mono text-[11px] px-3 py-1 border border-slate-200 rounded-md">
              <div>Lucro: <strong className="text-gold-dark">{formatBRL(hoveredCell.lucroLiquido)}</strong></div>
              <div>ROI: <strong className="text-gold">{formatPercent(hoveredCell.roi)}</strong></div>
            </div>
          )}
        </div>

        {/* Heatmap Table Grid */}
        <div className="overflow-x-auto rounded-lg">
          <div className="inline-block min-w-full align-middle">
            <table className="min-w-full border-collapse">
              <thead>
                <tr>
                  <th className="bg-slate-50 p-2 border border-slate-200 text-left text-[9px] font-bold text-slate-400 capitalize w-24">
                    Arrematação ↓ / Venda →
                  </th>
                  {[-0.30, -0.20, -0.10, 0, 0.10, 0.20, 0.30].map((v) => (
                    <th key={v} className="bg-slate-50 p-2 border border-slate-200 text-center text-[10px] font-bold text-slate-600 w-20">
                      {v >= 0 ? `+` : ``}{(v * 100).toFixed(0)}%
                      <span className="block text-[8px] font-normal text-slate-400 leading-tight font-mono">
                        {formatBRL(data.saleValue * (1 + v)).split(',')[0]}
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[-0.30, -0.20, -0.10, 0, 0.10, 0.20, 0.30].map((arremVar, idx) => {
                  const correlatedArremPrice = data.arrematacaoValue * (1 + arremVar);
                  return (
                    <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                      <td className="bg-slate-50 p-2 border border-slate-200 text-left text-[10px] font-bold text-slate-600 whitespace-nowrap">
                        {arremVar >= 0 ? `+` : ``}{(arremVar * 100).toFixed(0)}%
                        <span className="block text-[8px] font-normal text-slate-400 font-mono">
                          {formatBRL(correlatedArremPrice).split(',')[0]}
                        </span>
                      </td>

                      {sensitivityMatrix[idx].map((cell, colIdx) => {
                        const isOriginalBase = arremVar === 0 && cell.saleVar === 0;
                        return (
                          <td
                            key={colIdx}
                            onMouseEnter={() => setHoveredCell(cell)}
                            onMouseLeave={() => setHoveredCell(null)}
                            className={`p-2 border border-slate-200 text-center cursor-help transition-all duration-150 ${getCellBgColor(
                              cell.roi
                            )} ${isOriginalBase ? 'ring-2 ring-gold ring-offset-1 font-bold z-10 scale-[1.02]' : ''}`}
                          >
                            <span className="block text-[11px] font-mono whitespace-nowrap">
                              {(cell.roi * 100).toFixed(1)}%
                            </span>
                            {isOriginalBase && (
                              <span className="inline-block text-[7px] uppercase font-extrabold bg-slate-900 text-white px-1 py-0.2 rounded-xs mt-0.5 animate-pulse">
                                Base
                              </span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Legend color guide bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 mt-4 pt-4 border-t border-slate-150/80 text-[10px] text-slate-500">
          <div className="flex flex-wrap gap-2.5 items-center">
            <span className="font-semibold text-slate-400">Legenda ROI:</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-red-100 border border-red-300" /> Prejuízo (&lt;0%)</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-orange-100 border border-orange-300" /> Insuficiente (0-10%)</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-yellow-105 bg-yellow-100 border border-yellow-350" /> Regular (10-25%)</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-lime-100 border border-lime-305" /> Bom (25-50%)</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-gold-light border border-gold/30" /> Excelente (50%-100%)</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-gold border border-gold" /> Fantástico (&gt;100%)</span>
          </div>

          <div className="flex gap-3 text-[10px] bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100 font-mono">
            <div>ROI Mínimo: <span className="text-rose-600 font-bold">{(minRoi * 100).toFixed(1)}%</span></div>
            <div>ROI Máximo: <span className="text-gold font-bold">{(maxRoi * 100).toFixed(1)}%</span></div>
            <div>Cenários Lucrativos: <span className="text-gold font-bold">{positiveScenarios}/49</span></div>
          </div>
        </div>
      </div>

      {/* 4. Waterfall charts and bar list breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Detailed individual fees list */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-sm text-left">
          <div className="flex justify-between items-center mb-4 pb-2 border-b border-slate-100">
            <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
              <Layers size={16} className="text-gold" /> Detalhamento Operacional de Custos
            </h3>
            <span className="text-[10px] font-bold text-slate-400">Rateio Individual de Taxas</span>
          </div>

          <div className="h-56 mt-2">
            {mounted && (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={costDetailsData} layout="vertical" margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                  <XAxis type="number" tickFormatter={(v) => `R$ ${v.toLocaleString('pt-BR')}`} style={{ fontSize: '9px' }} />
                  <YAxis type="category" dataKey="name" style={{ fontSize: '9px' }} width={85} />
                  <Tooltip formatter={(value: any) => formatBRL(Number(value))} />
                  <Bar dataKey="valor" fill="#c5a059" radius={[0, 3, 3, 0]}>
                    {costDetailsData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#b48e48' : '#c5a059'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* DRE Step Visualizer */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-sm text-left">
          <div className="flex justify-between items-center mb-4 pb-2 border-b border-slate-100">
            <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
              <ClipboardCheck size={16} className="text-slate-600" /> Fluxo de Caixa e Sobras da Operação
            </h3>
            <span className="text-[10px] font-bold text-gold uppercase flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" /> Supera CDI
            </span>
          </div>

          <div className="h-56 mt-2">
            {mounted && (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={opBarData} margin={{ top: 15, right: 10, left: 10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" style={{ fontSize: '9px' }} />
                  <YAxis tickFormatter={(v) => `R$ ${(v / 1000).toFixed(0)}k`} style={{ fontSize: '9px' }} />
                  <Tooltip formatter={(value: any) => formatBRL(Number(value))} />
                  <Bar dataKey="valor" radius={[4, 4, 0, 0]}>
                    {opBarData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

      </div>

      {/* 5. Interactive Complete Asset Benchmarking (including direct CDB card and comparison tables) */}
      <InvestmentComparison data={data} results={results} />
    </div>
  );
};
