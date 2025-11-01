import React, { useState } from 'react';
import { Shield, TrendingUp, ShieldCheck, ChevronRight, Sparkles } from 'lucide-react';

const Dashboard = () => {
  const [hoveredCard, setHoveredCard] = useState(null);

  const features = [
    {
      id: 'all-logs',
      title: 'All Logs & AI Recommendation',
      desc: 'View all ingested logs and receive AI-generated recommendations for suspicious activity.',
      path: '/admin/all-logs',
      icon: Shield,
      gradient: 'from-blue-500 to-cyan-500',
      bgGradient: 'from-blue-500/10 to-cyan-500/10',
      iconColor: 'text-blue-500',
    },
    {
      id: 'log-analysis',
      title: 'Log Analysis',
      desc: 'Detailed analysis and visualizations for selected log files and time ranges.',
      path: '/admin/log-analysis',
      icon: TrendingUp,
      gradient: 'from-purple-500 to-pink-500',
      bgGradient: 'from-purple-500/10 to-pink-500/10',
      iconColor: 'text-purple-500',
    },
    {
      id: 'blocked-ips',
      title: 'Blocked IPs',
      desc: 'View and manage blocked IP addresses. Block or revoke access as needed.',
      path: '/admin/blocked-ips',
      icon: ShieldCheck,
      gradient: 'from-orange-500 to-red-500',
      bgGradient: 'from-orange-500/10 to-red-500/10',
      iconColor: 'text-orange-500',
    },
  ];

  const onCardClick = (path) => {
    window.location.href = path;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br  p-6 sm:p-8 md:p-12">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-12 animate-fade-in">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-blue-500/20 rounded-xl border border-blue-500/30">
              <Shield className="text-blue-500" size={32} />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Admin Dashboard
              </h1>
              <div className="flex items-center gap-2">
                <Sparkles size={16} className="text-yellow-400" />
                <p className="text-gray-400 text-sm md:text-base">
                  Manage your security infrastructure with powerful tools
                </p>
              </div>
            </div>
          </div>
          
          {/* Stats Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
            <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4 backdrop-blur-sm">
              <p className="text-gray-400 text-xs uppercase tracking-wide mb-1">Available Features</p>
              <p className="text-2xl font-bold text-white">{features.length}</p>
            </div>
            <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4 backdrop-blur-sm">
              <p className="text-gray-400 text-xs uppercase tracking-wide mb-1">Security Level</p>
              <p className="text-2xl font-bold text-green-400">Active</p>
            </div>
            <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4 backdrop-blur-sm">
              <p className="text-gray-400 text-xs uppercase tracking-wide mb-1">System Status</p>
              <p className="text-2xl font-bold text-blue-400">Online</p>
            </div>
          </div>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            const isHovered = hoveredCard === feature.id;
            
            return (
              <div
                key={feature.id}
                onClick={() => onCardClick(feature.path)}
                onMouseEnter={() => setHoveredCard(feature.id)}
                onMouseLeave={() => setHoveredCard(null)}
                role="button"
                tabIndex={0}
                onKeyPress={(e) => { if (e.key === 'Enter') onCardClick(feature.path); }}
                className={`
                  group relative cursor-pointer rounded-2xl border border-gray-700 
                  bg-gradient-to-br ${feature.bgGradient} backdrop-blur-sm
                  transition-all duration-300 ease-out
                  ${isHovered ? 'scale-105 shadow-2xl' : 'hover:scale-102'}
                  animate-slide-up
                `}
                style={{
                  animationDelay: `${index * 100}ms`,
                }}
              >
                {/* Gradient Border Effect on Hover */}
                <div className={`
                  absolute inset-0 rounded-2xl bg-gradient-to-r ${feature.gradient} opacity-0 
                  group-hover:opacity-20 transition-opacity duration-300 blur-xl
                `} />
                
                {/* Card Content */}
                <div className="relative p-6 md:p-8">
                  {/* Icon */}
                  <div className={`
                    inline-flex p-4 rounded-xl mb-4 bg-gray-800/80 border border-gray-700
                    transition-all duration-300
                    ${isHovered ? 'scale-110 rotate-3' : ''}
                  `}>
                    <Icon className={`${feature.iconColor} transition-transform duration-300`} size={32} />
                  </div>

                  {/* Title */}
                  <h2 className="text-xl md:text-2xl font-bold text-white mb-3 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:bg-clip-text group-hover:from-blue-400 group-hover:to-purple-400 transition-all duration-300">
                    {feature.title}
                  </h2>

                  {/* Description */}
                  <p className="text-gray-400 text-sm md:text-base mb-4 leading-relaxed">
                    {feature.desc}
                  </p>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-700/50">
                    <code className="text-xs text-gray-500 bg-gray-800/50 px-2 py-1 rounded">
                      {feature.path}
                    </code>
                    <div className={`
                      flex items-center gap-1 text-sm font-medium
                      bg-gradient-to-r ${feature.gradient} bg-clip-text text-transparent
                      transition-transform duration-300
                      ${isHovered ? 'translate-x-1' : ''}
                    `}>
                      <span>Access</span>
                      <ChevronRight size={16} className={feature.iconColor} />
                    </div>
                  </div>
                </div>

                {/* Corner Accent */}
                <div className={`
                  absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${feature.gradient} 
                  opacity-0 group-hover:opacity-10 rounded-bl-full rounded-tr-2xl
                  transition-opacity duration-300
                `} />
              </div>
            );
          })}
        </div>

        {/* Footer Note */}
        <div className="mt-12 text-center">
          <p className="text-gray-500 text-sm">
            Click any card to navigate to its dedicated admin page
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }

        .animate-slide-up {
          animation: slide-up 0.6s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  );
};

export default Dashboard;