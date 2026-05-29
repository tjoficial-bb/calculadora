import React, { useState, useMemo, useRef } from 'react';
import { InvestmentData, CalculatedResults, ToggleableField } from './types';
import { INITIAL_INVESTMENT_DATA } from './initialState';
import { calculateAuctionMetrics } from './utils';
import { PercentValueInput } from './components/PercentValueInput';
import { PropertyPhotoUploader } from './components/PropertyPhotoUploader';
import { MapMockup } from './components/MapMockup';
import { ResultsDashboard } from './components/ResultsDashboard';
import { BrlCurrencyInput } from './components/BrlCurrencyInput';
import { 
  Building, Settings, DollarSign, Scale, Percent, CalendarRange, 
  HelpCircle, Link as LinkIcon, User, Calculator, Save, FolderOpen, 
  TrendingUp, Check, AlertCircle, RefreshCw, LogOut, Printer, Info
} from 'lucide-react';

export default function App() {
  const [data, setData] = useState<InvestmentData>(INITIAL_INVESTMENT_DATA);
  const [hasCalculated, setHasCalculated] = useState(false); // Display on explicit calculate action
  const [saveStatus, setSaveStatus] = useState<string>('');
  
  const resultsRef = useRef<HTMLDivElement>(null);

  // Simple recalculations in real-time
  const computedResults = useMemo<CalculatedResults>(() => {
    return calculateAuctionMetrics(data);
  }, [data]);

  // Handle single value change helper
  const updateDataField = (field: keyof InvestmentData, value: any) => {
    setData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const scrollToResults = () => {
    setHasCalculated(true);
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleSaveSimulation = () => {
    setSaveStatus('Simulação salva no navegador!');
    localStorage.setItem('tjinvest_auction_doc', JSON.stringify(data));
    setTimeout(() => setSaveStatus(''), 3000);
  };

  const handleLoadSimulation = () => {
    const saved = localStorage.getItem('tjinvest_auction_doc');
    if (saved) {
      setData(JSON.parse(saved));
      setHasCalculated(true);
      setSaveStatus('Simulação carregada com sucesso!');
    } else {
      setSaveStatus('Nenhuma gravação anterior encontrada.');
    }
    setTimeout(() => setSaveStatus(''), 3000);
  };

  const handleFormatBRLInput = (val: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(val);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 font-sans antialiased text-left selection:bg-indigo-550 selection:text-white pb-12">
      
      {/* 1. Header Navigation Bar (reproducing 'TJ INVEST' logo and tools) */}
      <header className="sticky top-0 bg-slate-950 text-white px-4 md:px-8 py-3.5 flex justify-between items-center shrink-0 shadow-xl border-b border-slate-800/80 z-40 no-print">
        <div className="flex items-center gap-6">
          {/* TJ INVEST branding logo */}
          <div className="flex items-center gap-3 cursor-pointer select-none">
            <div className="relative w-9 h-9 border border-gold/40 rounded bg-slate-900 flex items-center justify-center shadow-md overflow-hidden">
              <span className="relative font-mono font-bold text-xs tracking-wider text-gold">TJ</span>
            </div>
            <div className="flex flex-col">
              <h1 className="text-base font-black tracking-widest text-white flex items-center gap-1.5 leading-none">
                TJ <span className="text-gold">INVEST</span>
              </h1>
              <span className="text-[9px] uppercase tracking-wider text-slate-400 font-extrabold leading-none mt-1">
                Inteligência em Leilões
              </span>
            </div>
          </div>

          {/* Core file actions */}
          <nav className="hidden lg:flex items-center gap-5 text-xs font-semibold text-slate-300">
            <button 
              type="button" 
              onClick={handleSaveSimulation}
              className="flex items-center gap-1.5 hover:text-white transition cursor-pointer"
              title="Salvar simulação atual"
            >
              <Save size={14} className="text-gold" /> Salvar
            </button>
            <button 
              type="button" 
              onClick={handleLoadSimulation}
              className="flex items-center gap-1.5 hover:text-white transition cursor-pointer"
              title="Abrir última simulação"
            >
              <FolderOpen size={14} className="text-gold" /> Abrir
            </button>
            <button 
              type="button" 
              onClick={scrollToResults} 
              className="flex items-center gap-1.5 hover:text-white transition cursor-pointer"
            >
              <TrendingUp size={14} className="text-gold" /> Análises
            </button>
            <button 
              type="button" 
              onClick={() => window.print()} 
              className="flex items-center gap-1.5 hover:text-white transition cursor-pointer"
            >
              <Printer size={14} className="text-gold" /> Imprimir
            </button>
          </nav>
        </div>

        {/* User context & main action Button */}
        <div className="flex items-center gap-3">
          {saveStatus && (
            <span className="hidden sm:inline-block bg-slate-800 text-gold border border-gold/20 text-[10px] font-bold px-2 py-1 rounded animate-pulse">
              {saveStatus}
            </span>
          )}

          <button
            type="button"
            onClick={scrollToResults}
            className="bg-gold hover:bg-gold-hover text-white text-xs font-semibold px-4 py-2 rounded transition-colors shadow-sm cursor-pointer flex items-center gap-1.5"
          >
            <Calculator size={14} />
            <span>Calcular</span>
          </button>

          {/* Username panel */}
          <div className="hidden sm:flex items-center gap-2 border-l border-slate-800 pl-3">
            <div className="w-7 h-7 rounded-full bg-slate-800 border border-slate-750 flex items-center justify-center text-slate-300">
              <User size={13} />
            </div>
            <div className="text-right">
              <span className="text-[10px] font-bold block text-slate-200">Investidor</span>
              <span className="text-[9px] text-gold flex items-center gap-1 leading-none">
                <span className="w-1 h-1 rounded-full bg-gold inline-block animate-ping" />
                Ativo
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 md:px-8 mt-6 flex flex-col gap-8">
        
        {/* Banner Informational Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 no-print border-b border-slate-200 pb-5">
          <div className="text-left">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
              <Building className="text-gold shrink-0" size={24} />
              Calculadora de Leilões de Imóveis
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Simule a rentabilidade da arrematação judicial ou extrajudicial, desconte impostos de ganho de capital (IR PF/PJ) e assessoria de leilões.
            </p>
          </div>
          <div className="bg-white border border-slate-200 px-3 py-2 rounded-xl text-xs flex gap-4 font-semibold text-slate-650 shadow-xs">
            <div>CDI: <span className="text-gold font-bold font-mono">13,75%</span></div>
            <div>Dólar: <span className="text-slate-500 font-bold font-mono">R$ 5,12</span></div>
            <div>Ibovespa: <span className="text-gold font-bold font-mono">+0.85%</span></div>
          </div>
        </div>

        {/* Top Calculator Trigger Banner - Highly Visible */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 text-white flex flex-col md:flex-row justify-between items-center gap-4 shadow-lg no-print">
          <div className="flex items-center gap-3 text-left">
            <div className="w-10 h-10 rounded-full bg-gold flex items-center justify-center text-slate-950 shadow-md shrink-0">
              <Calculator size={18} />
            </div>
            <div>
              <h3 className="font-bold text-sm tracking-tight text-white">Pronto para calcular?</h3>
              <p className="text-xs text-slate-400">Insira as informações do imóvel e clique no botão para calcular todos os cenários de rentabilidade.</p>
            </div>
          </div>
          <button
            type="button"
            onClick={scrollToResults}
            className="w-full md:w-auto px-6 py-3.5 bg-gold hover:bg-gold-hover text-white text-xs font-bold uppercase tracking-wider rounded shadow-md hover:shadow-lg transition-colors flex items-center justify-center gap-2 cursor-pointer shrink-0"
          >
            <Calculator size={14} />
            <span>Calcular Rentabilidade</span>
          </button>
        </div>

        {/* 2. Grid for the 6 Cards (Images Reference) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 no-print">
          
          {/* CARD 1: Informações do Imóvel */}
          <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-5 hover:shadow-md transition-all flex flex-col gap-4 text-left">
            <h2 className="text-slate-500 text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 border-b border-slate-100 pb-3">
              <span className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0" />
              Informações do Imóvel
            </h2>
            
            {/* Foto box */}
            <PropertyPhotoUploader 
              currentImage={data.propertyImage}
              onImageChange={(url) => updateDataField('propertyImage', url)}
            />

            {/* Endereço e mapa */}
            <MapMockup 
              address={data.propertyAddress}
              onAddressChange={(addr) => updateDataField('propertyAddress', addr)}
              city={data.propertyCity}
              onCityChange={(c) => updateDataField('propertyCity', c)}
            />

            {/* Link do leiloeiro */}
            <div className="flex flex-col gap-1 mt-1">
              <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                <LinkIcon size={13} className="text-slate-400" />
                <span>Link do Leiloeiro</span>
              </label>
              <input 
                type="url"
                value={data.propertyLink}
                onChange={(e) => updateDataField('propertyLink', e.target.value)}
                placeholder="https://..."
                className="w-full h-[38px] text-xs text-slate-700 bg-slate-50/50 hover:bg-slate-50 border border-slate-200 rounded px-3 focus:outline-none focus:border-gold focus:bg-white transition-all"
              />
            </div>
          </div>

          {/* CARD 2: Premissas */}
          <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-5 hover:shadow-md transition-all flex flex-col gap-5 text-left">
            <h2 className="text-slate-500 text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 border-b border-slate-100 pb-3">
              <span className="w-2 h-2 bg-amber-500 rounded-full flex-shrink-0" />
              Premissas do Investimento
            </h2>

            {/* Valor de Arrematação */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-700 flex justify-between items-center">
                <span>Valor de Arrematação (R$)</span>
                <span className="text-[10px] text-slate-400 font-medium">Preço de compra</span>
              </label>
              <div className="relative flex items-center">
                <BrlCurrencyInput 
                  value={data.arrematacaoValue}
                  onChange={(val) => updateDataField('arrematacaoValue', val)}
                  placeholder="R$ 0,00"
                  className="w-full h-[38px] font-mono text-xs text-slate-700 bg-slate-50/50 hover:bg-slate-50 border border-slate-200 rounded px-3 focus:outline-none focus:border-gold focus:bg-white transition-all shadow-inner"
                />
              </div>
            </div>

            {/* Preço de Venda */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-705 flex justify-between items-center">
                <span>Preço de Venda Estimado (R$)</span>
                <span className="text-[10px] text-slate-400 font-medium">Futura revenda</span>
              </label>
              <div className="relative flex items-center">
                <BrlCurrencyInput 
                  value={data.saleValue}
                  onChange={(val) => updateDataField('saleValue', val)}
                  placeholder="R$ 0,00"
                  className="w-full h-[38px] font-mono text-xs text-slate-700 bg-slate-50/50 hover:bg-slate-50 border border-slate-200 rounded px-3 focus:outline-none focus:border-gold focus:bg-white transition-all shadow-inner"
                />
              </div>
            </div>

            {/* Hold Months */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-705 flex justify-between items-center">
                <span>Período de Revenda (meses)</span>
                <span className="text-xs font-bold text-gold-dark font-mono">{data.holdMonths}m</span>
              </label>
              <input 
                type="range"
                min="1"
                max="36"
                value={data.holdMonths}
                onChange={(e) => updateDataField('holdMonths', parseInt(e.target.value) || 12)}
                className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-gold"
              />
              <div className="flex justify-between text-[9px] text-slate-400 font-bold">
                <span>1 mês</span>
                <span>12 meses</span>
                <span>24 meses</span>
                <span>36 meses</span>
              </div>
            </div>

            {/* Modalidade de Pagamento */}
            <div className="flex flex-col gap-2 mt-1">
              <span className="text-xs font-semibold text-slate-700">Modalidade de Pagamento</span>
              <div className="grid grid-cols-3 gap-1.5 bg-slate-50 border border-slate-200/60 p-1.5 rounded-lg">
                {(['À Vista', 'Financiado', 'Parcelado'] as const).map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => updateDataField('paymentMode', mode)}
                    className={`text-[10px] font-bold py-1.5 rounded text-center transition-all cursor-pointer ${
                      data.paymentMode === mode
                        ? 'bg-slate-900 text-white shadow-xs'
                        : 'text-slate-600 hover:bg-white/50'
                    }`}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            </div>

            {/* Supplementary specs for Financed or Installments */}
            {data.paymentMode !== 'À Vista' && (
              <div className="bg-gold-light border border-gold/15 rounded-xl p-3.5 mt-2 flex flex-col gap-3 animate-fade-in text-left">
                <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Configuração de Parcelas S.A.C</span>
                
                {/* Downpayment Slider */}
                <div className="flex flex-col gap-1">
                  <div className="flex justify-between text-[10px] font-bold text-slate-755">
                    <span>Entrada (Entrada / Down)</span>
                    <span className="font-mono text-gold-dark">{data.downPaymentPercent}% ({handleFormatBRLInput(data.arrematacaoValue * (data.downPaymentPercent / 100)).split(',')[0]}</span>
                  </div>
                  <input 
                    type="range"
                    min="10"
                    max="90"
                    step="5"
                    value={data.downPaymentPercent}
                    onChange={(e) => updateDataField('downPaymentPercent', parseInt(e.target.value))}
                    className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-gold"
                  />
                </div>

                {/* Prazo */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-bold text-slate-700">Parcelas (Quantidade)</span>
                    <input 
                      type="number"
                      min="1"
                      value={data.installmentsCount || ''}
                      onChange={(e) => updateDataField('installmentsCount', parseInt(e.target.value) || 24)}
                      className="w-full h-[32px] text-xs font-mono bg-slate-50 border border-slate-200 focus:bg-white focus:border-gold focus:outline-none rounded px-2"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-bold text-slate-700">Juros Anual (% a.a.)</span>
                    <input 
                      type="number"
                      step="0.1"
                      value={data.interestRateYear || ''}
                      onChange={(e) => updateDataField('interestRateYear', parseFloat(e.target.value) || 0)}
                      className="w-full h-[32px] text-xs font-mono bg-slate-50 border border-slate-200 focus:bg-white focus:border-gold focus:outline-none rounded px-2"
                    />
                  </div>
                </div>

                <div className="text-[9px] text-slate-500 leading-tight">
                  No modo parcelado judicial, exige-se proposta de no mínimo <strong>25% de entrada</strong> e saldo em até <strong>30 vezes</strong> corrigido.
                </div>
              </div>
            )}
          </div>

          {/* CARD 3: Custos na Aquisição */}
          <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-5 hover:shadow-md transition-all flex flex-col gap-4 text-left">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h2 className="text-slate-500 text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
                <span className="w-2 h-2 bg-gold rounded-full flex-shrink-0" />
                Custos na Aquisição
              </h2>
              {/* Gold/Orange Dedutibilidade legend */}
              <div className="flex gap-2 text-[9px] font-bold text-slate-450 shrink-0">
                <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-gold inline-block" />Dedutível</span>
                <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-amber-500 inline-block" />Não ded.</span>
              </div>
            </div>

            {/* Scroll Container for acquisition list */}
            <div className="flex flex-col gap-4 max-h-[360px] overflow-y-auto pr-1">
              
              <PercentValueInput 
                label="Comissão do Leiloeiro"
                field={data.comissaoLeiloeiro}
                refValue={data.arrematacaoValue}
                onChange={(updated) => updateDataField('comissaoLeiloeiro', updated)}
                tooltipText="Geralmente fixada em 5% sobre o valor da arrematação por lei."
                irDeductible="deductible"
              />

              <PercentValueInput 
                label="ITBI Imobiliário"
                field={data.itbi}
                refValue={data.arrematacaoValue}
                onChange={(updated) => updateDataField('itbi', updated)}
                tooltipText="Imposto de Transmissão de Bens Imóveis. Varia entre 2% e 4% de acordo com a prefeitura."
                irDeductible="deductible"
              />

              <PercentValueInput 
                label="Assessoria de Arrematação"
                field={data.assessoriaAquisicao}
                refValue={data.arrematacaoValue}
                onChange={(updated) => updateDataField('assessoriaAquisicao', updated)}
                tooltipText="Taxa administrativa pago a advogados ou assessores de leilão."
                irDeductible="non-deductible"
              />

              <div className="grid grid-cols-2 gap-2">
                
                {/* Dívida Propter Rem */}
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-slate-600 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 inline-block" />
                    <span>Dívidas Propter Rem</span>
                  </label>
                  <BrlCurrencyInput 
                    value={data.dividaPropterRem}
                    onChange={(val) => updateDataField('dividaPropterRem', val)}
                    placeholder="R$ 0,00"
                    className="w-full h-[38px] font-mono text-xs text-slate-700 bg-slate-50/50 hover:bg-slate-50 border border-slate-200 rounded px-3 focus:outline-none focus:border-gold focus:bg-white transition-all"
                  />
                </div>

                {/* Notary Registry fees */}
                <PercentValueInput 
                  label="Notário / Registro"
                  field={data.registro}
                  refValue={data.arrematacaoValue}
                  onChange={(updated) => updateDataField('registro', updated)}
                  tooltipText="Escritura pública, certidões e registro no cartório de registro de imóveis competente."
                  irDeductible="deductible"
                />

              </div>

              {/* Reform Section labor vs materials */}
              <div className="bg-slate-50 border border-slate-200/50 p-3 rounded-xl flex flex-col gap-3">
                <span className="text-[9px] uppercase font-black text-slate-400 tracking-wider">Obras e Reformas do Ativo</span>
                
                <div className="grid grid-cols-2 gap-2">
                  
                  {/* Mão de Obra */}
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-slate-650 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-gold inline-block" />
                      <span>Mão de Obra</span>
                    </label>
                    <BrlCurrencyInput 
                      value={data.reformaMaoObra}
                      onChange={(val) => updateDataField('reformaMaoObra', val)}
                      placeholder="R$ 0,00"
                      className="w-full h-8 font-mono text-xs text-slate-700 bg-slate-50/50 hover:bg-slate-50 border border-slate-200 rounded px-2 focus:outline-none focus:border-gold focus:bg-white transition-all"
                    />
                  </div>

                  {/* Material */}
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-slate-650 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-gold inline-block" />
                      <span>Material</span>
                    </label>
                    <BrlCurrencyInput 
                      value={data.reformaMaterial}
                      onChange={(val) => updateDataField('reformaMaterial', val)}
                      placeholder="R$ 0,00"
                      className="w-full h-8 font-mono text-xs text-slate-700 bg-slate-50/50 hover:bg-slate-50 border border-slate-200 rounded px-2 focus:outline-none focus:border-gold focus:bg-white transition-all"
                    />
                  </div>

                </div>
              </div>

              {/* Outros custos */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-slate-705 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-amber-500 inline-block" />
                  <span>Outros Custos de Aquisição (Opcional)</span>
                </label>
                <BrlCurrencyInput 
                  value={data.outrosCustosAquisicao}
                  onChange={(val) => updateDataField('outrosCustosAquisicao', val)}
                  placeholder="R$ 0,00"
                  className="w-full h-[38px] font-mono text-xs text-slate-700 bg-slate-50/50 hover:bg-slate-50 border border-slate-200 rounded px-3 focus:outline-none focus:border-gold focus:bg-white transition-all"
                />
              </div>

            </div>
          </div>

          {/* CARD 4: Custos na Venda */}
          <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-5 hover:shadow-md transition-all flex flex-col gap-4 text-left">
            <h2 className="text-slate-500 text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 border-b border-slate-100 pb-3">
              <span className="w-2 h-2 bg-pink-500 rounded-full flex-shrink-0" />
              Custos na Venda
            </h2>

            <PercentValueInput 
              label="Comissão de Corretor (%)"
              field={data.corretorVenda}
              refValue={data.saleValue}
              onChange={(updated) => updateDataField('corretorVenda', updated)}
              tooltipText="Geralmente oscila entre 5% e 6% do valor de venda sob tabela CRECI."
              irDeductible="deductible"
            />

            <PercentValueInput 
              label="Assessoria Legal de Venda"
              field={data.assessoriaVenda}
              refValue={data.saleValue}
              onChange={(updated) => updateDataField('assessoriaVenda', updated)}
              tooltipText="Taxas pagas para elaboração de escrituras, contratos e suporte jurídico."
              irDeductible="non-deductible"
            />
          </div>

          {/* CARD 5: Imposto de Renda */}
          <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-5 hover:shadow-md transition-all flex flex-col gap-4 text-left">
            <h2 className="text-slate-500 text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 border-b border-slate-100 pb-3">
              <span className="w-2 h-2 bg-indigo-500 rounded-full flex-shrink-0" />
              Tributação e Imposto de Renda
            </h2>

            <div className="flex gap-1.5 bg-slate-50 border border-slate-200/60 p-1 rounded-lg">
              {(['PF', 'PJ', 'Manual'] as const).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => updateDataField('taxMode', mode)}
                  className={`flex-1 text-[10px] font-bold py-1.5 rounded text-center transition-all cursor-pointer ${
                    data.taxMode === mode
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'text-slate-600 hover:bg-white/50'
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>

            {/* PF / PJ Read-Only / Custom details */}
            {data.taxMode === 'PF' && (
              <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 flex flex-col gap-2.5">
                <span className="text-[10px] uppercase font-bold text-slate-400">Pessoa Física - Alíquota 15%</span>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500 font-medium">IR Ganho de Capital:</span>
                  <span className="font-mono font-bold text-slate-800">{handleFormatBRLInput(computedResults.impostoRendaVenda)}</span>
                </div>
                <div className="text-[9.5px] text-slate-500 leading-snug">
                  Cálculo automático deduzindo os itens autorizados pela Receita Federal (Arrematação, comissão de leiloeiro, ITBI, cartório, reformas e corretagens).
                </div>
              </div>
            )}

            {data.taxMode === 'PJ' && (
              <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 flex flex-col gap-2.5">
                <span className="text-[10px] uppercase font-bold text-slate-400">Pessoa Jurídica (Lucro Presumido)</span>
                
                <div className="flex flex-col gap-1 mt-1">
                  <span className="text-[10px] font-bold text-slate-605">Alíquota PJ sobre Venda Bruta (%)</span>
                  <input 
                    type="number"
                    step="0.01"
                    value={data.customPjRate || ''}
                    onChange={(e) => updateDataField('customPjRate', parseFloat(e.target.value) || 0)}
                    className="w-full h-8 font-mono text-xs text-slate-705 bg-slate-50/50 hover:bg-slate-50 border border-slate-200 focus:bg-white focus:border-gold focus:outline-none rounded px-2"
                  />
                </div>

                <div className="flex justify-between items-center text-xs border-t border-slate-200/50 pt-2">
                  <span className="text-slate-500 font-medium">IR na Venda Total:</span>
                  <span className="font-mono font-bold text-slate-800">{handleFormatBRLInput(computedResults.impostoRendaVenda)}</span>
                </div>
                <div className="text-[9.5px] text-slate-500 leading-snug">
                  Geralmente estruturado no Lucro Presumido com atividade imobiliária comercial (efetivo ~5,93% de tributos sobre a receita de revenda).
                </div>
              </div>
            )}

            {data.taxMode === 'Manual' && (
              <div className="bg-slate-50 border border-slate-100 rounded-xl p-3.5 flex flex-col gap-3">
                <span className="text-[10px] uppercase font-bold text-slate-400">Entrada Manual de Impostos</span>
                
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-bold text-slate-600">Imposto Total na Venda (R$)</span>
                  <BrlCurrencyInput 
                    value={data.manualTaxOnSale}
                    onChange={(val) => updateDataField('manualTaxOnSale', val)}
                    placeholder="R$ 0,00"
                    className="w-full h-8 font-mono text-xs text-slate-700 bg-slate-50/50 hover:bg-slate-50 border border-slate-200 focus:bg-white focus:border-gold focus:outline-none rounded px-2"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-bold text-slate-600">Imposto Mensal Recorrente (R$)</span>
                  <BrlCurrencyInput 
                    value={data.manualTaxMonthly}
                    onChange={(val) => updateDataField('manualTaxMonthly', val)}
                    placeholder="R$ 0,00"
                    className="w-full h-8 font-mono text-xs text-slate-700 bg-slate-50/50 hover:bg-slate-50 border border-slate-200 focus:bg-white focus:border-gold focus:outline-none rounded px-2"
                  />
                </div>
              </div>
            )}
          </div>

          {/* CARD 6: Custos Mensais de holding */}
          <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-5 hover:shadow-md transition-all flex flex-col gap-4 text-left">
            <h2 className="text-slate-500 text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 border-b border-slate-100 pb-3">
              <span className="w-2 h-2 bg-violet-500 rounded-full flex-shrink-0" />
              Custos Mensais (Mantimento)
            </h2>

            {/* IPTU */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-slate-700">IPTU do Ativo (R$/mês)</label>
              <BrlCurrencyInput 
                value={data.iptuMonthly}
                onChange={(val) => updateDataField('iptuMonthly', val)}
                placeholder="R$ 0,00"
                className="w-full h-[38px] font-mono text-xs text-slate-700 bg-slate-50/50 hover:bg-slate-50 border border-slate-200 rounded px-3 focus:outline-none focus:border-gold focus:bg-white transition-all shadow-inner"
              />
            </div>

            {/* Condominio */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-slate-700">Condomínio (R$/mês)</label>
              <BrlCurrencyInput 
                value={data.condominioMonthly}
                onChange={(val) => updateDataField('condominioMonthly', val)}
                placeholder="R$ 0,00"
                className="w-full h-[38px] font-mono text-xs text-slate-700 bg-slate-50/50 hover:bg-slate-50 border border-slate-200 rounded px-3 focus:outline-none focus:border-gold focus:bg-white transition-all shadow-inner"
              />
            </div>

            {/* Outros recorrentes */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-slate-700">Outros Custos Recorrentes (R$/mês)</label>
              <BrlCurrencyInput 
                value={data.outrosMensais}
                onChange={(val) => updateDataField('outrosMensais', val)}
                placeholder="R$ 0,00"
                className="w-full h-[38px] font-mono text-xs text-slate-700 bg-slate-50/50 hover:bg-slate-50 border border-slate-200 rounded px-3 focus:outline-none focus:border-gold focus:bg-white transition-all shadow-inner"
              />
            </div>

            <div className="bg-slate-50 border border-slate-150 rounded-xl p-3 text-[10px] text-slate-500 font-medium italic leading-snug mt-1 flex gap-2">
              <Info size={14} className="text-gold shrink-0 mt-0.5" />
              <span>Multiplicado pelo período total estipulado para a revenda do imóvel ({data.holdMonths} meses).</span>
            </div>
          </div>

        </div>

         {/* 3. Central Trigger Buttons panel */}
        <div className="w-full py-5 bg-slate-900 rounded-xl flex flex-col md:flex-row justify-between items-center px-6 md:px-8 gap-4 shadow-lg no-print text-white text-left">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gold flex items-center justify-center text-slate-950 shadow-md shrink-0">
              <Calculator size={18} />
            </div>
            <div>
              <h3 className="font-bold text-sm tracking-tight text-white">Simule Cenários de Extrema Viabilidade</h3>
              <p className="text-xs text-slate-400">Modifique os parâmetros acima e processe para recalcular a rentabilidade.</p>
            </div>
          </div>

          <div className="flex gap-2 w-full md:w-auto shrink-0 justify-end">
            <button
              type="button"
              onClick={() => {
                setData(INITIAL_INVESTMENT_DATA);
                setHasCalculated(false);
              }}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-755 text-slate-300 text-xs font-semibold border border-slate-700/60 rounded transition-colors cursor-pointer"
            >
              Resetar Tudo
            </button>
            <button
              type="button"
              onClick={scrollToResults}
              className="px-8 py-3.5 bg-gold hover:bg-gold-hover text-white text-xs font-bold uppercase tracking-wider rounded shadow-md hover:shadow-lg transition-colors flex items-center gap-2 cursor-pointer"
            >
              <Calculator size={16} />
              <span>Calcular Rentabilidade</span>
            </button>
          </div>
        </div>

        {/* 4. Results Section anchor */}
        <div ref={resultsRef} className="scroll-mt-20">
          {hasCalculated ? (
            <ResultsDashboard 
              data={data}
              results={computedResults}
            />
          ) : (
            <div className="bg-white border-2 border-dashed border-slate-200 rounded-xl p-8 md:p-12 text-center text-slate-550 max-w-2xl mx-auto shadow-xs my-6">
              <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600 mx-auto mb-4 animate-pulse">
                <Calculator size={32} />
              </div>
              <h3 className="text-lg font-bold text-slate-800">Pronto para Analisar Rentabilidade</h3>
              <p className="text-sm text-slate-500 mt-2 max-w-md mx-auto">
                Insira as premissas, custos de aquisição e manutenção nos campos acima. Depois, clique em <strong className="text-emerald-600 font-semibold">Calcular Rentabilidade</strong> para desbloquear a matriz de cenários, DRE e fluxo de caixa.
              </p>
              <button 
                type="button"
                onClick={scrollToResults}
                className="mt-6 px-6 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold uppercase tracking-wider rounded shadow-md hover:shadow-lg transition-colors inline-flex items-center gap-2 cursor-pointer animate-bounce"
              >
                <Calculator size={14} />
                <span>Calcular Rentabilidade</span>
              </button>
            </div>
          )}
        </div>

      </main>

      {/* Footer credits matches branding guidelines */}
      <footer className="mt-16 text-center text-xs text-slate-400 border-t border-slate-200 pt-8 no-print pb-6">
        <p className="font-bold text-slate-550 text-slate-500">Calculadora TJ INVEST • A mais completa para imóveis de leilão do Brasil</p>
        <p className="mt-1">Dúvidas? Entre em contato com nosso suporte.</p>
        <div className="flex justify-center gap-4 mt-3 text-[10px] text-slate-400">
          <a href="#" className="hover:underline">Termos de Uso</a>
          <span>•</span>
          <a href="#" className="hover:underline">Políticas de Privacidade</a>
          <span>•</span>
          <a href="#" className="hover:underline">Manual Técnico</a>
        </div>
      </footer>

    </div>
  );
}
