import { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import Editor from '@monaco-editor/react';
import { useParams } from 'react-router';
import axiosClient from "../utils/axiosClient";
import SubmissionHistory from "../components/SubmissionHistory";
import ChatAi from '../components/ChatAi';
import Editorial from '../components/Editorial';

const langMap = {
  cpp: 'C++',
  java: 'Java',
  javascript: 'JavaScript'
};

const ProblemPage = () => {
  const [problem, setProblem] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState('javascript');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [runResult, setRunResult] = useState(null);
  const [submitResult, setSubmitResult] = useState(null);
  const [activeLeftTab, setActiveLeftTab] = useState('description');
  const [activeRightTab, setActiveRightTab] = useState('code');
  const editorRef = useRef(null);
  let { problemId } = useParams();

  const { handleSubmit } = useForm();

  useEffect(() => {
    const fetchProblem = async () => {
      setLoading(true);
      try {
        const response = await axiosClient.get(`/problem/problemById/${problemId}`);
        const initialCode = response.data.startCode.find(sc => sc.language === langMap[selectedLanguage]).initialCode;
        setProblem(response.data);
        setCode(initialCode);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching problem:', error);
        setLoading(false);
      }
    };

    fetchProblem();
  }, [problemId]);

  useEffect(() => {
    if (problem) {
      const initialCode = problem.startCode.find(sc => sc.language === langMap[selectedLanguage]).initialCode;
      setCode(initialCode);
    }
  }, [selectedLanguage, problem]);

  const handleEditorChange = (value) => setCode(value || '');
  const handleEditorDidMount = (editor) => (editorRef.current = editor);
  const handleLanguageChange = (language) => setSelectedLanguage(language);

  const handleRun = async () => {
    setLoading(true);
    setRunResult(null);
    try {
      const response = await axiosClient.post(`/submission/run/${problemId}`, { code, language: selectedLanguage });
      setRunResult(response.data);
      setActiveRightTab('testcase');
    } catch (error) {
      setRunResult({ success: false, error: 'Internal server error' });
      setActiveRightTab('testcase');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitCode = async () => {
    setLoading(true);
    setSubmitResult(null);
    try {
      const response = await axiosClient.post(`/submission/submit/${problemId}`, { code, language: selectedLanguage });
      setSubmitResult(response.data);
      setActiveRightTab('result');
    } catch (error) {
      setSubmitResult(null);
      setActiveRightTab('result');
    } finally {
      setLoading(false);
    }
  };

  const getLanguageForMonaco = (lang) => {
    switch (lang) {
      case 'javascript': return 'javascript';
      case 'java': return 'java';
      case 'cpp': return 'cpp';
      default: return 'javascript';
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'easy': return 'text-green-500';
      case 'medium': return 'text-yellow-500';
      case 'hard': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  if (loading && !problem) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 text-white">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  return (
    <div className="h-screen flex bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 text-gray-200">
      {/* Left Panel */}
      <div className="w-1/2 flex flex-col border-r border-slate-700 backdrop-blur-md bg-slate-900/40 shadow-xl">
        {/* Left Tabs */}
        <div className="tabs tabs-bordered bg-slate-800/60 px-4 rounded-t-lg">
          {['description', 'editorial', 'solutions', 'submissions', 'ChatAI'].map((tab) => (
            <button
              key={tab}
              className={`tab transition-all duration-200 text-sm font-semibold rounded-t-md ${
                activeLeftTab === tab
                  ? 'tab-active text-primary border-primary'
                  : 'hover:text-primary/80 hover:bg-slate-700/50'
              }`}
              onClick={() => setActiveLeftTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Left Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {problem && (
            <>
              {activeLeftTab === 'description' && (
                <div>
                  <div className="flex items-center gap-4 mb-6">
                    <h1 className="text-2xl font-bold text-white">{problem.title}</h1>
                    <div className={`badge badge-outline ${getDifficultyColor(problem.difficulty)}`}>
                      {problem.difficulty.charAt(0).toUpperCase() + problem.difficulty.slice(1)}
                    </div>
                    <div className="badge badge-primary">{problem.tags}</div>
                  </div>

                  <div className="prose prose-invert max-w-none text-gray-300">
                    <div className="whitespace-pre-wrap text-sm leading-relaxed">
                      {problem.description}
                    </div>
                  </div>

                  <div className="mt-8">
                    <h3 className="text-lg font-semibold mb-4 text-primary">Examples:</h3>
                    <div className="space-y-4">
                      {problem.visibleTestCases.map((example, index) => (
                        <div
                          key={index}
                          className="bg-slate-800/60 border border-slate-700 p-4 rounded-xl shadow-md hover:shadow-primary/20 transition"
                        >
                          <h4 className="font-semibold mb-2 text-primary/90">Example {index + 1}</h4>
                          <div className="space-y-2 text-sm font-mono">
                            <div><strong>Input:</strong> {example.input}</div>
                            <div><strong>Output:</strong> {example.output}</div>
                            <div><strong>Explanation:</strong> {example.explanation}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeLeftTab === 'editorial' && (
                <div className="prose prose-invert max-w-none">
                  <h2 className="text-xl font-bold mb-4 text-primary">Editorial</h2>
                  <Editorial secureUrl={problem.secureUrl} thumbnailUrl={problem.thumbnailUrl} duration={problem.duration} />
                </div>
              )}

              {activeLeftTab === 'solutions' && (
                <div>
                  <h2 className="text-xl font-bold mb-4 text-primary">Solutions</h2>
                  <div className="space-y-6">
                    {problem.referenceSolution?.map((solution, index) => (
                      <div key={index} className="border border-slate-700 rounded-xl shadow-md bg-slate-800/50">
                        <div className="bg-slate-700/50 px-4 py-2 rounded-t-xl">
                          <h3 className="font-semibold text-primary/90">{problem.title} - {solution.language}</h3>
                        </div>
                        <div className="p-4">
                          <pre className="bg-slate-900 p-4 rounded-lg text-sm overflow-x-auto">
                            <code>{solution.completeCode}</code>
                          </pre>
                        </div>
                      </div>
                    )) || <p className="text-gray-500">Solutions will be available after you solve the problem.</p>}
                  </div>
                </div>
              )}

              {activeLeftTab === 'submissions' && (
                <div>
                  <h2 className="text-xl font-bold mb-4 text-primary">My Submissions</h2>
                  <SubmissionHistory problemId={problemId} />
                </div>
              )}

              {activeLeftTab === 'ChatAI' && (
                <div className="prose prose-invert max-w-none">
                  <h2 className="text-xl font-bold mb-4 text-primary">ChatAI</h2>
                  <ChatAi problem={problem} />
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Right Panel */}
      <div className="w-1/2 flex flex-col backdrop-blur-md bg-slate-900/40">
        <div className="tabs tabs-bordered bg-slate-800/60 px-4 rounded-t-lg">
          {['code', 'testcase', 'result'].map((tab) => (
            <button
              key={tab}
              className={`tab transition-all duration-200 text-sm font-semibold rounded-t-md ${
                activeRightTab === tab
                  ? 'tab-active text-primary border-primary'
                  : 'hover:text-primary/80 hover:bg-slate-700/50'
              }`}
              onClick={() => setActiveRightTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Right Content */}
        <div className="flex-1 flex flex-col">
          {activeRightTab === 'code' && (
            <div className="flex-1 flex flex-col">
              <div className="flex justify-between items-center p-4 border-b border-slate-700 bg-slate-800/40">
                <div className="flex gap-2">
                  {['javascript', 'java', 'cpp'].map((lang) => (
                    <button
                      key={lang}
                      className={`btn btn-sm rounded-md shadow ${
                        selectedLanguage === lang
                          ? 'btn-primary'
                          : 'btn-ghost hover:bg-slate-700/60'
                      }`}
                      onClick={() => setSelectedLanguage(lang)}
                    >
                      {lang === 'cpp' ? 'C++' : lang === 'javascript' ? 'JavaScript' : 'Java'}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex-1">
                <Editor
                  height="100%"
                  language={getLanguageForMonaco(selectedLanguage)}
                  value={code}
                  onChange={handleEditorChange}
                  onMount={handleEditorDidMount}
                  theme="vs-dark"
                  options={{
                    fontSize: 14,
                    minimap: { enabled: false },
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                    wordWrap: 'on',
                  }}
                />
              </div>

              <div className="p-4 border-t border-slate-700 flex justify-between bg-slate-800/40">
                <button
                  className="btn btn-ghost btn-sm hover:bg-slate-700/60 transition"
                  onClick={() => setActiveRightTab('testcase')}
                >
                  Console
                </button>
                <div className="flex gap-2">
                  <button
                    className={`btn btn-outline btn-sm rounded-md shadow ${loading ? 'loading' : ''}`}
                    onClick={handleRun}
                    disabled={loading}
                  >
                    Run
                  </button>
                  <button
                    className={`btn btn-primary btn-sm rounded-md shadow ${loading ? 'loading' : ''}`}
                    onClick={handleSubmitCode}
                    disabled={loading}
                  >
                    Submit
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Testcase and Result remain visually enhanced automatically by DaisyUI’s theme */}
          {activeRightTab !== 'code' && (
            <div className="flex-1 p-4 overflow-y-auto bg-slate-900/30">
              {activeRightTab === 'testcase' && (
                <>
                  <h3 className="font-semibold mb-4 text-primary">Test Results</h3>
                  {runResult ? (
                    <div
                      className={`alert ${
                        runResult.success ? 'alert-success' : 'alert-error'
                      } shadow-lg`}
                    >
                      <div>
                        {runResult.success ? (
                          <p>✅ All test cases passed!</p>
                        ) : (
                          <p>❌ Some test cases failed.</p>
                        )}
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-500">Click "Run" to test your code.</p>
                  )}
                </>
              )}
              {activeRightTab === 'result' && (
                <>
                  <h3 className="font-semibold mb-4 text-primary">Submission Result</h3>
                  {submitResult ? (
                    <div
                      className={`alert ${
                        submitResult.accepted ? 'alert-success' : 'alert-error'
                      } shadow-lg`}
                    >
                      <div>
                        {submitResult.accepted ? (
                          <p>🎉 Accepted!</p>
                        ) : (
                          <p>❌ {submitResult.error}</p>
                        )}
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-500">Click "Submit" to evaluate your solution.</p>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProblemPage;
