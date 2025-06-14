import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { multiAgentAPI, userAPI } from '../config/api';

interface AgentResponse {
  task_type: string;
  complexity_level?: string;
  sub_tasks?: Array<{
    id: string;
    description: string;
    priority: string;
    estimated_effort: string;
    dependencies: string[];
  }>;
  analysis?: string;
  collaboration_strategy?: string;
  success_criteria?: string[];
  research_summary?: string;
  detailed_research?: any;
  alternative_approaches?: string[];
  knowledge_gaps?: string[];
  quality_score?: string;
  recommendations?: string;
  solution?: string;
  format?: string;
  implementation_steps?: Array<{
    step: number;
    action: string;
    details: string;
    expected_outcome: string;
  }>;
  explanation?: string;
  quality_metrics?: {
    completeness: string;
    accuracy: string;
    practicality: string;
  };
  validation_checklist?: string[];
  next_steps?: string[];
  feedback?: string;
}

interface MultiAgentResult {
  iteration: number;
  duration: number;
  quality_score: number;
  analyzer: AgentResponse;
  researcher: AgentResponse;
  synthesizer: AgentResponse;
  agents_performance: {
    [key: string]: {
      completeness: number;
      relevance: number;
      quality: number;
    };
  };
}

interface KugyAgentResponse {
  success: boolean;
  task_id: string;
  task: string;
  task_type: string;
  solution: string;
  format: string;
  explanation: string;
  implementation_steps: Array<{
    step: number;
    action: string;
    details: string;
    expected_outcome: string;
  }>;
  quality_metrics: {
    completeness: string;
    accuracy: string;
    practicality: string;
  };
  validation_checklist: string[];
  next_steps: string[];
  iterations: number;
  collaboration_score: number;
  multi_agent_results: MultiAgentResult[];
  models_used: {
    analyzer: string;
    researcher: string;
    synthesizer: string;
  };
  collaboration_metrics: {
    total_feedback_exchanges: number;
    quality_improvements: number[];
    convergence_score: number;
  };
  processing_time: string;
  error?: string;
}

