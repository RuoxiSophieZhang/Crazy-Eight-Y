import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BookOpen, 
  CheckCircle2, 
  XCircle, 
  ChevronRight, 
  RotateCcw, 
  Info, 
  Trophy,
  Filter,
  GraduationCap,
  ExternalLink
} from 'lucide-react';
import { Question, Difficulty, Category } from './types/grammar';
import { QUESTIONS } from './data/questions';

const CATEGORIES: Category[] = ['定语从句', '状语从句', '非谓语动词', '名词性从句', '连词', '独立主格'];
const DIFFICULTIES: Difficulty[] = ['初级', '中级', '高级'];

export default function App() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [filterDifficulty, setFilterDifficulty] = useState<Difficulty | '全部'>('全部');
  const [filterCategory, setFilterCategory] = useState<Category | '全部'>('全部');
  const [history, setHistory] = useState<{ questionId: string; isCorrect: boolean }[]>([]);

  const filteredQuestions = useMemo(() => {
    return QUESTIONS.filter(q => {
      const matchDifficulty = filterDifficulty === '全部' || q.difficulty === filterDifficulty;
      const matchCategory = filterCategory === '全部' || q.category === filterCategory;
      return matchDifficulty && matchCategory;
    });
  }, [filterDifficulty, filterCategory]);

  const currentQuestion = filteredQuestions[currentQuestionIndex];

  const handleOptionSelect = (option: string) => {
    if (isSubmitted) return;
    setSelectedOption(option);
  };

  const handleSubmit = () => {
    if (!selectedOption || isSubmitted) return;
    
    const isCorrect = selectedOption === currentQuestion.correctAnswer;
    if (isCorrect) {
      setScore(prev => prev + 1);
    }
    
    setHistory(prev => [...prev, { questionId: currentQuestion.id, isCorrect }]);
    setIsSubmitted(true);
  };

  const handleNext = () => {
    if (currentQuestionIndex < filteredQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsSubmitted(false);
    } else {
      setShowResult(true);
    }
  };

  const resetGame = () => {
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setIsSubmitted(false);
    setScore(0);
    setShowResult(false);
    setHistory([]);
  };

  const renderSentence = (sentence: string, selected: string | null) => {
    const parts = sentence.split('______');
    return (
      <div className="text-2xl md:text-3xl font-serif leading-relaxed text-zinc-800">
        {parts[0]}
        <span className={`inline-block min-w-[120px] border-b-2 mx-2 text-center transition-all duration-300 ${
          isSubmitted 
            ? selected === currentQuestion.correctAnswer 
              ? 'text-emerald-600 border-emerald-600' 
              : 'text-rose-600 border-rose-600'
            : 'text-indigo-600 border-indigo-300'
        }`}>
          {selected || '______'}
        </span>
        {parts[1]}
      </div>
    );
  };

  if (filteredQuestions.length === 0) {
    return (
      <div className="min-h-screen bg-stone-50 flex flex-col items-center justify-center p-6 text-center">
        <div className="bg-white p-10 rounded-3xl shadow-sm border border-stone-200 max-w-md">
          <Filter className="w-12 h-12 text-stone-300 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-stone-800 mb-2">未找到匹配题目</h2>
          <p className="text-stone-500 mb-6">尝试调整筛选条件以继续练习。</p>
          <button 
            onClick={() => { setFilterDifficulty('全部'); setFilterCategory('全部'); }}
            className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors"
          >
            重置筛选
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFCFB] text-zinc-900 font-sans selection:bg-indigo-100">
      {/* Header */}
      <header className="max-w-5xl mx-auto px-6 py-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">英语语法通</h1>
            <p className="text-[10px] uppercase tracking-widest text-zinc-400 font-bold">Grammar Master</p>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-6">
          <div className="flex flex-col items-end">
            <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">当前进度</span>
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold text-lg">{currentQuestionIndex + 1}</span>
              <span className="text-zinc-300">/</span>
              <span className="text-zinc-400 font-mono">{filteredQuestions.length}</span>
            </div>
          </div>
          <div className="h-8 w-px bg-zinc-200"></div>
          <div className="flex flex-col items-end">
            <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">得分</span>
            <span className="font-mono font-bold text-lg text-emerald-600">{score}</span>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 pb-20">
        <AnimatePresence mode="wait">
          {!showResult ? (
            <motion.div
              key="quiz"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8"
            >
              {/* Left Column: Question */}
              <div className="lg:col-span-8 space-y-6">
                {/* Filters (Mobile) */}
                <div className="lg:hidden flex flex-wrap gap-2 mb-4">
                  <select 
                    value={filterDifficulty} 
                    onChange={(e) => setFilterDifficulty(e.target.value as any)}
                    className="bg-white border border-zinc-200 px-3 py-1.5 rounded-lg text-xs font-medium"
                  >
                    <option value="全部">所有难度</option>
                    {DIFFICULTIES.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                  <select 
                    value={filterCategory} 
                    onChange={(e) => setFilterCategory(e.target.value as any)}
                    className="bg-white border border-zinc-200 px-3 py-1.5 rounded-lg text-xs font-medium"
                  >
                    <option value="全部">所有分类</option>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-sm border border-zinc-100 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-violet-500"></div>
                  
                  <div className="flex items-center gap-3 mb-8">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      currentQuestion.difficulty === '初级' ? 'bg-emerald-50 text-emerald-600' :
                      currentQuestion.difficulty === '中级' ? 'bg-amber-50 text-amber-600' :
                      'bg-rose-50 text-rose-600'
                    }`}>
                      {currentQuestion.difficulty}
                    </span>
                    <span className="px-3 py-1 rounded-full bg-zinc-100 text-zinc-500 text-[10px] font-bold uppercase tracking-wider">
                      {currentQuestion.category}
                    </span>
                  </div>

                  <div className="mb-12">
                    {renderSentence(currentQuestion.sentence, selectedOption)}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {currentQuestion.options.map((option) => (
                      <button
                        key={option}
                        onClick={() => handleOptionSelect(option)}
                        disabled={isSubmitted}
                        className={`group relative py-5 px-6 rounded-2xl border-2 text-left transition-all duration-200 ${
                          selectedOption === option
                            ? isSubmitted
                              ? option === currentQuestion.correctAnswer
                                ? 'bg-emerald-50 border-emerald-500 text-emerald-700'
                                : 'bg-rose-50 border-rose-500 text-rose-700'
                              : 'bg-indigo-50 border-indigo-500 text-indigo-700'
                            : isSubmitted && option === currentQuestion.correctAnswer
                              ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                              : 'bg-white border-zinc-100 hover:border-zinc-300 text-zinc-600'
                        }`}
                      >
                        <span className="text-lg font-medium">{option}</span>
                        {isSubmitted && option === currentQuestion.correctAnswer && (
                          <CheckCircle2 className="absolute right-6 top-1/2 -translate-y-1/2 w-6 h-6 text-emerald-500" />
                        )}
                        {isSubmitted && selectedOption === option && option !== currentQuestion.correctAnswer && (
                          <XCircle className="absolute right-6 top-1/2 -translate-y-1/2 w-6 h-6 text-rose-500" />
                        )}
                      </button>
                    ))}
                  </div>

                  <div className="mt-10 flex items-center justify-between">
                    <div className="text-zinc-400 text-sm italic">
                      {!selectedOption ? '请选择一个选项' : isSubmitted ? '查看右侧解析' : '点击提交检查答案'}
                    </div>
                    {!isSubmitted ? (
                      <button
                        onClick={handleSubmit}
                        disabled={!selectedOption}
                        className={`px-8 py-4 rounded-2xl font-bold transition-all shadow-lg ${
                          selectedOption 
                            ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-200' 
                            : 'bg-zinc-100 text-zinc-400 cursor-not-allowed shadow-none'
                        }`}
                      >
                        提交答案
                      </button>
                    ) : (
                      <button
                        onClick={handleNext}
                        className="px-8 py-4 bg-zinc-900 text-white rounded-2xl font-bold hover:bg-zinc-800 transition-all shadow-lg flex items-center gap-2"
                      >
                        {currentQuestionIndex === filteredQuestions.length - 1 ? '完成练习' : '下一题'}
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Column: Explanation & Filters */}
              <div className="lg:col-span-4 space-y-6">
                {/* Explanation Card */}
                <AnimatePresence>
                  {isSubmitted && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="bg-white rounded-[2rem] p-8 shadow-sm border border-zinc-100"
                    >
                      <div className="flex items-center gap-2 mb-6 text-indigo-600">
                        <Info className="w-5 h-5" />
                        <h3 className="font-bold uppercase tracking-wider text-xs">详解卡片</h3>
                      </div>

                      <div className="space-y-6">
                        <div>
                          <h4 className="text-[10px] uppercase font-bold text-zinc-400 tracking-widest mb-2">语法规则</h4>
                          <p className="text-sm text-zinc-700 leading-relaxed">{currentQuestion.explanation.rule}</p>
                        </div>
                        
                        <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-100">
                          <h4 className="text-[10px] uppercase font-bold text-zinc-400 tracking-widest mb-2">经典例句</h4>
                          <p className="text-sm italic text-zinc-800 font-serif">"{currentQuestion.explanation.example}"</p>
                        </div>

                        <div>
                          <h4 className="text-[10px] uppercase font-bold text-rose-400 tracking-widest mb-2">常见错误辨析</h4>
                          <p className="text-sm text-zinc-600 leading-relaxed">{currentQuestion.explanation.commonMistake}</p>
                        </div>

                        <div className="pt-4 border-t border-zinc-100">
                          <a 
                            href="#" 
                            className="text-xs text-indigo-600 font-bold flex items-center gap-1 hover:underline"
                          >
                            复习相关语法点 <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Filters (Desktop) */}
                <div className="hidden lg:block bg-zinc-50 rounded-[2rem] p-8 border border-zinc-100">
                  <div className="flex items-center gap-2 mb-6 text-zinc-400">
                    <Filter className="w-4 h-4" />
                    <h3 className="font-bold uppercase tracking-wider text-[10px]">题库筛选</h3>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-zinc-500 mb-3">难度</label>
                      <div className="flex flex-wrap gap-2">
                        <button 
                          onClick={() => setFilterDifficulty('全部')}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${filterDifficulty === '全部' ? 'bg-indigo-600 text-white' : 'bg-white text-zinc-600 border border-zinc-200'}`}
                        >
                          全部
                        </button>
                        {DIFFICULTIES.map(d => (
                          <button 
                            key={d}
                            onClick={() => setFilterDifficulty(d)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${filterDifficulty === d ? 'bg-indigo-600 text-white' : 'bg-white text-zinc-600 border border-zinc-200'}`}
                          >
                            {d}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase font-bold text-zinc-500 mb-3">分类</label>
                      <div className="flex flex-wrap gap-2">
                        <button 
                          onClick={() => setFilterCategory('全部')}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${filterCategory === '全部' ? 'bg-indigo-600 text-white' : 'bg-white text-zinc-600 border border-zinc-200'}`}
                        >
                          全部
                        </button>
                        {CATEGORIES.map(c => (
                          <button 
                            key={c}
                            onClick={() => setFilterCategory(c)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${filterCategory === c ? 'bg-indigo-600 text-white' : 'bg-white text-zinc-600 border border-zinc-200'}`}
                          >
                            {c}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-2xl mx-auto bg-white rounded-[3rem] p-12 text-center shadow-xl border border-zinc-100 relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 via-violet-500 to-emerald-500"></div>
              
              <div className="w-24 h-24 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600 mx-auto mb-8">
                <Trophy className="w-12 h-12" />
              </div>

              <h2 className="text-4xl font-bold mb-2">练习完成!</h2>
              <p className="text-zinc-400 mb-10">你做得非常棒，继续保持！</p>

              <div className="grid grid-cols-2 gap-6 mb-12">
                <div className="bg-zinc-50 p-8 rounded-3xl border border-zinc-100">
                  <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-widest block mb-1">最终得分</span>
                  <span className="text-4xl font-mono font-bold text-indigo-600">{score} <span className="text-zinc-300 text-xl">/ {filteredQuestions.length}</span></span>
                </div>
                <div className="bg-zinc-50 p-8 rounded-3xl border border-zinc-100">
                  <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-widest block mb-1">正确率</span>
                  <span className="text-4xl font-mono font-bold text-emerald-600">{Math.round((score / filteredQuestions.length) * 100)}%</span>
                </div>
              </div>

              <div className="space-y-4">
                <button 
                  onClick={resetGame}
                  className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 flex items-center justify-center gap-3"
                >
                  <RotateCcw className="w-5 h-5" />
                  再练一次
                </button>
                <button 
                  onClick={() => { setFilterDifficulty('全部'); setFilterCategory('全部'); resetGame(); }}
                  className="w-full py-5 bg-white text-zinc-600 border border-zinc-200 rounded-2xl font-bold hover:bg-zinc-50 transition-all"
                >
                  尝试其他分类
                </button>
              </div>

              <div className="mt-12 pt-8 border-t border-zinc-100">
                <p className="text-sm text-zinc-400 italic">
                  "Success is the sum of small efforts, repeated day in and day out."
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