const KugyAgent: React.FC = () => {
  const [task, setTask] = useState('');
  const [response, setResponse] = useState<KugyAgentResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [useMultiAgent, setUseMultiAgent] = useState(true);
  const [activeTab, setActiveTab] = useState('solution');
  const [expandedIteration, setExpandedIteration] = useState<number | null>(null);
  const [user, setUser] = useState<any>(null);
  const [credits, setCredits] = useState<string>('0');
  const router = useRouter();
  const responseRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const userData = await userAPI.getCurrentUser();
      setUser(userData.user);
      setCredits(userData.credits);
    } catch (error) {
      console.error('Auth check failed:', error);
      router.push('/');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!task.trim()) return;

    setLoading(true);
    setResponse(null);

    try {
      const data = await multiAgentAPI.processTask(task.trim(), useMultiAgent);
      setResponse(data);
      
      // Update credits after successful request
      if (data.success) {
        const newCredits = parseInt(credits) - 5;
        setCredits(newCredits.toString());
      }

      // Scroll to response
      setTimeout(() => {
        responseRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);

    } catch (error) {
      console.error('Error:', error);
      setResponse({
        success: false,
        task_id: '',
        task: task,
        task_type: 'general',
        solution: '',
        format: 'text',
        explanation: '',
        implementation_steps: [],
        quality_metrics: { completeness: '0', accuracy: '0', practicality: '0' },
        validation_checklist: [],
        next_steps: [],
        iterations: 0,
        collaboration_score: 0,
        multi_agent_results: [],
        models_used: { analyzer: '', researcher: '', synthesizer: '' },
        collaboration_metrics: { total_feedback_exchanges: 0, quality_improvements: [], convergence_score: 0 },
        processing_time: '0 seconds',
        error: 'Network error occurred'
      });
    } finally {
      setLoading(false);
    }
  };

  const getTaskTypeColor = (taskType: string) => {
    switch (taskType) {
      case 'coding': return 'bg-blue-100 text-blue-800';
      case 'analysis': return 'bg-green-100 text-green-800';
      case 'writing': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getQualityColor = (score: number) => {
    if (score >= 8) return 'text-green-600';
    if (score >= 6) return 'text-yellow-600';
    return 'text-red-600';
  };

  const renderAgentCard = (agentName: string, agentData: AgentResponse, performance?: any) => (
    <div className="bg-white rounded-lg border border-gray-200 p-4 mb-4">
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-semibold text-lg capitalize flex items-center">
          {agentName === 'analyzer' && '🔍'}
          {agentName === 'researcher' && '📚'}
          {agentName === 'synthesizer' && '⚡'}
          <span className="ml-2">{agentName}</span>
        </h4>
        {performance && (
          <div className="flex space-x-2 text-sm">
            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
              Quality: {(performance.quality * 10).toFixed(1)}
            </span>
            <span className="bg-green-100 text-green-800 px-2 py-1 rounded">
              Complete: {(performance.completeness * 100).toFixed(0)}%
            </span>
          </div>
        )}
      </div>
      
      {agentData.error ? (
        <div className="text-red-600 bg-red-50 p-3 rounded">
          Error: {agentData.error}
        </div>
      ) : (
        <div className="space-y-3">
          {agentData.analysis && (
            <div>
              <h5 className="font-medium text-gray-700 mb-1">Analysis:</h5>
              <p className="text-gray-600 text-sm">{agentData.analysis}</p>
            </div>
          )}
          
          {agentData.research_summary && (
            <div>
              <h5 className="font-medium text-gray-700 mb-1">Research Summary:</h5>
              <p className="text-gray-600 text-sm">{agentData.research_summary}</p>
            </div>
          )}
          
          {agentData.solution && (
            <div>
              <h5 className="font-medium text-gray-700 mb-1">Solution:</h5>
              <div className="text-gray-600 text-sm whitespace-pre-wrap">{agentData.solution}</div>
            </div>
          )}
          
          {agentData.sub_tasks && agentData.sub_tasks.length > 0 && (
            <div>
              <h5 className="font-medium text-gray-700 mb-1">Sub-tasks:</h5>
              <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                {agentData.sub_tasks.map((subtask, idx) => (
                  <li key={idx}>
                    <span className="font-medium">{subtask.description}</span>
                    <span className={`ml-2 px-2 py-1 rounded text-xs ${
                      subtask.priority === 'high' ? 'bg-red-100 text-red-800' :
                      subtask.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {subtask.priority}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {agentData.feedback && (
            <div>
              <h5 className="font-medium text-gray-700 mb-1">Feedback:</h5>
              <p className="text-gray-600 text-sm italic">{agentData.feedback}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );

  return (
    <>
      <Head>
        <title>KugyAgent - Multi-AI Collaboration System</title>
        <meta name="description" content="Advanced multi-agent AI system for complex task solving" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => router.push('/menu')}
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  ← Back to Menu
                </button>
                <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                  🤖 KugyAgent
                  <span className="ml-2 text-sm font-normal text-gray-500">Multi-AI Collaboration</span>
                </h1>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">Credits: {credits}</span>
                <span className="text-sm text-gray-600">Cost: 5 credits</span>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Task Input Form */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              🎯 Task Description
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <textarea
                  value={task}
                  onChange={(e) => setTask(e.target.value)}
                  placeholder="Describe your task in detail. KugyAgent will analyze, research, and provide a comprehensive solution using 3 specialized AI models..."
                  className="w-full h-32 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  disabled={loading}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={useMultiAgent}
                      onChange={(e) => setUseMultiAgent(e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      disabled={loading}
                    />
                    <span className="ml-2 text-sm text-gray-700">
                      Use Multi-Agent Collaboration (Recommended)
                    </span>
                  </label>
                </div>
                
                <button
                  type="submit"
                  disabled={loading || !task.trim() || parseInt(credits) < 5}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <span>🚀</span>
                      <span>Start KugyAgent</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Response Display */}
          {response && (
            <div ref={responseRef} className="space-y-6">
              {/* Status Header */}
              <div className={`rounded-xl p-6 ${response.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{response.success ? '✅' : '❌'}</span>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {response.success ? 'Task Completed Successfully' : 'Task Failed'}
                      </h3>
                      <div className="flex items-center space-x-4 mt-1">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getTaskTypeColor(response.task_type)}`}>
                          {response.task_type}
                        </span>
                        <span className="text-sm text-gray-600">
                          {response.iterations} iteration{response.iterations !== 1 ? 's' : ''}
                        </span>
                        <span className="text-sm text-gray-600">
                          {response.processing_time}
                        </span>
                        {response.collaboration_score > 0 && (
                          <span className={`text-sm font-medium ${getQualityColor(response.collaboration_score * 10)}`}>
                            Collaboration: {(response.collaboration_score * 10).toFixed(1)}/10
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {response.error ? (
                <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-red-800 mb-2">Error Details</h3>
                  <p className="text-red-700">{response.error}</p>
                </div>
              ) : (
                <>
                  {/* Navigation Tabs */}
                  <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                    <div className="border-b border-gray-200">
                      <nav className="flex space-x-8 px-6">
                        {[
                          { id: 'solution', label: '🎯 Final Solution', count: null },
                          { id: 'iterations', label: '🔄 Agent Iterations', count: response.iterations },
                          { id: 'models', label: '🤖 AI Models Used', count: 3 },
                          { id: 'metrics', label: '📊 Performance Metrics', count: null }
                        ].map((tab) => (
                          <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                              activeTab === tab.id
                                ? 'border-blue-500 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                          >
                            {tab.label}
                            {tab.count && (
                              <span className="ml-2 bg-gray-100 text-gray-600 py-1 px-2 rounded-full text-xs">
                                {tab.count}
                              </span>
                            )}
                          </button>
                        ))}
                      </nav>
                    </div>

                    <div className="p-6">
                      {/* Final Solution Tab */}
                      {activeTab === 'solution' && (
                        <div className="space-y-6">
                          <div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-4">Final Solution</h3>
                            <div className="bg-gray-50 rounded-lg p-4">
                              <pre className="whitespace-pre-wrap text-gray-800 font-mono text-sm">
                                {response.solution}
                              </pre>
                            </div>
                          </div>

                          {response.explanation && (
                            <div>
                              <h4 className="text-lg font-medium text-gray-900 mb-2">Explanation</h4>
                              <p className="text-gray-700">{response.explanation}</p>
                            </div>
                          )}

                          {response.implementation_steps && response.implementation_steps.length > 0 && (
                            <div>
                              <h4 className="text-lg font-medium text-gray-900 mb-3">Implementation Steps</h4>
                              <div className="space-y-3">
                                {response.implementation_steps.map((step, idx) => (
                                  <div key={idx} className="bg-blue-50 rounded-lg p-4">
                                    <div className="flex items-start space-x-3">
                                      <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium">
                                        {step.step}
                                      </span>
                                      <div className="flex-1">
                                        <h5 className="font-medium text-gray-900">{step.action}</h5>
                                        <p className="text-gray-700 text-sm mt-1">{step.details}</p>
                                        <p className="text-blue-700 text-sm mt-2 font-medium">
                                          Expected: {step.expected_outcome}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {response.validation_checklist && response.validation_checklist.length > 0 && (
                            <div>
                              <h4 className="text-lg font-medium text-gray-900 mb-3">Validation Checklist</h4>
                              <ul className="space-y-2">
                                {response.validation_checklist.map((item, idx) => (
                                  <li key={idx} className="flex items-center space-x-2">
                                    <span className="text-green-600">✓</span>
                                    <span className="text-gray-700">{item}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {response.next_steps && response.next_steps.length > 0 && (
                            <div>
                              <h4 className="text-lg font-medium text-gray-900 mb-3">Next Steps</h4>
                              <ul className="space-y-2">
                                {response.next_steps.map((step, idx) => (
                                  <li key={idx} className="flex items-center space-x-2">
                                    <span className="text-blue-600">→</span>
                                    <span className="text-gray-700">{step}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Agent Iterations Tab */}
                      {activeTab === 'iterations' && (
                        <div className="space-y-4">
                          <h3 className="text-xl font-semibold text-gray-900">Agent Collaboration Process</h3>
                          {response.multi_agent_results.map((iteration, idx) => (
                            <div key={idx} className="border border-gray-200 rounded-lg">
                              <button
                                onClick={() => setExpandedIteration(expandedIteration === idx ? null : idx)}
                                className="w-full px-4 py-3 text-left bg-gray-50 hover:bg-gray-100 transition-colors flex items-center justify-between"
                              >
                                <div className="flex items-center space-x-3">
                                  <span className="font-medium">Iteration {iteration.iteration}</span>
                                  <span className="text-sm text-gray-600">
                                    {iteration.duration.toFixed(2)}s
                                  </span>
                                  <span className={`text-sm font-medium ${getQualityColor(iteration.quality_score)}`}>
                                    Quality: {iteration.quality_score.toFixed(1)}/10
                                  </span>
                                </div>
                                <span className="text-gray-400">
                                  {expandedIteration === idx ? '▼' : '▶'}
                                </span>
                              </button>
                              
                              {expandedIteration === idx && (
                                <div className="p-4 space-y-4">
                                  {renderAgentCard('analyzer', iteration.analyzer, iteration.agents_performance?.analyzer)}
                                  {renderAgentCard('researcher', iteration.researcher, iteration.agents_performance?.researcher)}
                                  {renderAgentCard('synthesizer', iteration.synthesizer, iteration.agents_performance?.synthesizer)}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}

                      {/* AI Models Tab */}
                      {activeTab === 'models' && (
                        <div className="space-y-6">
                          <h3 className="text-xl font-semibold text-gray-900">AI Models Used</h3>
                          <div className="grid md:grid-cols-3 gap-6">
                            {Object.entries(response.models_used).map(([agentName, model]) => (
                              <div key={agentName} className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-4">
                                <div className="flex items-center space-x-2 mb-3">
                                  <span className="text-2xl">
                                    {agentName === 'analyzer' && '🔍'}
                                    {agentName === 'researcher' && '📚'}
                                    {agentName === 'synthesizer' && '⚡'}
                                  </span>
                                  <h4 className="font-semibold text-gray-900 capitalize">{agentName}</h4>
                                </div>
                                <p className="text-sm text-gray-600 font-mono bg-white rounded px-2 py-1">
                                  {model}
                                </p>
                                <div className="mt-3 text-xs text-gray-500">
                                  {agentName === 'analyzer' && 'Strategic Analysis & Task Decomposition'}
                                  {agentName === 'researcher' && 'Deep Research & Knowledge Synthesis'}
                                  {agentName === 'synthesizer' && 'Solution Integration & Final Output'}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Performance Metrics Tab */}
                      {activeTab === 'metrics' && (
                        <div className="space-y-6">
                          <h3 className="text-xl font-semibold text-gray-900">Performance Metrics</h3>
                          
                          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div className="bg-blue-50 rounded-lg p-4">
                              <h4 className="font-medium text-blue-900">Collaboration Score</h4>
                              <p className="text-2xl font-bold text-blue-600">
                                {(response.collaboration_score * 10).toFixed(1)}/10
                              </p>
                            </div>
                            
                            <div className="bg-green-50 rounded-lg p-4">
                              <h4 className="font-medium text-green-900">Feedback Exchanges</h4>
                              <p className="text-2xl font-bold text-green-600">
                                {response.collaboration_metrics.total_feedback_exchanges}
                              </p>
                            </div>
                            
                            <div className="bg-purple-50 rounded-lg p-4">
                              <h4 className="font-medium text-purple-900">Processing Time</h4>
                              <p className="text-2xl font-bold text-purple-600">
                                {response.processing_time}
                              </p>
                            </div>
                            
                            <div className="bg-yellow-50 rounded-lg p-4">
                              <h4 className="font-medium text-yellow-900">Iterations</h4>
                              <p className="text-2xl font-bold text-yellow-600">
                                {response.iterations}
                              </p>
                            </div>
                          </div>

                          {response.quality_metrics && (
                            <div>
                              <h4 className="text-lg font-medium text-gray-900 mb-3">Quality Assessment</h4>
                              <div className="grid md:grid-cols-3 gap-4">
                                {Object.entries(response.quality_metrics).map(([metric, score]) => (
                                  <div key={metric} className="bg-gray-50 rounded-lg p-4">
                                    <h5 className="font-medium text-gray-700 capitalize">{metric}</h5>
                                    <p className="text-xl font-bold text-gray-900">{score}/10</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {response.collaboration_metrics.quality_improvements.length > 0 && (
                            <div>
                              <h4 className="text-lg font-medium text-gray-900 mb-3">Quality Progression</h4>
                              <div className="bg-gray-50 rounded-lg p-4">
                                <div className="flex items-center space-x-2">
                                  {response.collaboration_metrics.quality_improvements.map((score, idx) => (
                                    <div key={idx} className="flex flex-col items-center">
                                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white ${getQualityColor(score).includes('green') ? 'bg-green-500' : getQualityColor(score).includes('yellow') ? 'bg-yellow-500' : 'bg-red-500'}`}>
                                        {idx + 1}
                                      </div>
                                      <span className="text-xs text-gray-600 mt-1">{score.toFixed(1)}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default KugyAgent;